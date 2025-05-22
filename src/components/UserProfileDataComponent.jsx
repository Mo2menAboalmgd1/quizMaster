import {
  faArrowDown,
  faArrowUp,
  faCancel,
  faEdit,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useCurrentUser } from "../store/useStore";
import {
  useStudentsAndRequestsByTeacherIdAndTable,
  useUserDataByUserId,
} from "../QueriesAndMutations/QueryHooks";
import Loader from "./Loader";
import ErrorPlaceHolder from "./ErrorPlaceHolder";
import AlertBox from "./AlertBox";
import {
  useEditUserdataMutation,
  useUnJoinMutation,
} from "../QueriesAndMutations/mutationsHooks";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { useParams } from "react-router-dom";

export default function UserProfileDataComponent({
  userId,
  profile,
  userTableName,
}) {
  const [isMore, setIsMore] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const { currentUser } = useCurrentUser();
  const { id: urlId } = useParams();

  // console.log(isEdit);

  const isCurrentUserTeacher = currentUser?.type === "teacher";
  const isCurrentUserStudent = currentUser?.type === "student";

  const isViewedProfileTeacher = profile.type === "teacher";
  const isViewedProfileStudent = profile.type === "student";

  const isWatchingMyProfile = currentUser?.id === userId;

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUserDataByUserId(userId, userTableName);

  console.log(user, profile.type);

  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(urlId, "teachers_students");

  console.log(students);

  const isCurrentUserTeacherAndWatchingHisStudentProfile =
    isCurrentUserTeacher &&
    isViewedProfileStudent &&
    students?.some((student) => student.studentId === user.id);

  const isCurrentUserStudentAndWatchingHisTeacherProfile =
    isCurrentUserStudent &&
    isViewedProfileTeacher &&
    students?.some((student) => student.studentId === currentUser.id);

  console.log({
    isCurrentUserTeacher,
    isCurrentUserStudent,
    isViewedProfileTeacher,
    isViewedProfileStudent,
    isCurrentUserTeacherAndWatchingHisStudentProfile,
    isCurrentUserStudentAndWatchingHisTeacherProfile,
    isWatchingMyProfile,
  });

  if (isStudentsLoading || isUserLoading) {
    return <Loader message="جاري تحميل البينات" />;
  }

  if (isStudentsError || isUserError) {
    return <ErrorPlaceHolder message="حدث خطأ ما، أعد المحاولة" />;
  }

  if (!user) {
    return (
      <NoDataPlaceHolder
        message="هذا المستخدم غير موجود، يبدوا أنه قام بحذف حسابه"
        icon={faUserSlash}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {!isEdit && (
        <ShowUserData
          user={user}
          isMore={isMore}
          setIsMore={setIsMore}
          isWatchingMyProfile={isWatchingMyProfile}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          isCurrentUserTeacherAndWatchingHisStudentProfile={
            isCurrentUserTeacherAndWatchingHisStudentProfile
          }
          isCurrentUserStudentAndWatchingHisTeacherProfile={
            isCurrentUserStudentAndWatchingHisTeacherProfile
          }
        />
      )}
      {isEdit && (
        <EditUserData
          user={user}
          setIsEdit={setIsEdit}
          userId={currentUser?.id}
        />
      )}
    </div>
  );
}

function ShowUserData({
  user,
  isMore,
  setIsMore,
  isWatchingMyProfile,
  isEdit,
  setIsEdit,
  isCurrentUserTeacherAndWatchingHisStudentProfile,
  isCurrentUserStudentAndWatchingHisTeacherProfile,
}) {
  const { currentUser } = useCurrentUser();
  const [isUnJoin, setIsUnJoin] = React.useState(false);
  const { mutate: removeStudentFromMyStudentsMutation } = useUnJoinMutation();
  const removeStudentFromMyStudents = () => {
    removeStudentFromMyStudentsMutation({
      user,
      currentUser: currentUser,
    });
  };

  const {mutate: unJoinMutation} = useUnJoinMutation();
  const handleUnJoin = () => {
    unJoinMutation({currentUser, user})
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <img
          src={
            user.avatar ||
            "https://cdn-icons-png.freepik.com/512/8801/8801434.png"
          }
          alt="User Avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
        />

        <div>
          <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-sm text-blue-600 mb-2">{user.type}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center text-sm gap-2">
          <span className="text-gray-500">الاسم</span>
          <span className="font-medium text-gray-800">{user.userName}</span>
        </div>
        <div className="flex flex-wrap items-center text-sm gap-2">
          <span className="text-gray-500">الجنس:</span>
          <span className="font-medium text-gray-800">
            {user.gender === "male" ? "ذكر" : "أنثى "}
          </span>
        </div>
        <div className="flex flex-wrap items-center text-sm gap-2">
          <span className="text-gray-500">رقم الهاتف:</span>
          <span className="font-medium text-gray-800">{user.phoneNumber}</span>
        </div>
        {user.type === "teacher" && (
          <div className="flex flex-wrap items-center text-sm gap-2">
            <span className="text-gray-500">المادة الدراسية:</span>
            <span className="font-medium text-gray-800">{user.subject}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center text-sm gap-2">
          <span className="text-gray-500">البريد الالكتروني:</span>
          <span className="font-medium text-gray-800">{user.email}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => setIsMore(!isMore)}
          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded space-x-2 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={isMore ? faArrowUp : faArrowDown} />
          <span>{isMore ? "less" : "more"}</span>
        </button>
      </div>
      {isMore && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          {isWatchingMyProfile && (
            <>
              <button
                onClick={() => setIsEdit(!isEdit)}
                className="px-3 py-1.5 space-x-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faEdit} />
                <span>تعديل البيانات</span>
              </button>
              {/* <button
                onClick={() => setIsDeleteAccount(true)}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded space-x-2 hover:bg-red-700 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>(حذف / ايقاف) الحساب</span>
              </button> */}
            </>
          )}

          {isCurrentUserTeacherAndWatchingHisStudentProfile && (
            <button
              onClick={removeStudentFromMyStudents}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded space-x-2 hover:bg-red-700 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faUserSlash} />
              <span>إلغاء انضمام هذا الطالب</span>
            </button>
          )}

          {isCurrentUserStudentAndWatchingHisTeacherProfile && (
            <button
              onClick={() => setIsUnJoin(true)}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded space-x-2 hover:bg-red-700 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faUserSlash} />
              <span>إلغاء انضمامي لهذا المعلم</span>
            </button>
          )}

          {isUnJoin && (
            <AlertBox
              title={"إلغاء الانضمام"}
              type={"red"}
              message={"هل أنت متأكد من أنك تريد إلغاء انضمام هذا المعلم؟"}
              firstOptionText={"نعم، تأكيد"}
              firstOptionFunction={() => {
                handleUnJoin();
                setIsUnJoin(false);
              }}
              secondOptionText={"إلغاء"}
              secondOptionFunction={() => setIsUnJoin(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

function EditUserData({ user, setIsEdit, userId }) {
  const { currentUser } = useCurrentUser();
  const [isSubmitEdit, setIsSubmitEdit] = React.useState(false);
  const [avatar, setAvatar] = React.useState(user.avatar);
  console.log(avatar);
  const [userData, setUserData] = React.useState({
    name: user.name,
    phoneNumber: user.phoneNumber,
    subject: user.subject,
    gender: user.gender,
  });

  console.log(userData);

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
        userId,
      },
    });
    setIsSubmitEdit(false);
    setIsEdit(false);
  };
  return (
    <div dir="rtl">
      <h1 className="text-center text-blue-500 text-lg font-bold">
        تعديل البيانات الشخصية
      </h1>
      {/* edit data form div */}
      <div>
        <div className="flex gap-3 items-center">
          {/* change image */}
          <div className="relative w-fit overflow-hidden rounded-full group">
            <img
              className="h-20 w-20 object-cover rounded-full shadow-md"
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
              className="h-1/2 bg-black/50 absolute left-0 top-10 w-full text-white opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center transition-opacity"
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
            placeholder="رقم الهاتف"
            defaultValue={user.subject}
            onChange={handleChangeUserData}
          />
        </div>

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
