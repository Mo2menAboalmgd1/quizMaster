import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  useColumnByUserId,
  useExamsByTeacherId,
  useExamsResultsByTeacherId,
  useStudentsAndRequestsByTeacherIdAndTable,
} from "../../QueriesAndMutations/QueryHooks";
import { faArrowLeft, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExamItemInTeacherProfile from "../../components/ExamItemInTeacherProfile";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useCurrentUser } from "../../store/useStore";
import Join from "../../components/Join";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";

export default function TeacherProfile() {
  const { id: teacherId } = useParams();
  const { currentUser } = useCurrentUser(); // Assuming you have a useCurrentUser hook to get the current use

  const {
    data: exams,
    isLoading: isExamsLoading,
    error: examsError,
  } = useExamsByTeacherId(teacherId, true);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(teacherId, "teachers", "stages");

  const {
    data: examsTakenByStudent,
    isLoading: isexamsTakenByStudentLoading,
    error: examsTakenByStudentError,
  } = useExamsResultsByTeacherId(teacherId, currentUser?.id);

  console.log(examsTakenByStudent);

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(teacherId, "teachers_students");

  const currentStudentStage =
    students?.find((student) => student.studentId === currentUser.id)?.stage ||
    null;

  const isThereAnyExamForMyId = exams?.some(
    (exam) => exam.stage === currentStudentStage
  );
  const isTherePublicExam = exams?.some((exam) => exam.stage == "");

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
    isexamsTakenByStudentLoading
  ) {
    return <Loader message="جري التحميل" />;
  }

  if (studentsError) {
    toast.error(studentsError.message);
    return;
  }

  if (examsTakenByStudentError) {
    toast.error(examsTakenByStudentError.message);
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

  if (isExamsLoading) return <Loader message="جري تحميل الامتحانات" />;

  if (examsError) {
    toast.error(examsError.message);
    return <ErrorPlaceHolder message={examsError.message} />;
  }

  if (exams.length === 0 || (!isThereAnyExamForMyId && !isTherePublicExam))
    return (
      <NoDataPlaceHolder
        icon={faFileAlt}
        message="لا يوجد امتحانات متاحة حاليًا"
      />
    );

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="py-4 text-center bg-gradient-to-r from-green-500 to-emerald-600 font-bold text-white text-xl relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faFileAlt} className="text-white" />
          </div>
          قائمة الامتحانات
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faFileAlt} className="text-white" />
          </div>
        </h1>

        <div className="p-4">
          {exams.length === 0 ? (
            <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              لا يوجد امتحانات متاحة حاليًا
            </div>
          ) : (
            <div className="space-y-3">
              {exams
                .filter(
                  (exam) =>
                    exam.stage === currentStudentStage || exam.stage === ""
                )
                .map((exam) => (
                  <ExamItemInTeacherProfile
                    isExamTaken={(examsTakenByStudent || [])?.some(
                      (e) => e.examId === exam.id
                    )}
                    key={exam.id}
                    exam={exam}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>العودة إلى قائمة المعلمين</span>
        </Link>
      </div>
    </div>
  );
}
