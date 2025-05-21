import {
  faBars,
  faEdit,
  faTrash,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useCurrentUser } from "../store/useStore";
import { useStudentsAndRequestsByTeacherIdAndTable } from "../QueriesAndMutations/QueryHooks";
import Loader from "./Loader";
import ErrorPlaceHolder from "./ErrorPlaceHolder";

export default function UserProfileDataComponent({ user }) {
  const [isMore, setIsMore] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const { currentUser } = useCurrentUser();
  console.log(isEdit);

  const isCurrentUserTeacher = currentUser?.type === "teacher";
  const isCurrentUserStudent = currentUser?.type === "student";

  const isViewedProfileTeacher = user?.type === "teacher";
  const isViewedProfileStudent = user?.type === "student";

  const isWatchingMyProfile = currentUser?.id === user?.id;

  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  const isCurrentUserTeacherAndWatchingHisStudentProfile =
    isCurrentUserTeacher &&
    isViewedProfileStudent &&
    students.some((student) => student.studentId === user.id);

  const isCurrentUserStudentAndWatchingHisTeacherProfile =
    isCurrentUserStudent &&
    isViewedProfileTeacher &&
    students.some((student) => student.studentId === user.id);

  console.log({
    isCurrentUserTeacher,
    isCurrentUserStudent,
    isViewedProfileTeacher,
    isViewedProfileStudent,
    isCurrentUserTeacherAndWatchingHisStudentProfile,
    isCurrentUserStudentAndWatchingHisTeacherProfile,
    isWatchingMyProfile,
  });

  const handleEditUserData = () => {};

  if (isStudentsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (isStudentsError) {
    return <ErrorPlaceHolder message="حدث خطأ ما، أعد المحاولة" />;
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
          handleEditUserData={handleEditUserData}
          isCurrentUserStudentAndWatchingHisTeacherProfile={
            isCurrentUserStudentAndWatchingHisTeacherProfile
          }
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
  handleEditUserData,
  isCurrentUserStudentAndWatchingHisTeacherProfile,
}) {
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
        <div className="flex flex-wrap items-center text-sm">
          <span className="text-gray-500 w-24">User name:</span>
          <span className="font-medium text-gray-800">{user.userName}</span>
        </div>

        <div className="flex flex-wrap items-center text-sm">
          <span className="text-gray-500 w-24">Email:</span>
          <span className="font-medium text-gray-800">{user.email}</span>
        </div>

        <div className="flex flex-wrap items-center text-sm">
          <span className="text-gray-500 w-24">Type:</span>
          <span className="font-medium text-gray-800">{user.type}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => setIsMore(!isMore)}
          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded space-x-2 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faBars} />
          <span>more</span>
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
              <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded space-x-2 hover:bg-red-700 transition-colors cursor-pointer">
                <FontAwesomeIcon icon={faTrash} />
                <span>حذف الحساب نهائياً</span>
              </button>
            </>
          )}

          {isCurrentUserTeacherAndWatchingHisStudentProfile && (
            <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded space-x-2 hover:bg-red-700 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faUserSlash} />
              <span>إلغاء انضمام هذا الطالب</span>
            </button>
          )}

          {isCurrentUserStudentAndWatchingHisTeacherProfile && (
            <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded space-x-2 hover:bg-red-700 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faUserSlash} />
              <span>إلغاء انضمامي لهذا المعلم</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
