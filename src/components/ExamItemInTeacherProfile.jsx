import {
  faClipboardList,
  faLayerGroup,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {
  useColumnByUserId,
  useQuestionsByExamId,
} from "../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../store/useStore";

export default function ExamItemInTeacherProfile({ exam }) {
  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestionsByExamId(exam.id);

  if (isQuestionsLoading) return <div>Loading...</div>;

  if (questionsError) {
    toast.error(questionsError.message);
    return;
  }

  return (
    <Link
      className="p-3 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all flex items-center gap-3 group"
      dir="rtl"
      to={"/exam/" + exam.id}
      key={exam.id}
    >
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
        <FontAwesomeIcon icon={faClipboardList} />
      </div>
      <div className="grow">
        <h3 className="font-medium text-gray-800 group-hover:text-green-700 transition-colors">
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
            {questions?.length || 0} سؤال
          </span>
        </div>
      </div>
      <div className="bg-green-100 max-sm:hidden text-green-700 px-3 py-1 rounded-full text-sm font-medium">
        ابدأ الآن
      </div>
    </Link>
  );
}
