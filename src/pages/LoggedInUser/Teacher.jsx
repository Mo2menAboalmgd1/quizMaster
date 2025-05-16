import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import {
  useExamsByTeacherId,
  useLastActionsByUserId,
  useStudentsAndRequestsByTeacherIdAndTable,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";

export default function Teacher() {
  const { currentUser } = useCurrentUser();

  const {
    data: teacherExams,
    isLoading: isTeacherExamsLoading,
    error: teacherExamsError,
  } = useExamsByTeacherId(currentUser.id, false);

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser.id,
    "teachers_students"
  );

  const {
    data: actions,
    isLoading: isActionsLoading,
    error: actionsError,
  } = useLastActionsByUserId(currentUser?.id);

  console.log(actions);

  if (isTeacherExamsLoading || isStudentsLoading || isActionsLoading)
    return <Loader message="جاري التحميل" />;

  if (teacherExamsError || studentsError || actionsError)
    return <ErrorPlaceHolder message={"حدث خطأ ما، أعد المحاولة"} />;

  const unPublishedExams = teacherExams.filter((exam) => !exam.done);

  // const completedExams = teacherExams.filter((exam) => exam.done);
  // const incompletedExams = teacherExams.filter((exam) => !exam.done);

  return (
    <div className="p-1 space-y-6" dir="rtl">
      {/* Welcome Card */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">
          أهلاً {currentUser.gender === "male" ? "أستاذ" : "أستاذة"}{" "}
          {currentUser.name} 👋
        </h2>
        {unPublishedExams.length > 0 && (
          <p className="text-gray-600 mt-2">
            عندك {unPublishedExams.length} امتحانات في المسودة
          </p>
        )}
        {unPublishedExams.length === 0 && (
          <p className="text-gray-600 mt-2">جاهز لإنشاء امتحان جديد!</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to={"createTest"}
          className="bg-blue-600 text-white flex items-center justify-center rounded-xl p-4 shadow hover:bg-blue-700 transition cursor-pointer"
        >
          📝 إنشاء امتحان جديد
        </Link>
        <Link
          to={"exams"}
          className="bg-green-600 text-white flex items-center justify-center rounded-xl p-4 shadow hover:bg-green-700 transition cursor-pointer"
        >
          📤 عرض الامتحانات
        </Link>
        <button className="bg-purple-600 text-white rounded-xl p-4 shadow hover:bg-purple-700 transition cursor-pointer">
          📊 عرض تحليلات الطلاب
        </button>
        <button className="bg-yellow-500 text-white rounded-xl p-4 shadow hover:bg-yellow-600 transition cursor-pointer">
          📚 إدارة الصفوف
        </button>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <h3 className="text-xl font-bold">{teacherExams.length}</h3>
          <p className="text-gray-500">امتحانات</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <h3 className="text-xl font-bold">{unPublishedExams.length}</h3>
          <p className="text-gray-500">امتحانات غير مكتملة</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <h3 className="text-xl font-bold">{students.length}</h3>
          <p className="text-gray-500">طالب مسجل</p>
        </div>
      </div>

      {/* Recent Activity */}
      {actions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow">
          <h4 className="text-lg font-semibold mb-4">🕒 الأنشطة الأخيرة</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {actions.slice(0, 3).map((action) => (
              <li key={action.id}>{action.action}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Teaching Tip */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-xl">
        <p className="text-blue-700">
          💡 هل تعلم أن تنويع نمط الأسئلة يحسّن من استيعاب الطالب بنسبة 25%؟ جرب
          تضيف سؤال "صح أو خطأ" في امتحانك القادم.
        </p>
      </div>
    </div>
  );
}
