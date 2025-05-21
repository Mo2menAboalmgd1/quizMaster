import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import { useExamsResultsByStudentId } from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import clsx from "clsx";

function StatBox({ label, value }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl p-4 shadow text-center",
        !value && "w-full bg-red-300"
      )}
    >
      {value && <h3 className="text-xl font-bold">{value}</h3>}
      <p className="text-gray-500">{label}</p>
    </div>
  );
}

export default function StudentDashboard() {
  const { currentUser } = useCurrentUser();

  const {
    data: studentExams,
    isLoading: isTeacherExamsLoading,
    error: teacherExamsError,
  } = useExamsResultsByStudentId(currentUser?.id, "studentId");

  const grades =
    studentExams?.map((exam) => (exam.correct / exam.total) * 100) || [];
  const averageGrade =
    grades?.length > 0
      ? grades?.reduce((a, b) => a + b, 0) / grades?.length
      : 0;

  const highestGrade = Math.max(...grades).toFixed();
  const lowestGrade = Math.min(...grades).toFixed();

  let message = "";
  if (averageGrade < 60) {
    message = "😔 محتاج تركز أكتر، حاول تراجع الامتحانات اللي فاتت.";
  } else if (averageGrade < 85) {
    message = "🙂 أداءك جيد، بس تقدر تحسنه.";
  } else {
    message = "🏆 ممتاز! استمر على نفس المستوى يا بطل!";
  }

  if (!currentUser || isTeacherExamsLoading) {
    return <Loader message="جاري تحميل الصفحة الرئيسية" />;
  }

  if (teacherExamsError) {
    return (
      <ErrorPlaceHolder
        message={"حدث خطأ أثناء تحميل الملف الشخصي، اعد المحاولة"}
      />
    );
  }

  return (
    <div className="p-1 space-y-6" dir="rtl">
      {/* Welcome */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">أهلاً {currentUser?.name} 👋</h2>
        <p className="text-gray-600 mt-2">دي نظرة سريعة على أدائك 💪</p>
      </div>

      {/* Stats Grid */}
      {studentExams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatBox label="عدد الامتحانات" value={studentExams.length} />
          <StatBox label="متوسط درجاتك" value={`${averageGrade.toFixed()}%`} />
          <StatBox label="أعلى درجة" value={`${highestGrade}%`} />
          <StatBox label="أقل درجة" value={`${lowestGrade}%`} />
        </div>
      ) : (
        <div>
          <StatBox label="ستظهر بعض المعلومات هنا بعد اتمامك لأول اختبار" />
        </div>
      )}

      {/* Message */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-xl">
        <p className="text-blue-700">{message}</p>
      </div>

      {/* Link to Teachers Page */}
      <div className="text-center">
        <Link to="/studentTeachers" className="text-blue-600 hover:underline">
          👨‍🏫 الذهاب لصفحة المعلمين
        </Link>
      </div>
    </div>
  );
}
