import React from "react";
import { formatTime } from "../utils/getData";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function NotTakenExamsTable({ notTakenExams: exams }) {
  if (exams.length === 0) {
    return (
      <NoDataPlaceHolder
        message={"قام الطالب بحل جميع الامتحانات"}
        icon={faCheckCircle}
      />
    );
  }
  
  return (
    <div dir="rtl" className="border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="h-10">
            <th className="bg-red-300 px-3">اسم الإختبار</th>
            <th className="bg-yellow-300 px-3">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {exams?.map((exam) => (
            <tr key={exam.id} className="border-t">
              <td className="px-3 py-1 bg-red-100">{exam.title}</td>
              <td className="px-3 text-center py-1 bg-yellow-50">
                {formatTime(exam.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
