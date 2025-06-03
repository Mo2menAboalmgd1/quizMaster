import React from "react";

export default function StudentGrade({ students, result }) {
  const student = students.find((student) => student.id === result.studentId);

  return (
    <tr className="border-t border-gray-300">
      <td className="px-2">{student.name}</td>
      <td className="text-center py-0.5 px-2 border-x border-gray-300 bg-red-50 max-sm:hidden">
        {result.wrong}
      </td>
      <td className="text-center py-0.5 px-2 border-x border-gray-300 bg-yellow-50 max-sm:hidden">
        {result.notAnswered}
      </td>
      <td className="text-center py-0.5 px-2 bg-blue-50">
        {result.correct} / {result.total}
      </td>
    </tr>
  );
}
