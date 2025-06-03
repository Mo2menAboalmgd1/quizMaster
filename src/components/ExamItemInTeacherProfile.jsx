import React from "react";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { formatTime } from "../utils/getDate";
import clsx from "clsx";

export default function ExamItemInTeacherProfile({
  exam,
  isExamTaken,
  stages,
}) {
  const { data: questions, error: questionsError } = useQuestionsByExamId(
    exam.id,
    "length"
  );

  const stage = stages?.find((stage) => stage.id === exam.stage_id);
  console.log(stage);

  if (questionsError) {
    toast.error(questionsError.message);
    return;
  }

  return (
    <tr
      key={exam.id}
      className={clsx(
        "text-gray-700 border-t border-gray-300",
        isExamTaken ? "bg-green-50" : "bg-red-50"
      )}
    >
      <td className="text-blue-600">
        <Link className="w-full h-full block px-3 py-2" to={"/exam/" + exam.id}>
          {exam.title}
        </Link>
      </td>
      <td className="text-center">{formatTime(exam.created_at)}</td>
      <td className="text-center">
        {questions === 1
          ? "سؤال واحد"
          : questions === 2
          ? "سؤالين"
          : questions < 11
          ? `${questions} أسئلة`
          : questions + "سؤال"}
      </td>

      {isExamTaken ? (
        <td className="text-center">
          <span className="text-green-600">تم الحل</span>
        </td>
      ) : (
        <td className="bg-blue-100">
          <Link
            className="text-blue-600 h-full w-full flex items-center justify-center"
            to={"/exam/" + exam.id}
          >
            ابدأ الآن
          </Link>
        </td>
      )}
    </tr>
  );
}
