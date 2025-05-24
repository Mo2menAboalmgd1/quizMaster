import React from "react";
import { formatTime } from "../utils/getData";
import clsx from "clsx";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

export default function GradesTable({ exams, examsData }) {
  if (exams.length === 0) {
    return (
      <NoDataPlaceHolder
        message={"لم يقم الطالب بالإجابة على أي امتحان"}
        icon={faXmarkCircle}
      />
    );
  }
  return (
    <div dir="rtl" className="border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="h-10">
            <th className="bg-green-300 px-3">اسم الإختبار</th>
            <th className="bg-blue-300 px-3 border-x">الدرجة</th>
            <th className="bg-yellow-300 px-3">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {exams?.map((exam) => (
            <tr key={exam.id} className="border-t">
              <td className="px-3 py-1 bg-green-100">
                {
                  examsData?.find((examData) => examData.id === exam.examId)
                    ?.title
                }
              </td>
              <td className={clsx("text-center py-1 border-x",
                exam.correct === exam.total ? "bg-green-300" : exam.correct > exam.total / 2 ? "bg-yellow-300" : "bg-red-300"
              )}>
                {exam.correct} / {exam.total}
              </td>
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
