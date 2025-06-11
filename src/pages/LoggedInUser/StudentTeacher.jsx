import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  useStagesByTeacherId,
  useStudentsAndRequestsByTeacherIdAndTable,
  useUserDataByUserId,
} from "../../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useCurrentUser } from "../../store/useStore";
import Join from "../../components/Join";
import Folder from "../../components/Folder";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import PageWrapper from "../../components/PageWrapper";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function StudentTeacher() {
  const { id: teacherId } = useParams();
  const { currentUser } = useCurrentUser(); // Assuming you have a useCurrentUser hook to get the current use
  const [t] = useTranslation("global");

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(teacherId);

  console.log("stages", stages);

  const {
    data: teacherData,
    isLoading: isTeacherDataLoading,
    error: teacherDataError,
  } = useUserDataByUserId(teacherId, "teachers");

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(teacherId, "teachers_students");

  const {
    data: requests,
    isLoading: isRequestsLoading,
    error: requestsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(teacherId, "teachers_requests");

  if (
    isStudentsLoading ||
    isRequestsLoading ||
    isStagesLoading ||
    isStudentsLoading ||
    isTeacherDataLoading
  ) {
    return <Loader />;
  }

  if (studentsError) {
    toast.error(studentsError.message);
    return;
  }

  if (requestsError) {
    toast.error(requestsError.message);
    return;
  }

  if (stagesError) {
    toast.error(stagesError.message);
    return;
  }

  if (studentsError) {
    toast.error(studentsError.message);
    return;
  }

  if (teacherDataError) {
    return <ErrorPlaceHolder />;
  }

  const isCurrentUserInTeacherStudents = students.some(
    (student) => student.studentId === currentUser.id
  );
  "isCurrentUserInTeacherStudents", isCurrentUserInTeacherStudents;

  const isCurrentUserInTeacherRequests = requests.some(
    (request) => request.studentId === currentUser.id
  );
  "isCurrentUserInTeacherRequests", isCurrentUserInTeacherRequests;

  // if not in teachers list and not requested yet
  if (!isCurrentUserInTeacherStudents && !isCurrentUserInTeacherRequests) {
    return (
      <PageWrapper
        title={`${t("studentTeacher.notInTeacherListAndNotRequested.title")} ${
          teacherData?.gender === "male"
            ? t("studentTeacher.notInTeacherListAndNotRequested.gender.male")
            : t("studentTeacher.notInTeacherListAndNotRequested.gender.female")
        } ${teacherData?.name}`}
      >
        <Join stages={stages} teacher={teacherData} student={currentUser} />
      </PageWrapper>
    );
  }

  if (!isCurrentUserInTeacherStudents && isCurrentUserInTeacherRequests) {
    return (
      <PageWrapper
        title={`${t("studentTeacher.notInTeacherListAndNotRequested.title")} ${
          teacherData?.gender === "male"
            ? t("studentTeacher.notInTeacherListAndNotRequested.gender.male")
            : t("studentTeacher.notInTeacherListAndNotRequested.gender.female")
        } ${teacherData?.name}`}
      >
        <NoDataPlaceHolder
          message={t("studentTeacher.notInTeachersListButRequested.message")}
          icon={faBell}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={t("studentTeacher.content.title")}>
      <div className="flex flex-col items-center mb-5 gap-2">
        <img
          src={
            teacherData?.avatar ||
            "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"
          }
          alt="teacher image"
          className="h-36 w-36 rounded-full object-cover"
        />
        <div className="text-center">
          <h2 className="text-blue-500 font-bold text-xl">
            {teacherData.name}
          </h2>
          <p className="text-gray-600" dir="ltr">
            @{teacherData.userName}
          </p>
        </div>
      </div>
      <div className="flex gap-5 justify-center flex-wrap">
        <Folder
          path={""}
          text={t("studentTeacher.content.folders.tests")}
          isEnd={true}
        />
        <Folder
          path={"posts"}
          text={t("studentTeacher.content.folders.posts")}
        />
        <Folder
          path={`/userProfile/${teacherId}`}
          text={t("studentTeacher.content.folders.profile")}
        />
      </div>
      <div className="pt-4">
        <Outlet />
      </div>
    </PageWrapper>
  );
}
