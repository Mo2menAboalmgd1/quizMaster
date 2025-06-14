import React from "react";
import {
  useStagesByTeacherId,
  useStudentsAndRequestsByTeacherIdAndTable,
  useStudentsFromStudentsIds,
} from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser, useDarkMode } from "../../store/useStore";
import Loader from "../../components/Loader";
import { Link, useParams } from "react-router-dom";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "../../components/PageWrapper";
import clsx from "clsx";

export default function Stage() {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();
  const { stageId } = useParams();

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const {
    data: teacherStudents,
    isLoading: isTeacherStudentsLoading,
    error: teacherStudentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  const stageStudents = teacherStudents?.filter(
    (student) => student.stage_id === stageId
  );

  const studentsIds = stageStudents.map((student) => student.studentId);

  const {
    data: studentsData,
    isLoading: isStudentsDataLoading,
    error: studentsDataError,
  } = useStudentsFromStudentsIds(studentsIds);

  if (isStagesLoading || isTeacherStudentsLoading || isStudentsDataLoading) {
    return <Loader message="جاري تحميل المراحل الدراسية" />;
  }

  if (stagesError || teacherStudentsError || studentsDataError) {
    return <NoDataPlaceHolder message="حدث خطأ ما" />;
  }

  if (stageStudents.length === 0) {
    return (
      <PageWrapper
        title={stages?.find((stage) => stage.id === stageId)?.name || ""}
      >
        <NoDataPlaceHolder
          message="لا يوجد طلاب بهذه المرحلة"
          icon={faUserSlash}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={stages?.find((stage) => stage.id === stageId)?.name || ""}
    >
      <div
        className={clsx(
          "border rounded-lg overflow-hidden",
          isDarkMode ? "border-blue-500/50" : "border-gray-300"
        )}
      >
        <table className="w-full">
          <thead
            className={clsx(
              isDarkMode ? "bg-blue-500/15 text-blue-500" : "bg-gray-300"
            )}
          >
            <tr className="h-10">
              <th className="px-3">{studentsData.length}</th>
              <th className="text-start">الاسم</th>
              <th className="w-1/3">الملف الشخصي</th>
            </tr>
          </thead>
          <tbody>
            {stageStudents.map((student, index) => {
              const studentData = studentsData?.find(
                (studentData) => studentData.id === student.studentId
              );
              return (
                <tr
                  className={clsx(
                    "border-t",
                    isDarkMode ? "border-blue-500/50 bg-slate-900" : "border-gray-300"
                  )}
                  key={index}
                >
                  <td
                    className={clsx(
                      "flex items-center justify-center py-1 border-e",
                      isDarkMode
                        ? "border-blue-500/50 bg-blue-500/15"
                        : "border-gray-300 bg-gray-100"
                    )}
                  >
                    {index + 1}
                  </td>
                  <td className="px-3">{studentData.name}</td>
                  <td className="text-center px-3">
                    <Link
                      to={`/userProfile/${student.studentId}`}
                      className={clsx(isDarkMode ? "text-blue-400" : "text-blue-600")}
                    >
                      زيارة الملف
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
