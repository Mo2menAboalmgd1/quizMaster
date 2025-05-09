import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import TeacherExamsList from "../../components/TeacherExamsList";
import { useExamsByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";

export default function Teacher() {
  const { currentUser } = useCurrentUser();

  const {
    data: teacherExams,
    isLoading: isTeacherExamsLoading,
    error: teacherExamsError,
  } = useExamsByTeacherId(currentUser.id, false);

  console.log(teacherExams);

  if (isTeacherExamsLoading)
    return <Loader message="جري تحميل الملف الشخصي..." />;

  if (teacherExamsError)
    return <ErrorPlaceHolder message={"حدث خطأ أثناء تحميل الامتحانات"} />;

  if (!teacherExams || teacherExams.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6">
        <p className="text-gray-600 font-medium">
          لا يوجد امتحانات متاحة حاليا
        </p>
      </div>
    );

  const completedExams = teacherExams.filter((exam) => exam.done);
  const incompletedExams = teacherExams.filter((exam) => !exam.done);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6" dir="rtl">
      <div className="grid md:grid-cols-2 gap-3 md:items-start">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h1 className="py-4 text-center bg-gradient-to-r from-green-500 to-emerald-600 font-bold text-white text-xl rounded-t-xl">
            قائمة الامتحانات المنشورة
          </h1>
          <div className="p-4">
            <TeacherExamsList list={completedExams} isDone />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h1 className="py-4 text-center bg-gradient-to-r from-yellow-400 to-amber-500 font-bold text-gray-800 text-xl rounded-t-xl">
            قائمة الامتحانات الغير مكتملة
          </h1>
          <div className="p-4">
            <TeacherExamsList list={incompletedExams} isDone={false} />
          </div>
        </div>
      </div>

      <Link
        to={"/createTest"}
        className="h-12 px-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md transition-all transform "
      >
        <FontAwesomeIcon icon={faPlus} className="text-white" />{" "}
        <span>إضافة امتحان جديد</span>
      </Link>
    </div>
  );
}
