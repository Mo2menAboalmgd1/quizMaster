import React from "react";

export default function StudentGrade({ students, result }) {
  const student = students.find((student) => student.id === result.studentId);

  return (
    <tr>
      <td className="border px-2">{student.name}</td>
      <td className="border text-center py-0.5 px-2 bg-red-100 max-sm:hidden">{result.wrong}</td>
      <td className="border text-center py-0.5 px-2 bg-yellow-100 max-sm:hidden">{result.notAnswered}</td>
      <td className="border text-center py-0.5 px-2 bg-blue-100">
        {result.correct} / {result.total}
      </td>
    </tr>
  );
}
