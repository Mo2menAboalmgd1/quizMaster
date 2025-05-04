import React from "react";
import { Link } from "react-router-dom";
import {
  useDeleteExamMutation,
  useEditExamDataMutation,
} from "../QueriesAndMutations/mutationsHooks";
import { useCurrentUser } from "../store/useStore";
import toast from "react-hot-toast";
import { faArrowLeft, faFileAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TeacherExamsList({ list, isDone }) {
  const { currentUser } = useCurrentUser();

  const { mutate: deleteExamMutation } = useDeleteExamMutation(currentUser.id);

  const handleDeleteExam = async (examId) => {
    deleteExamMutation(examId);
  };

  const { mutateAsync: undoPublishMutation } = useEditExamDataMutation();

  const handleUndoPublish = async (examId) => {
    const testData = {
      done: false,
    };

    await undoPublishMutation({ testData, examId });

    toast.success("تم إعادة الاختبار إلى قائمة الغير المكتملة");
  };

  return (
    <div className="space-y-3">
      {list.length === 0 && (
        <div className="py-4 px-6 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-center">
          لا يوجد امتحانات حاليا
        </div>
      )}
      {list.map((exam) => (
        <div key={exam.id} className="flex flex-col md:flex-row gap-2 w-full">
          <Link
            className="p-3 border border-gray-300 rounded-lg block hover:bg-gray-50 grow transition-colors text-gray-800 hover:border-blue-400"
            dir="rtl"
            to={"/resumeCreateTest/" + exam.id}
          >
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faFileAlt}
                className="text-gray-500 ml-2"
              />
              <span>{exam.title}</span>
            </div>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteExam(exam.id)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            {isDone && (
              <button
                onClick={() => handleUndoPublish(exam.id)}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-800 font-bold px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> <span className="md:hidden">إلغاء النشر</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
