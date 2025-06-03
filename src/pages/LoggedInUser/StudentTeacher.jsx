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

export default function StudentTeacher() {
  const { id: teacherId } = useParams();
  const { currentUser } = useCurrentUser(); // Assuming you have a useCurrentUser hook to get the current use

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
    return <Loader message="جاري التحميل" />;
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
    return <ErrorPlaceHolder message={"حدث خطأ ما، أعد المحاولة"} />;
  }

  const isCurrentUserInTeacherStudents = students.some(
    (student) => student.studentId === currentUser.id
  );
  "isCurrentUserInTeacherStudents", isCurrentUserInTeacherStudents;

  const isCurrentUserInTeacherRequests = requests.some(
    (request) => request.studentId === currentUser.id
  );
  "isCurrentUserInTeacherRequests", isCurrentUserInTeacherRequests;

  if (!isCurrentUserInTeacherStudents && !isCurrentUserInTeacherRequests) {
    return (
      <PageWrapper
        title={`انضمام إلى ${
          teacherData?.gender === "male" ? "الأستاذ" : "الأستاذة"
        } ${teacherData?.name}`}
      >
        <Join stages={stages} teacher={teacherData} student={currentUser} />
      </PageWrapper>
    );
  }

  if (!isCurrentUserInTeacherStudents && isCurrentUserInTeacherRequests) {
    return (
      <PageWrapper
        title={`انضمام إلى ${
          teacherData?.gender === "male" ? "الأستاذ" : "الأستاذة"
        } ${teacherData?.name}`}
      >
        <NoDataPlaceHolder
          message={"سيصلك إشعار في حال قبول أو رفض انضمامك إلى المعلم"}
          icon={faBell}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`ملف معلم`}>
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
          <p className="text-gray-600" dir="ltr">@{teacherData.userName}</p>
        </div>
      </div>
      <div className="flex gap-5 justify-center flex-wrap">
        <Folder path={""} text={"الاختبارات"} isEnd={true} />
        <Folder path={"posts"} text={"المنشورات"} />
        <Folder path={`/userProfile/${teacherId}`} text={"الملف الشخصي"} />
      </div>
      <div className="pt-4">
        <Outlet />
      </div>
    </PageWrapper>
  );
}
