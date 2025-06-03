import React from "react";
import { formatTime } from "../utils/getDate";
import clsx from "clsx";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

export default function GradesTable({ exams, examsData }) {
  if (exams.length === 0) {
    return (
      <NoDataPlaceHolder
        message={"لم يقم الطالب بالإجابة على أي اختبار"}
        icon={faXmarkCircle}
      />
    );
  }
  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="h-10">
            <th className="bg-gray-300 text-start px-3 border-b border-gray-400">
              اسم الإختبار
            </th>
            <th className="bg-gray-300 px-3 border-b border-gray-400">
              الدرجة
            </th>
            <th className="bg-gray-300 px-3 border-b border-gray-400">
              التاريخ
            </th>
          </tr>
        </thead>
        <tbody>
          {exams?.map((exam) => (
            <tr key={exam.id} className="border-t border-gray-300">
              <td className="px-3 py-1">
                {
                  examsData?.find((examData) => examData.id === exam.examId)
                    ?.title
                }
              </td>
              <td
                className={clsx(
                  "text-center py-1 border-x border-gray-300",
                  exam.correct === exam.total
                    ? "bg-green-100"
                    : exam.correct > exam.total / 2
                    ? "bg-yellow-100"
                    : "bg-red-100"
                )}
              >
                {exam.correct} / {exam.total}
              </td>
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
