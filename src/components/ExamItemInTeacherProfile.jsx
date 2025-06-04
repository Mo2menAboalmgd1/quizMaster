import React from "react";
import {
  useExamResultByStudentId,
  useQuestionsByExamId,
} from "../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { formatTime } from "../utils/getDate";
import clsx from "clsx";
import { useCurrentUser, useDarkMode } from "../store/useStore";

export default function ExamItemInTeacherProfile({ exam, stages }) {
  const { isDarkMode } = useDarkMode();
  const { currentUser } = useCurrentUser();
  const { data: questions, error: questionsError } = useQuestionsByExamId(
    exam.id,
    "length"
  );
  const { data: isExamTaken, error: isExamTakenError } =
    useExamResultByStudentId(exam.id, currentUser?.id);

  const stage = stages?.find((stage) => stage.id === exam.stage_id);
  console.log(stage);

  if (questionsError || isExamTakenError) {
    toast.error(questionsError.message);
    return;
  }

  return (
    <tr
      key={exam.id}
      className={clsx(
        " border-t",
        isDarkMode
          ? "text-white/50 border-blue-500/50"
          : "text-gray-700 border-gray-300",
        isExamTaken
          ? isDarkMode
            ? "bg-green-500/10"
            : "bg-green-50"
          : isDarkMode
          ? "text-blue-600"
          : "bg-red-50"
      )}
    >
      <td className={clsx(isDarkMode ? "text-blue-500" : "text-blue-600")}>
        <Link className="w-full h-full block px-3 py-2" to={"/exam/" + exam.id}>
          {exam.title}
        </Link>
      </td>
      <td className="text-center max-sm:hidden">
        {formatTime(exam.created_at)}
      </td>
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
          <span
            className={clsx(isDarkMode ? "text-green-500" : "text-green-600")}
          >
            تم الحل
          </span>
        </td>
      ) : (
        <td
          className={clsx(
            isDarkMode
              ? "bg-blue-500/10 text-blue-500 border-s border-blue-500/50"
              : "bg-blue-100"
          )}
        >
          <Link
            className="h-full w-full flex items-center justify-center"
            to={"/exam/" + exam.id}
          >
            ابدأ الآن
          </Link>
        </td>
      )}
    </tr>
  );
}
