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
  // console.log("teachers: ", teachers);

  const teachersIds = teachers?.map((teacher) => teacher.teacherId);

  const {
    data: teachersData,
    isLoading: isTeachersDataLoading,
    error: teachersDataError,
  } = useAlotIfRowsInAnyTable(teachersIds, "teachers");

  console.log("teachers data: ", teachersData);

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
    // <div>mo2men</div>
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">My Teachers</h2>

      {/* Teacher Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-2 pb-3 border-b border-gray-100">
        {teachersData.map((teacher) => (
          <button
            key={teacher.id}
            onClick={() => setSelectedTeacherId(teacher.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTeacherId === teacher.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {teacher.name}
          </button>
        ))}
      </div>

      {/* Selected Teacher Chart */}
      <div className="p-2">
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
