import React from "react";
import { useParams } from "react-router-dom";
import {
  useProfileByUserId,
  useStudentsAndRequestsByTeacherIdAndTable,
  useUserDataByUserId,
} from "../../QueriesAndMutations/QueryHooks";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import UserProfileDataComponent from "../../components/UserProfileDataComponent";
import { useCurrentUser } from "../../store/useStore";
import StudentTeachersInOwnProfile from "../../components/StudentTeachersInOwnProfile";
import Loader from "../../components/Loader";
import GradesChart from "../../components/StudentGradesChart";
import StudentGradesOverview from "../../components/StudentGradesOverview";

export default function UserProfile() {
  const { id: userId } = useParams();
  const { currentUser } = useCurrentUser();

  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfileByUserId(userId);

  const userTableName = profile?.type ? `${profile?.type}s` : null;

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserDataByUserId(userId, userTableName);

  const {
    data: teacherStudents,
    isLoading: isTeacherStudentsLoading,
    error: teacherStudentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  const studentStage = teacherStudents?.find(
    (student) => student.studentId === user?.id
  )?.stage;

  if (isProfileLoading || isUserLoading || isTeacherStudentsLoading)
    return <Loader message="جاري التحميل" />;

  if (!user || !profile) {
    return (
      <NoDataPlaceHolder icon={faUser} message={"لم يتم العثور على المستخدم"} />
    );
  }

  if (profileError || userError || teacherStudentsError) {
    return (
      <ErrorPlaceHolder
        message={"حدث خطأ أثناء العثور على المستخدم، حاول مجدداً"}
      />
    );
  }

  const isCurrentUserTeacher = currentUser.type === "teacher";

  const isCurrentUserStudent = currentUser.type === "student";

  // const isViewedProfileTeacher = user.type === "teacher";

  const isViewedProfileStudent = user.type === "student";

  const isCurrentUserTeacherInStudentTeachersList =
    isCurrentUserTeacher &&
    isViewedProfileStudent &&
    teacherStudents?.some((student) => student.studentId === user.id);

  const isCurrentUserStudentVeiwingOwnProfile =
    isCurrentUserStudent && user.id === currentUser.id;

  return (
    <div className="w-full space-y-6 p-4">
      <div dir="rtl">
        <UserProfileDataComponent
          profile={profile}
          userTableName={userTableName}
          user={user}
        />
      </div>

      {isCurrentUserTeacherInStudentTeachersList && (
        <StudentGradesOverview
          user={user}
          currentUser={currentUser}
          stage={studentStage}
        />
      )}

      {isCurrentUserStudentVeiwingOwnProfile && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 border-b border-purple-100">
            <h2 className="text-lg font-semibold text-purple-800">
              My Teachers
            </h2>
          </div>
          <div className="p-4">
            <StudentTeachersInOwnProfile student={currentUser} />
          </div>
        </div>
      )}
    </div>
  );
}
