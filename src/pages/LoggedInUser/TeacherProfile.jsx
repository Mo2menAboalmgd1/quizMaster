import React from "react";
import { Link, useParams } from "react-router-dom";
import { useExamsByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import { faArrowLeft, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExamItemInTeacherProfile from "../../components/ExamItemInTeacherProfile";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

export default function TeacherProfile() {
  const { id: teacherId } = useParams();

  const {
    data: exams,
    isLoading: isExamsLoading,
    error: examsError,
  } = useExamsByTeacherId(teacherId, true);

  console.log(exams);

  if (isExamsLoading)
    return <Loader message="جري تحميل الامتحانات" />;

  if (examsError) {
    toast.error(examsError.message);
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-red-600">
          حدث خطأ أثناء تحميل الامتحانات الرجاء إعادة المحاولة
        </p>
        <p className="text-gray-500 text-sm mt-2">{examsError.message}</p>
      </div>
    );
  }

  if (!exams || exams.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6">
        <FontAwesomeIcon
          icon={faFileAlt}
          className="text-gray-400 text-5xl mb-4"
        />
        <p className="text-gray-600 font-medium">
          لا يوجد امتحانات متاحة حاليًا
        </p>
      </div>
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
              {exams.map((exam) => (
                <ExamItemInTeacherProfile exam={exam} />
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
