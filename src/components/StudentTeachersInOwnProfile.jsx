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

export default function StudentTeachersInOwnProfile({ student }) {
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
    <div className="bg-white rounded-xl shadow-md p-4" dir="ltr">
      {/* Teacher Navigation Tabs */}
      <div className="border-b border-gray-200 mb-4">
        {teachersData.map((teacher) => {
          const teacherNameArray = teacher?.name?.split(" ");
          return (
            <button
              key={teacher.id}
              onClick={() => setSelectedTeacherId(teacher.id)}
              className={`px-3 py-2 transition-all border-b-4 cursor-pointer ${
                selectedTeacherId === teacher.id
                  ? "border-black"
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
          <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              Select a teacher to view performance data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
