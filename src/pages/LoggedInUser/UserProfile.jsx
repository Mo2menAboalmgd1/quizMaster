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
import PageWrapper from "../../components/PageWrapper";

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

  // const isCurrentUserWatchingHisOwnProfile = currentUser.id === user.id;

  return (
    <PageWrapper title={isViewedProfileStudent ? (
        "حساب طالب"
      ) : (
        "حساب معلم"
      )}>
      

      <div>
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
        <div className="bg-white rounded-xl overflow-hidden">
          <h2 className="my-3 text-xl font-bold text-blue-500 py-4 text-center bg-blue-50">
            معلميني
          </h2>
          <StudentTeachersInOwnProfile student={currentUser} />
        </div>
      )}
    </PageWrapper>
  );
}
