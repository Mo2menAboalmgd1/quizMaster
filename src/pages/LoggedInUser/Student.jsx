import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser, useDarkMode, useLanguage } from "../../store/useStore";
import { useExamsResultsByStudentId } from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "../../components/PageWrapper";
import { useTranslation } from "react-i18next";

function StatBox({ label, value }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={clsx(
        "rounded-lg p-3",
        !value && "w-full",
        isDarkMode
          ? "bg-blue-500/10 text-blue-400"
          : "bg-gray-200 textj-gray-700"
      )}
    >
      <p className="font-medium">{label}</p>
      {value && <h3 className="text-2xl font-black">{value}</h3>}
    </div>
  );
}

export default function StudentDashboard() {
  const { currentUser } = useCurrentUser();
  const { isArabic } = useLanguage();
  const [t] = useTranslation("global");

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
    message = t("student.messages.60percentage");
  } else if (averageGrade < 85) {
    message = t("student.messages.85percentage");
  } else {
    message = t("student.messages.above85Percentage");
  }

  if (!currentUser || isTeacherExamsLoading) {
    return <Loader message={t("student.loaders.mainLoader")} />;
  }

  if (teacherExamsError) {
    return <ErrorPlaceHolder message={t("student.errors.mainError")} />;
  }

  const studentNameArray = currentUser?.name.split(" ");

  return (
    <PageWrapper title={t("student.content.title")}>
      {/* Welcome */}
      <div className="rounded-2xl">
        <h2 className="text-3xl font-semibold">
          {t("student.content.welcome")} {studentNameArray[0]}{" "}
          {studentNameArray[studentNameArray.length - 1]}
        </h2>
        <p className="text-blue-500 font-bold mt-2">{t("student.content.overview")}</p>
      </div>

      {/* Stats Grid */}
      <div className="mt-5">
        {studentExams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatBox
              label={t("student.content.stateBoxOneLabel")}
              value={studentExams.length}
            />
            <StatBox
              label={t("student.content.stateBoxTwoLabel")}
              value={`${averageGrade.toFixed()}%`}
            />
            <StatBox
              label={t("student.content.stateBoxThreeLabel")}
              value={`${highestGrade}%`}
            />
            <StatBox
              label={t("student.content.stateBoxFourLabel")}
              value={`${lowestGrade}%`}
            />
          </div>
        ) : (
          <div>
            <StatBox label={t("student.content.stateBoxPlaceHolder")} />
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
          <span>{t("student.content.link")}</span>
          <FontAwesomeIcon icon={isArabic ? faArrowLeft : faArrowRight} />
        </Link>
      </div>
    </PageWrapper>
  );
}
