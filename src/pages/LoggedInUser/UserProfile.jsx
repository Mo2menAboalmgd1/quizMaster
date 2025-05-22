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
import StudentTeachersInOwnProfile from "../../components/StudentTeachersInOwnProfile";

export default function UserProfile() {
  const { id: userId } = useParams();
  const { currentUser } = useCurrentUser();
  // console.log("current user: ", currentUser);

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

  if (isProfileLoading || isUserLoading) return <p>Loading...</p>;

  if (!user || !profile) {
    return (
      <NoDataPlaceHolder icon={faUser} message={"لم يتم العثور على المستخدم"} />
    );
  }

  if (profileError || userError) {
    return (
      <ErrorPlaceHolder
        message={"حدث خطأ أثناء العثور على المستخدم، حاول مجدداً"}
      />
    );
  }

  const isCurrentUserTeacherInStudentTeachersList =
    currentUser.type === "teacher" &&
    user.type === "student" &&
    user.teachers?.some((teacherId) => teacherId === currentUser.id);

  const isCurrentUserStudentVeiwingOwnProfile =
    currentUser.type === "student" && user.id === currentUser.id;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
      <div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm"
        dir="rtl"
      >
        <UserProfileDataComponent
          userId={userId}
          profile={profile}
          userTableName={userTableName}
        />
      </div>

      {isCurrentUserTeacherInStudentTeachersList && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-green-100">
            <h2 className="text-lg font-semibold text-green-800 text-center">
              أداء الطالب في الاختبارات
            </h2>
          </div>
          <div className="p-4">
            <StudentGradesChart teacher={currentUser} student={user} />
          </div>
        </div>
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
