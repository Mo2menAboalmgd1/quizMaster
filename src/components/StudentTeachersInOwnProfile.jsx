import React, { useState } from "react";
import { useAlotIfRowsInAnyTable } from "../QueriesAndMutations/QueryHooks";
import StduentGradesChart from "./StudentGradesChart";

export default function StudentTeachersInOwnProfile({ student, teachers }) {
  const {
    data: teachersData,
    isLoading: isTeachersLoading,
    error: teachersError,
  } = useAlotIfRowsInAnyTable(teachers, "teachers");

  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  if (isTeachersLoading) {
    return <p>جاري تحميل بيانات المدرسين...</p>;
  }

  if (teachersError) {
    return <p>حدث خطأ أثناء تحميل بيانات المدرسين: {teachersError.message}</p>;
  }

  if (!teachersData || teachersData.length === 0) {
    return <p>لم يتم العثور على بيانات المدرسين</p>;
  }

  const selectedTeacher = teachersData.find((t) => t.id === selectedTeacherId);

  return (
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
          <StduentGradesChart teacher={selectedTeacher} student={student} />
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
