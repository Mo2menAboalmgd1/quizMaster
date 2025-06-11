import React, { useState } from "react";
import { useCurrentUser } from "../store/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faCopy,
  faEdit,
  faPhone,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useEditUserdataMutation, useSignOut } from "../QueriesAndMutations/mutationsHooks";
import AlertBox from "../components/AlertBox";
import { signOut } from "../api/AllApiFunctions";

export default function UserProfileDataComponent({ user }) {
  const { currentUser } = useCurrentUser();

  const [isEdit, setIsEdit] = useState(null);

  const isMyAccount = user.id === currentUser.id;
  const isTeacher = user.type === "teacher";

  const { mutate: signOut } = useSignOut();

  return (
    <div className="relative rounded-3xl flex items-center justify-between">
      {!isEdit && <ShowUserData user={user} isTeacher={isTeacher} />}
      {isMyAccount && !isEdit && (
        <div className="flex gap-3">
          <button
            onClick={() => setIsEdit(true)}
            className="py-2 px-4 bg-gray-200 rounded-lg font-bold cursor-pointer"
          >
            <span className="max-lg:hidden max-lg:h-10 max-lg:w-10">
              تعديل البيانات
            </span>
            <span className="lg:hidden max-lg:h-10 max-lg:w-10">
              <FontAwesomeIcon icon={faEdit} />
            </span>
          </button>
          <button
            onClick={signOut}
            className="py-2 px-4 bg-red-600 text-white rounded-lg font-bold cursor-pointer"
          >
            <span className="max-lg:hidden max-lg:h-10 max-lg:w-10">
              تسجيل الخروج
            </span>
            <span className="lg:hidden max-lg:h-10 max-lg:w-10">
              <FontAwesomeIcon icon={faSignOut} />
            </span>
          </button>
        </div>
      )}
      {isEdit && (
        <EditUserData user={user} isTeacher={isTeacher} setIsEdit={setIsEdit} />
      )}
    </div>
  );
}

function ShowUserData({ user }) {
  const [isCopy, setIsCopy] = useState(false);

  const handleCopy = async (text) => {
    navigator.clipboard.writeText(text);
    setIsCopy(text);
    toast.success("تم النسخ", {
      duration: 1000,
    });
    setTimeout(() => {
      setIsCopy(null);
    }, 1000);
  };

  return (
    <div>
      {/* img and name and type and subject if teacher */}
      <div className="flex items-center gap-5">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="user avatar image"
            className="h-36 w-36 rounded-full object-cover"
          />
        ) : (
          <div className="h-36 w-36 rounded-full flex items-center justify-center bg-gradient-to-tl from-blue-600 to-cyan-400 text-white text-4xl">
            <FontAwesomeIcon icon={faUser} />
          </div>
        )}
        <div>
          <h2 className="font-bold text-blue-500 text-2xl">{user.name}</h2>
          <div className="flex">
            <p>
              <span className="text-gray-600 text-sm">@</span>
              <span className="text-gray-600 text-sm">{user.userName}</span>
            </p>
            <button
              disabled={isCopy === user.userName}
              className={clsx(
                "px-2 cursor-pointer text-sm",
                isCopy === user.userName ? "text-blue-600" : "text-gray-400"
              )}
              onClick={() => handleCopy(user.userName)}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
          <div className="flex mt-0.5">
            <p className="flex items-center gap-1">
              <span className="text-gray-500 text-xs">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <span className="text-gray-600 text-sm">{user.phoneNumber}</span>
            </p>
            <button
              disabled={isCopy === user.phoneNumber}
              className={clsx(
                "px-2 cursor-pointer text-sm",
                isCopy === user.phoneNumber ? "text-blue-600" : "text-gray-400"
              )}
              onClick={() => handleCopy(user.phoneNumber)}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
          {/* <div className="flex"> */}
          {/* <p className="text-gray-600">
              {isTeacher
                ? isMale
                  ? "معلم"
                  : "معلمة"
                : isMale
                ? "طالب"
                : "طالبة"}
            </p> */}
          {/* {isTeacher && <span>: {user.subject}</span>} */}
          {/* </div> */}
        </div>
      </div>

      {/* other data */}
      <div className="space-y-2 max-md:mt-3">
        {/* <p>
          <span className="font-bold text-gray-700">النوع: </span>
          <span>{user.gender === "male" ? "ذكر" : "أنثى"}</span>
        </p> */}
      </div>
    </div>
  );
}

function EditUserData({ user, isTeacher, setIsEdit }) {
  const { currentUser } = useCurrentUser();
  const [isSubmitEdit, setIsSubmitEdit] = React.useState(false);
  const [avatar, setAvatar] = React.useState(user.avatar);
  const [userData, setUserData] = React.useState({
    name: user.name,
    phoneNumber: user.phoneNumber,
    subject: user.subject,
    gender: user.gender,
  });

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const { mutate: editUserDataMutation } = useEditUserdataMutation();

  const handleEditUserData = ({ avatar, userData }) => {
    editUserDataMutation({
      update: {
        avatar,
        userData,
        table: currentUser.type === "teacher" ? "teachers" : "students",
      },
      action: {
        userId: user.id,
      },
    });
    setIsSubmitEdit(false);
    setIsEdit(false);
  };

  return (
    <div>
      <h1 className="text-center text-blue-500 text-lg font-bold mb-3">
        تعديل البيانات الشخصية
      </h1>
      {/* edit data form div */}
      <div>
        <div className="flex gap-3 items-center">
          {/* change image */}
          <div className="flex justify-center w-full">
            <div className="relative w-fit overflow-hidden rounded-full group">
              <img
                className="h-24 w-24 object-cover rounded-full shadow-md"
                src={
                  avatar instanceof File
                    ? URL.createObjectURL(avatar)
                    : avatar ||
                      "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"
                }
                alt="edit user image"
              />
              <label
                htmlFor="imgPicker"
                type="button"
                className="h-1/2 bg-black/50 absolute left-0 top-1/2 w-full text-white opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center transition-opacity"
              >
                <FontAwesomeIcon icon={faEdit} />
              </label>
              <input
                type="file"
                name="img"
                id="imgPicker"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAvatar(file);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* change name */}
        <div className="grow">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            الاسم
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            placeholder="الاسم"
            defaultValue={user.name}
            onChange={handleChangeUserData}
          />
        </div>

        {/* change phone number */}
        <div className="grow mt-2">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            رقم الهاتف
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            placeholder="رقم الهاتف"
            defaultValue={user.phoneNumber}
            onChange={handleChangeUserData}
          />
        </div>

        {/* change subject */}
        {isTeacher && (
          <div className="grow mt-2">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              المادة الدراسية
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="المادة الدراسية"
              defaultValue={user.subject}
              onChange={handleChangeUserData}
            />
          </div>
        )}

        {/* change gender */}
        <div className="grow mt-2">
          <h3 className="text-sm font-medium text-gray-700">الجنس</h3>
          <div className="flex gap-3 py-1">
            <div className="flex gap-1">
              <input
                type="radio"
                name="gender"
                id="male"
                value="male"
                defaultChecked={user.gender === "male"}
                onChange={handleChangeUserData}
              />
              <label htmlFor="male">ذكر</label>
            </div>
            <div className="flex gap-1">
              <input
                type="radio"
                name="gender"
                id="female"
                value="female"
                defaultChecked={user.gender === "female"}
                onChange={handleChangeUserData}
              />
              <label htmlFor="female">أنثى</label>
            </div>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex justify-end gap-3">
          {/* submit changes */}
          <button
            onClick={() => setIsSubmitEdit(true)}
            className="px-3 py-1.5 space-x-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <span>حفظ التغييرات</span>
            <FontAwesomeIcon icon={faEdit} />
          </button>

          {/* cancel changes */}
          <button
            onClick={() => setIsEdit(false)}
            className="px-3 py-1.5 space-x-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors cursor-pointer"
          >
            <span>إغلاق</span>
            <FontAwesomeIcon icon={faCancel} />
          </button>
        </div>

        {isSubmitEdit && (
          <AlertBox
            title={"تعديل البيانات"}
            type={"blue"}
            message={"هل أنت متأكد من تعديل بياناتك الشخصية؟"}
            firstOptionText={"نعم، تأكيد"}
            firstOptionFunction={() => handleEditUserData({ avatar, userData })}
            setOpen={setIsSubmitEdit}
            isSecondOption={false}
          />
        )}
      </div>
    </div>
  );
}
