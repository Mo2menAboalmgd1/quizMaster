import React from "react";
import { useParams } from "react-router-dom";
import {
  useProfileByUserId,
  useUserDataByUserId,
} from "../../QueriesAndMutations/QueryHooks";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import UserProfileDataComponent from "../../components/UserProfileDataComponent";
import { useCurrentUser } from "../../store/useStore";
import StudentGradesChart from "../../components/StudentGradesChart";

export default function UserProfile() {
  const { id: userId } = useParams();
  const { currentUser } = useCurrentUser();
  // console.log("current user: ", currentUser);

  const {
    data: userType,
    isLoading: isUserTypeLoading,
    error: userTypeError,
  } = useProfileByUserId(userId);

  const userTableName = userType?.type ? `${userType?.type}s` : null;

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserDataByUserId(userId, userTableName);

  // console.log("user: ", user);

  if (isUserTypeLoading || isUserLoading) return <p>Loading...</p>;

  if (!user || !userType) {
    return (
      <NoDataPlaceHolder icon={faUser} message={"لم يتم العثور على المستخدم"} />
    );
  }

  if (userTypeError || userError) {
    return (
      <ErrorPlaceHolder
        message={"حدث خطأ أثناء العثور على المستخدم، حاول مجدداً"}
      />
    );
  }

  // const isCurrentUserTeacher = currentUser.type === "teacher";
  // const isUserStudent = user.type === "student";
  const isCurrentUserTeacherInStudentTeachersList =
    currentUser.type === "teacher" &&
    user.type === "student" &&
    user.teachers?.some((teacherId) => teacherId === currentUser.id);

  return (
    <div className="w-full space-y-4">
      <UserProfileDataComponent user={user} userType={userType} />

      {isCurrentUserTeacherInStudentTeachersList && (
        <StudentGradesChart teacher={currentUser} student={user} />
      )}
    </div>
  );
}
