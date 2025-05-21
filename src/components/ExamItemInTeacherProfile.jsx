import {
  faClipboardList,
  faLayerGroup,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Loader from "./Loader";

export default function ExamItemInTeacherProfile({ exam, isExamTaken }) {
  const {
    data: questions,
    error: questionsError,
  } = useQuestionsByExamId(exam.id, "length");

  if (questionsError) {
    toast.error(questionsError.message);
    return;
  }

  return (
    <Link
      className={clsx(
        "p-3 border rounded-lg transition-all flex items-center gap-3 group",
        isExamTaken
          ? "bg-blue-50 border-blue-300 hover:bg-blue-100"
          : "bg-green-50 border-green-300 hover:bg-green-100"
      )}
      dir="rtl"
      to={"/exam/" + exam.id}
      key={exam.id}
    >
      <div
        className={clsx(
          "w-10 h-10 bg-gradient-to-r rounded-lg flex items-center justify-center text-white shadow-sm",
          isExamTaken
            ? "from-blue-500 to-blue-600"
            : "from-green-500 to-green-600"
        )}
      >
        <FontAwesomeIcon icon={faClipboardList} />
      </div>
      <div className="grow">
        <h3
          className={clsx(
            "font-medium transition-colors",
            isExamTaken ? "text-blue-600" : "text-green-600"
          )}
        >
          {exam.title}
        </h3>
        <div className="flex gap-4 mt-1 text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            <FontAwesomeIcon icon={faLayerGroup} className="text-gray-400" />
            {exam.stage ? exam.stage : "جميع الصفوف"}
          </span>
          <span className="text-gray-500 flex items-center gap-1">
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="text-gray-400"
            />
            {questions} سؤال
          </span>
        </div>
      </div>
      <div
        className={clsx(
          " max-sm:hidden px-3 py-1 rounded-full text-sm font-medium",
          isExamTaken ? "bg-blue-500 text-white" : "bg-green-500 text-white"
        )}
      >
        {isExamTaken ? "مكتمل" : "ابدأ الآن"}
      </div>
    </Link>
  );
}
