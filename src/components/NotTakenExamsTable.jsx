import React from "react";
import { formatTime } from "../utils/getDate";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function NotTakenExamsTable({ notTakenExams: exams }) {
  if (exams?.length === 0) {
    return (
      <NoDataPlaceHolder
        message={"قام الطالب بحل جميع الاختبارات"}
        icon={faCheckCircle}
      />
    );
  }

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="h-10">
            <th className="bg-gray-300 px-3 text-start">اسم الإختبار</th>
            <th className="bg-gray-300 px-3">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {exams?.map((exam) => (
            <tr key={exam.id} className="border-t border-gray-300">
              <td className="px-3 py-1">{exam.title}</td>
              <td className="px-3 text-center py-1">
                {formatTime(exam.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
