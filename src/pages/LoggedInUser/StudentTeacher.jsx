import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  useColumnByUserId,
  useStudentsAndRequestsByTeacherIdAndTable,
  useUserDataByUserId,
} from "../../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useCurrentUser } from "../../store/useStore";
import Join from "../../components/Join";
import Folder from "../../components/Folder";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";

export default function StudentTeacher() {
  const { id: teacherId } = useParams();
  const { currentUser } = useCurrentUser(); // Assuming you have a useCurrentUser hook to get the current use

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(teacherId, "teachers", "stages");

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
    return <Loader message="جري التحميل" />;
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

  const isStudent = students.some(
    (student) => student.studentId === currentUser.id
  );
  const isRequested = requests.some(
    (request) => request.studentId === currentUser.id
  );

  if (!isStudent && !isRequested) {
    return <Join teacherId={teacherId} stages={stages} requests={requests} />;
  }

  if (!isStudent && isRequested) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="mt-4 text-lg font-medium text-red-600">
          سيصلك إشعار في حال قبول أو رفض انضمامك إلى المعلم
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-3xl bg-gradient-to-r text-transparent from-green-500 to-emerald-700 bg-clip-text font-bold pb-6">
        - {teacherData.gender === "male" ? "الأستاذ" : "الأستاذة"}{" "}
        {teacherData.name} -
      </h1>
      <div className="flex gap-5 justify-center flex-wrap">
        <Folder path={""} text={"الامتحانات"} isEnd={true} />
        <Folder path={"posts"} text={"المنشورات"} />
      </div>
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
}
