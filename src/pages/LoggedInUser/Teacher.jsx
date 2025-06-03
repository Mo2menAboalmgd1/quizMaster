import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser, useDarkMode } from "../../store/useStore";
import {
  useAllTeacherExams,
  useLastActionsByUserId,
  useStudentsAndRequestsByTeacherIdAndTable,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faBullhorn,
  // faCircle,
  faClock,
  // faCopy,
  // faFile,
  // faFileAlt,
  // faFlaskVial,
  faLightbulb,
  // faMicrophone,
  // faTasks,
} from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "../../components/PageWrapper";

function StatBox({ label, value, isDarkMode }) {
  return (
    <div
      className={clsx(
        "rounded-lg p-3",
        !value && "w-full",
        isDarkMode ? "bg-blue-500/15" : "bg-gray-200"
      )}
    >
      <p
        className={clsx(
          "font-medium",
          isDarkMode ? "text-white/70" : "text-gray-700"
        )}
      >
        {label}
      </p>
      {value && (
        <h3
          className={clsx(
            "text-2xl font-black",
            isDarkMode ? "text-blue-500" : ""
          )}
        >
          {value}
        </h3>
      )}
    </div>
  );
}

export default function Teacher() {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();

  const {
    data: teacherExams,
    isLoading: isTeacherExamsLoading,
    error: teacherExamsError,
  } = useAllTeacherExams(currentUser.id);

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

  actions;

  if (isTeacherExamsLoading || isStudentsLoading || isActionsLoading)
    return <Loader message="جاري التحميل" />;

  if (teacherExamsError || studentsError || actionsError)
    return <ErrorPlaceHolder message={"حدث خطأ ما، أعد المحاولة"} />;

  const unPublishedExams = teacherExams?.filter((exam) => !exam.isPublished);

  const teacherNameArray = currentUser?.name.split(" ");

  // const completedExams = teacherExams.filter((exam) => exam.done);
  // const incompletedExams = teacherExams.filter((exam) => !exam.done);

  return (
    <PageWrapper title={"الرئيسية"}>
      {/* Welcome Card */}
      <div className="rounded-2xl mb-5">
        <h2 className="text-3xl font-semibold">
          أهلاً {currentUser.gender === "male" ? "أستاذ" : "أستاذة"}{" "}
          {teacherNameArray[0]} {teacherNameArray[teacherNameArray.length - 1]}
        </h2>
        {unPublishedExams?.length > 0 && (
          <p className="text-blue-500 font-bold mt-2">
            عندك {unPublishedExams.length} اختبارات في المسودة
          </p>
        )}
        {unPublishedExams?.length === 0 && (
          <p className="text-blue-500 font-bold mt-2">
            {currentUser.gender === "male" ? "جاهز" : "جاهزة"} لإنشاء اختبار
            جديد؟!
          </p>
        )}
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatBox
          label={"عدد الاختبارات"}
          value={teacherExams?.length || "0"}
          isDarkMode={isDarkMode}
        />
        <StatBox
          label={"الاختبارات الغير مكتملة"}
          value={unPublishedExams?.length || "0"}
          isDarkMode={isDarkMode}
        />
        <StatBox
          label={"عدد الطلاب المسجلين"}
          value={students.length || "0"}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Recent Activity */}
      {actions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-4 space-x-2">
            <span>الأنشطة الأخيرة</span>
            <FontAwesomeIcon
              icon={faClock}
              className={clsx(isDarkMode ? "text-blue-400" : "text-blue-500")}
            />
          </h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {actions.slice(0, 3).map((action) => (
              <li key={action.id} className="list-none flex gap-2 items-center">
                <span
                  className={clsx(
                    "h-2 w-2 shrink-0 rounded-full block",
                    isDarkMode ? "bg-blue-400" : "bg-blue-500"
                  )}
                ></span>
                <span className={clsx(isDarkMode ? "text-white/70" : "")}>
                  {action.action}
                </span>
              </li>
            ))}
          </ul>
          <hr
            className={clsx(
              "my-5",
              isDarkMode ? "border-blue-500/70" : "border-gray-300"
            )}
          />
        </div>
      )}

      {/* Teaching Tip */}
      <p
        className={clsx(
          "flex gap-3 items-center p-3 rounded-lg border",
          isDarkMode
            ? "border-blue-500/50 bg-blue-500/15"
            : "bg-blue-100 border-blue-300"
        )}
      >
        <FontAwesomeIcon icon={faLightbulb} className="text-blue-500 text-lg" />
        <span>
          هل تعلم أن تنويع نمط الأسئلة يحسّن من استيعاب الطالب بنسبة 25%؟ جرب
          تضيف سؤال "صح أو خطأ" في اختبارك القادم.
        </span>
      </p>
    </PageWrapper>
  );
}

{
  /* Quick Actions */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to={"createTest"}
          className="bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 p-4 cursor-pointer"
        >
          <span>إنشاء اختبار جديد</span>
          <FontAwesomeIcon icon={faFile} />
        </Link>
        <Link
          to={"exams"}
          className="bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 p-4 cursor-pointer"
        >
          <span>عرض الاختبارات</span>
          <FontAwesomeIcon icon={faFlaskVial} />
        </Link>
        <Link
          to={"tasks"}
          className="bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 p-4 cursor-pointer"
        >
          <span>عرض قائمة المهام</span>
          <FontAwesomeIcon icon={faTasks} />
        </Link>
        <Link
          to={"posts"}
          className="bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 p-4 cursor-pointer"
        >
          <span>المنشورات</span>
          <FontAwesomeIcon icon={faBullhorn} />
        </Link>
      </div> */
}
