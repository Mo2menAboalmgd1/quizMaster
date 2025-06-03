import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser, useDarkMode } from "../../store/useStore";
import { useExamsResultsByStudentId } from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "../../components/PageWrapper";

function StatBox({ label, value }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={clsx(
        "rounded-lg p-3",
        !value && "w-full",
        isDarkMode ? "bg-blue-500/10 text-blue-400" : "bg-gray-200 textj-gray-700"
      )}
    >
      <p className="font-medium">{label}</p>
      {value && <h3 className="text-2xl font-black">{value}</h3>}
    </div>
  );
}

export default function StudentDashboard() {
  const { currentUser } = useCurrentUser();

  const {
    data: studentExams,
    isLoading: isTeacherExamsLoading,
    error: teacherExamsError,
  } = useExamsResultsByStudentId(currentUser?.id);

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
    message = "محتاج تركز أكتر، حاول تراجع الاختبارات اللي فاتت.";
  } else if (averageGrade < 85) {
    message = "أداءك جيد، بس تقدر تحسنه.";
  } else {
    message = "ممتاز! استمر على نفس المستوى يا بطل!";
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

  const studentNameArray = currentUser?.name.split(" ");

  return (
    <PageWrapper title={"الصفحة الرئيسية"}>
      {/* Welcome */}
      <div className="rounded-2xl">
        <h2 className="text-3xl font-semibold">
          أهلاً {studentNameArray[0]}{" "}
          {studentNameArray[studentNameArray.length - 1]}
        </h2>
        <p className="text-blue-500 font-bold mt-2">دي نظرة سريعة على أدائك</p>
      </div>

      {/* Stats Grid */}
      <div className="mt-5">
        {studentExams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatBox label="عدد الاختبارات" value={studentExams.length} />
            <StatBox
              label="متوسط درجاتك"
              value={`${averageGrade.toFixed()}%`}
            />
            <StatBox label="أعلى درجة" value={`${highestGrade}%`} />
            <StatBox label="أقل درجة" value={`${lowestGrade}%`} />
          </div>
        ) : (
          <div>
            <StatBox label="ستظهر بعض المعلومات هنا بعد اتمامك لأول اختبار" />
          </div>
        )}
      </div>

      {/* Message */}
      <p className="text-lg mt-2">{message}</p>

      {/* Link to Teachers Page */}
      <div className="text-center flex justify-end">
        <Link
          to="/studentTeachers"
          className="flex items-center gap-1 font-bold text-blue-500 hover:text-gray-800 transition-colors"
        >
          <span>الذهاب لصفحة المعلمين</span>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
      </div>
    </PageWrapper>
  );
}
