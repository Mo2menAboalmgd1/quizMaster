import React, { useState } from "react";
import {
  useAlotIfRowsInAnyTable,
  useTeachersFromTeachersStudents,
} from "../QueriesAndMutations/QueryHooks";
import ErrorPlaceHolder from "./ErrorPlaceHolder";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";
import GradesChart from "./StudentGradesChart";
import { useDarkMode } from "../store/useStore";
import clsx from "clsx";

export default function StudentTeachersInOwnProfile({ student }) {
  const { isDarkMode } = useDarkMode();
  const {
    data: teachers,
    isLoading: isTeachersLoading,
    error: teachersError,
  } = useTeachersFromTeachersStudents(student?.id);

  const teachersIds = teachers?.map((teacher) => teacher.teacherId);

  const {
    data: teachersData,
    isLoading: isTeachersDataLoading,
    error: teachersDataError,
  } = useAlotIfRowsInAnyTable(teachersIds, "teachers");

  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  if (isTeachersLoading || isTeachersDataLoading) {
    return <Loader message="جاري تحميل بيانات المعلمين" />;
  }

  if (teachersError || teachersDataError) {
    return <ErrorPlaceHolder message={"حدث خطأ اثناء جلب بيانات المعلمين"} />;
  }

  if (!teachersData || teachersData.length === 0) {
    return (
      <NoDataPlaceHolder message={"لا يوجد معلمين إلى الآن"} icon={faUser} />
    );
  }

  const selectedTeacher = teachersData.find((t) => t.id === selectedTeacherId);

  return (
    <div
      className={clsx(
        "rounded-lg rounded-t-none shadow-md p-4",
        isDarkMode && "bg-blue-500/10 border border-blue-500/50"
      )}
      dir="ltr"
    >
      {/* Teacher Navigation Tabs */}
      <div
        className={clsx(
          "border-b mb-4",
          isDarkMode ? "border-blue-500/50" : "border-gray-200"
        )}
      >
        {teachersData.map((teacher) => {
          const teacherNameArray = teacher?.name?.split(" ");
          return (
            <button
              key={teacher.id}
              onClick={() => setSelectedTeacherId(teacher.id)}
              className={`px-3 py-2 transition-all border-b-4 cursor-pointer ${
                selectedTeacherId === teacher.id
                  ? isDarkMode
                    ? "border-blue-500"
                    : "border-black"
                  : isDarkMode
                  ? "border-transparent hover:border-blue-500/30"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              {teacherNameArray[0]}{" "}
              {teacherNameArray[teacherNameArray.length - 1]}
            </button>
          );
        })}
      </div>

      {/* Selected Teacher Chart */}
      <div>
        {selectedTeacher ? (
          <GradesChart teacher={selectedTeacher} student={student} />
        ) : (
          <div
            className={clsx(
              "text-center py-6 px-4rounded-lg border border-dashed",
              isDarkMode ? "border-blue-500/50" : "border-gray-300"
            )}
          >
            <p className="text-gray-500">
              Select a teacher to view performance data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
