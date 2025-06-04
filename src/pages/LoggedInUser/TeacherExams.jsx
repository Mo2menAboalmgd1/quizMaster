import { faArrowLeft, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  useStagesByTeacherId,
  useStudentExamsByteacherIdAndStagesIds,
  useStudentsAndRequestsByTeacherIdAndTable,
} from "../../QueriesAndMutations/QueryHooks";
import { Link, useParams } from "react-router-dom";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { publicStage, useCurrentUser, useDarkMode } from "../../store/useStore";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import Loader from "../../components/Loader";
import ExamItemInTeacherProfile from "../../components/ExamItemInTeacherProfile";
import clsx from "clsx";

export default function TeacherExams() {
  const { id: teacherId } = useParams();
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();

  const {
    data: mySubscriptions,
    isLoading: isMySubscriptionsLoading,
    error: mySubscriptionsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(teacherId, "teachers_students");

  const CurrentStudentStage = mySubscriptions.find(
    (student) => student.studentId === currentUser?.id
  )?.stage_id;
  "CurrentStudentStage", CurrentStudentStage;

  console.log("CurrentStudentStage", CurrentStudentStage);

  const {
    data: studentExams,
    isLoading: isExamsLoading,
    isError: examsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStudentExamsByteacherIdAndStagesIds(teacherId, [
    CurrentStudentStage || [],
    publicStage,
  ]);

  const exams = studentExams?.pages?.flatMap((page) => page.data) || [];

  console.log("exams", exams);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(teacherId);

  if (isExamsLoading || isMySubscriptionsLoading || isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (examsError || mySubscriptionsError || stagesError) {
    return (
      <ErrorPlaceHolder
        message={"حدث خطأ أثناء جلب الاختبارات، أعد المحاولة"}
      />
    );
  }

  if (!exams || exams.length === 0) {
    return (
      <NoDataPlaceHolder
        icon={faFileAlt}
        message="لا يوجد اختبارات متاحة حاليًا"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div>
        <h1 className="font-bold text-3xl mb-3 text-blue-500">الاختبارات</h1>
        <div>
          <div
            className={clsx(
              "border rounded-lg overflow-hidden",
              isDarkMode ? "border-blue-500/50" : "border-gray-300"
            )}
          >
            <table className="w-full">
              <thead
                className={clsx(
                  isDarkMode ? "text-white bg-blue-500/10" : "text-slate-800"
                )}
              >
                <tr>
                  <th className="text-start py-2 px-3">عنوان الاختبار</th>
                  <th className="max-sm:hidden">التاريخ</th>
                  <th>عدد الأسئلة</th>
                  <th className="px-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <ExamItemInTeacherProfile
                    isExamTaken={(exams || [])?.some(
                      (e) => e.examId === exam.id
                    )}
                    key={exam.id}
                    exam={exam}
                    stages={stages}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isFetchingNextPage ? "جاري التحميل..." : "تحميل المزيد"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>العودة إلى قائمة المعلمين</span>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      </div>
    </div>
  );
}
