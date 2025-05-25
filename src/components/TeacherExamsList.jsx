import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteExamMutation,
  useEditExamDataMutation,
} from "../QueriesAndMutations/mutationsHooks";
import { useCurrentUser } from "../store/useStore";
import {
  faArrowLeft,
  faCheckDouble,
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

  const { mutateAsync: editExam } = useEditExamDataMutation();

  const handleUndoPublish = async (examId, title, stage) => {
    await editExam({
      action: {
        teacherId: currentUser?.id,
        title: title,
        stage: stage || "(اختبار عام)",
        isEdit: "unPublish",
        examId,
      },
      update: {
        done: false,
      },
    });
  };

  const handleShowCorrection = async (exam, value) => {
    editExam({
      action: {
        teacherId: currentUser?.id,
        stage: exam.stage || "(اختبار عام)",
        title: exam.title,
        isEdit: value ? "showCorrection" : "hideCorrection",
        examId: exam.id,
      },
      update: {
        isShowCorrection: value,
      },
    });
  };

  return (
    <div className="space-y-3" dir="rtl">
      {list.length === 0 && (
        <NoDataPlaceHolder message={"لا يوجد امتحانات"} icon={faFileAlt} />
      )}
      {list.map((exam) => {
        const isShowCorrection = exam.isShowCorrection;
        return (
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
            <button
              onClick={() => setIsDelete(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <div className="flex gap-2 max-md:h-8">
              {isPublished && (
                <>
                  <div title="عرض الاجابات الصحيحة ليتمكن الطلاب من رؤيتها بعد تسليم الامتحان">
                    <input
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleShowCorrection(exam, true);
                        } else {
                          handleShowCorrection(exam, false);
                        }
                      }}
                      defaultChecked={isShowCorrection}
                      type="checkbox"
                      id={`${exam.id}`}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={`${exam.id}`}
                      className="bg-gray-100 border border-gray-300 peer-checked:text-blue-600 peer-checked:border peer-checked:border-blue-400 peer-checked:bg-blue-100
                    px-4 py-2 text-gray-700
                    rounded-md flex items-center gap-1 transition-colors md:py-1 cursor-pointer select-none w-fit h-full"
                    >
                      <FontAwesomeIcon icon={faCheckDouble} />
                      <span dir="rtl" className="md:hidden">
                        عرض الاجابات الصحيحة
                      </span>
                    </label>
                  </div>
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
        );
      })}
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
