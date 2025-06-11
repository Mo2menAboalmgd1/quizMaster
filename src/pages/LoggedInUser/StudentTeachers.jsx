import React from "react";
import { useCurrentUser, useDarkMode } from "../../store/useStore";
import {
  useTeachersFromTeachersStudents,
  useUserDataByUsersIdsAndKey,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "../../components/PageWrapper";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function StudentTeachers() {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();

  const [t] = useTranslation("global");

  const {
    data: studentTeachers,
    isLoading: isStudentTeachersLoading,
    isError: isStudentTeachersError,
  } = useTeachersFromTeachersStudents(currentUser?.id);

  const teachersIds = studentTeachers?.map((teacher) => teacher.teacherId);

  const {
    data: teachers,
    isLoading: isTeachersLoading,
    isError: isTeachersError,
  } = useUserDataByUsersIdsAndKey(teachersIds, "teachers_students", "teachers");

  if (isStudentTeachersLoading || isTeachersLoading) {
    return <Loader message="جاري تحميل الصفحة الرئيسية" />;
  }

  if (isStudentTeachersError || isTeachersError) {
    return <ErrorPlaceHolder />;
  }

  if (
    !studentTeachers ||
    studentTeachers.length === 0 ||
    !teachers ||
    teachers.length === 0
  ) {
    return (
      <PageWrapper title={t("studentTeachers.content.title")}>
        <NoDataPlaceHolder
          message={t("studentTeachers.noData.message")}
          icon={faUser}
        />
        <div className="mt-5 flex justify-end items-stretch h-fit">
          <Link
            to="/searchTeachers"
            className="h-10 px-4 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            {t("studentTeachers.noData.button")}
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={t("studentTeachers.content.title")}>
      <div className="rounded-xl overflow-hidden">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">
            {t("studentTeachers.content.teachersList")}
          </h1>
          <Link
            to="/searchTeachers"
            className={clsx(
              "py-2 px-4 me-3 rounded-lg font-medium",
              isDarkMode
                ? "bg-blue-500/50 hover:bg-blue-500 transition-colors text-white"
                : "bg-gray-200"
            )}
          >
            <span>{t("studentTeachers.content.search")}</span>
          </Link>
        </div>

        <div>
          {/* <h1 className="text-xl mt-3 mb-4 font-medium text-gray-600">
            معلميني
          </h1> */}

          <div className="space-y-3 mt-4">
            {teachers.map((teacher) => (
              <Link
                className={clsx(
                  "flex gap-3 items-center p-2 rounded-lg transition-colors",
                  isDarkMode
                    ? "bg-blue-500/5 hover:bg-blue-500/15"
                    : "hover:bg-gray-200"
                )}
                to={teacher.id}
                key={teacher.id}
              >
                {teacher.avatar ? (
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-md"
                    src={teacher.avatar}
                    alt={teacher.name}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-sm">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
                <div className="grow">
                  <h3
                    className={clsx(
                      "font-medium group-hover:text-green-700 transition-colors",
                      isDarkMode ? "text-white" : "text-gray-800"
                    )}
                  >
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-blue-500">{teacher.subject}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
