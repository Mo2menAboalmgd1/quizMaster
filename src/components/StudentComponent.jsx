import React from "react";
import { Link } from "react-router-dom";
import DisplayFile from "../components/DisplayFile";

export default function StudentComponent({ studentId, students }) {
  const student = students.find((student) => student.id === studentId);

  return <td className="border-x px-3">{student.name}</td>;
}

/*
<Link to={`/userProfile/${studentId}`} dir="rtl" className="block">
        <div className="flex gap-4 items-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all duration-300">
          <div className="relative">
            <img
              src={
                student.avatar ||
                "https://cdn-icons-png.freepik.com/512/8801/8801434.png"
              }
              alt="Student img"
              className="w-14 h-14 rounded-full object-cover cursor-pointer"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">
              {student.name}
            </h3>
          </div>
        </div>
      </Link>
*/
