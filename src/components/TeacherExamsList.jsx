import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteExamMutation,
  useEditExamDataMutation,
} from "../QueriesAndMutations/mutationsHooks";
import { useCurrentUser } from "../store/useStore";
import toast from "react-hot-toast";
import {
  faArrowLeft,
  faFileAlt,
  faInfoCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import AlertBox from "./AlertBox";

export default function TeacherExamsList({ list, isPublished }) {
  const { currentUser } = useCurrentUser();
  const [isDelete, setIsDelete] = useState(false);

  const { mutate: deleteExamMutation } = useDeleteExamMutation();

  const deleteExamWithResults = async (examId, title, stage) => {
    deleteExamMutation({
      id: examId,
      title,
      actionStage: stage || "(اختبار عام)",
      teacherId: currentUser?.id,
      isDeleteWithResults: true,
    });
  };

  const deleteExamOnly = async (examId, title, stage) => {
    deleteExamMutation({
      id: examId,
      title,
      actionStage: stage || "(اختبار عام)",
      teacherId: currentUser?.id,
      isDeleteWithResults: false,
    });
  };

  const { mutateAsync: undoPublishMutation } = useEditExamDataMutation();

  const handleUndoPublish = async (examId, title, stage) => {
    const testData = {
      done: false,
      teacherId: currentUser?.id,
      title: title,
      actionStage: stage || "(اختبار عام)",
    };

    await undoPublishMutation({ ...testData, examId, isEdit: "unPublish" });

    toast.success("تم إعادة الاختبار إلى قائمة الغير المكتملة");
  };

  return (
    <div className="space-y-3" dir="rtl">
      {list.length === 0 && (
        <NoDataPlaceHolder message={"لا يوجد امتحانات"} icon={faFileAlt} />
      )}
      {list.map((exam) => (
        <div key={exam.id} className="flex flex-col md:flex-row gap-2 w-full">
          <Link
            className="p-3 border border-gray-300 border-r-4 border-r-blue-400 rounded-lg block hover:bg-gray-50 grow transition-colors text-gray-800 hover:border-blue-400"
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
              onClick={() => setIsDelete(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            {isPublished && (
              <>
                <button
                  onClick={() =>
                    handleUndoPublish(exam.id, exam.title, exam.stage)
                  }
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-800 font-bold px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />{" "}
                  <span className="md:hidden">إلغاء النشر</span>
                </button>
                <Link
                  to={"/examData/" + exam.id}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faInfoCircle} />{" "}
                  <span className="md:hidden"></span>
                </Link>
              </>
            )}
          </div>
          {isDelete && (
            <AlertBox
              title={"حذف"}
              type={"red"}
              message={"هذه الخطوة لا يمكن التراجع عنها"}
              firstOptionText={"حذف"}
              firstOptionDescription={
                "سيتم حذف هذا الاختبار مع الحفاظ على النتائج"
              }
              firstOptionFunction={() =>
                deleteExamOnly(exam.id, exam.title, exam.stage)
              }
              setOpen={setIsDelete}
              isSecondOption={true}
              secondOptionText={"حذف شامل"}
              secondOptionDescription={
                "سيؤدي هذا الاختيار لحذف الاختبار وجميع النتائج المتعلقة به"
              }
              secondOptionFunction={() =>
                deleteExamWithResults(exam.id, exam.title, exam.stage)
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

/*
  title,
  type,
  message,
  firstOptionText,
  firstOptionDescription,
  firstOptionFunction,
  isSecondOption,
  secondOptionText,
  secondOptionDescription,
  secondOptionFunction,
  setClose,
*/
