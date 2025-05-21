import React from "react";
import { Link } from "react-router-dom";

export default function StudentComponent({ studentId, students }) {
  const student = students.find((student) => student.id === studentId);

  return (
    <Link to={`/userProfile/${studentId}`} dir="rtl" className="block">
      <div className="flex gap-4 items-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-green-200 transition-all duration-300">
        <div className="relative">
          <img
            src={
              student.image ||
              "https://cdn-icons-png.freepik.com/512/8801/8801434.png"
            }
            alt="Student img"
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg text-green-600 group-hover:text-green-700">
            {student.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
