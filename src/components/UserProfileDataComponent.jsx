import React, { useState } from "react";
import { useCurrentUser } from "../store/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faCopy,
  faEdit,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useEditUserdataMutation } from "../QueriesAndMutations/mutationsHooks";
import AlertBox from "../components/AlertBox";

export default function UserProfileDataComponent({ user }) {
  const { currentUser } = useCurrentUser();

  const [isEdit, setIsEdit] = useState(null);

  const isMyAccount = user.id === currentUser.id;
  const isTeacher = user.type === "teacher";

  return (
    <div className="p-4 relative bg-white border border-gray-200 rounded-3xl">
      {isMyAccount && !isEdit && (
        <button
          onClick={() => setIsEdit(true)}
          className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors absolute top-4 right-4"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )}
      {!isEdit && <ShowUserData user={user} isTeacher={isTeacher} />}
      {isEdit && (
        <EditUserData user={user} isTeacher={isTeacher} setIsEdit={setIsEdit} />
      )}
    </div>
  );
}

function ShowUserData({ user, isTeacher }) {
  const [isCopy, setIsCopy] = useState(false);
  const isMale = user.gender === "male";

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
    <div dir="rtl">
      {/* img and name and type and subject if teacher */}
      <div className="flex flex-col items-center gap-3">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="user avatar image"
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full flex items-center justify-center bg-gradient-to-tl from-blue-600 to-cyan-400 text-white text-2xl">
            <FontAwesomeIcon icon={faUser} />
          </div>
        )}
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-blue-500 text-xl">{user.name}</h2>
          <div className="flex">
            <p>
              {isTeacher
                ? isMale
                  ? "معلم"
                  : "معلمة"
                : isMale
                ? "طالب"
                : "طالبة"}
            </p>
            {isTeacher && <span>: {user.subject}</span>}
          </div>
        </div>
      </div>

      {/* other data */}
      <div className="space-y-2 max-md:mt-3">
        <p>
          <span className="font-bold text-gray-700">اسم المستخدم: </span>
          <span>{user.userName}</span>
          <button
            disabled={isCopy === user.userName}
            className={clsx(
              "px-2 cursor-pointer",
              isCopy === user.userName ? "text-green-600" : "text-gray-400"
            )}
            onClick={() => handleCopy(user.userName)}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </p>
        {/* <p>
          <span className="font-bold text-gray-700">النوع: </span>
          <span>{user.gender === "male" ? "ذكر" : "أنثى"}</span>
        </p> */}
        <p>
          <span className="font-bold text-gray-700">رقم الهاتف: </span>
          <span>{user.phoneNumber}</span>
          <button
            disabled={isCopy === user.phoneNumber}
            className={clsx(
              "px-2 cursor-pointer",
              isCopy === user.phoneNumber ? "text-green-600" : "text-gray-400"
            )}
            onClick={() => handleCopy(user.phoneNumber)}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </p>
        {isTeacher && (
          <div className="flex gap-2 flex-col border border-gray-200 bg-gray-50 p-2 rounded-xl">
            <span className="font-bold text-gray-700 shrink-0">
              المراحل الدراسية:{" "}
            </span>
            <div className="flex gap-2 items-center flex-wrap">
              {user.stages.map((stage, index) => (
                <span
                  key={index}
                  className="py-1 px-2 rounded-lg bg-blue-100 border border-blue-300"
                >
                  {stage}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EditUserData({ user, isTeacher, setIsEdit }) {
  const { currentUser } = useCurrentUser();
  const [isSubmitEdit, setIsSubmitEdit] = React.useState(false);
  const [avatar, setAvatar] = React.useState(user.avatar);
  console.log(avatar);
  const [userData, setUserData] = React.useState({
    name: user.name,
    phoneNumber: user.phoneNumber,
    subject: user.subject,
    gender: user.gender,
    stages: user.stages,
  });

  console.log(userData);

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]:
        name !== "stages"
          ? value
          : value
              .split(/[-،,]/)
              .map((stage) => stage.trim())
              .filter((stage) => stage) || [],
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
    <div dir="rtl">
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
                      "https://cdn-icons-png.freepik.com/512/8801/8801434.png"
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

        {/* stages */}
        {isTeacher && (
          <div className="grow mt-2">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              المجموعات
            </label>
            <input
              type="text"
              name="stages"
              id="stages"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="المجموعات"
              defaultValue={user.stages.join(" - ")}
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
