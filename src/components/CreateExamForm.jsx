import React, { useEffect, useState } from "react";
import { publicStage, useCurrentUser, useDarkMode } from "../store/useStore";
import {
  useCreateNewExamMutation,
  useEditExamDataMutation,
} from "../QueriesAndMutations/mutationsHooks";
import {
  useQuestionsByExamId,
  useStagesByTeacherId,
} from "../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import {
  faArrowRotateBack,
  faBook,
  faChevronDown,
  faEdit,
  faGraduationCap,
  faPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "./Loader";
import clsx from "clsx";

export default function CreateExamForm({
  examData,
  examId,
  setExamId,
  isCreate,
  type,
}) {
  const isTime = type === "time";
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();
  const [selectedStage, setSelectedStage] = useState(publicStage);

  useEffect(() => {
    if (examData?.stage_id) setSelectedStage(examData.stage_id);
  }, [examData]);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestionsByExamId(examId);

  const { mutate: newExamMutation } = useCreateNewExamMutation(setExamId);
  const { mutateAsync: editExam } = useEditExamDataMutation();
  const handleCreateNewExam = (e) => {
    toast.loading("جاري الإنشاء");
    e.preventDefault();
    const formData = new FormData(e.target);
    const testData = {
      subject: currentUser.subject,
      title: formData.get("examName"),
      isTime,
      stage_id: selectedStage,
      teacherId: currentUser.id,
    };
    // console.log(testData)
    if (!testData.title) {
      toast.dismiss();
      toast.error("يجب إضافة اسم للاختبار");
      return;
    }
    newExamMutation(testData);
  };

  const handleEditExam = async (e) => {
    e.preventDefault();
    // console.log(selectedStage);
    toast.loading("جاري التعديل");
    const formData = new FormData(e.target);
    await editExam({
      action: {
        teacherId: currentUser.id,
        stage:
          stages?.find((stage) => stage.id === examData.stage_id).name ||
          "(اختبار عام)",
        title: examData.title,
        isEdit: "edit",
        examId,
      },
      update: {
        title: formData.get("examName"),
        stage_id: selectedStage,
      },
    });
  };

  const handlePublishAndUndoPublish = async (isPublish) => {
    if (questions?.length < 2) {
      toast.error("يجب إضافة سؤالين على الأقل");
      return;
    }
    console.log(stages, examData);
    await editExam({
      action: {
        teacherId: currentUser.id,
        title: examData.title,
        stage:
          stages?.find((stage) => stage.id === examData.stage_id)?.name ||
          "اختبار عام",
        isEdit: isPublish ? "publish" : "unPublish",
        examId,
      },
      update: {
        isPublished: isPublish,
      },
    });
  };

  if (isStagesLoading || isQuestionsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError || questionsError) {
    toast.error("حدث خطأ ما، أعد المحاولة");
    return null; // Render nothing or handle the error appropriately
  }

  return (
    <form
      onSubmit={
        isCreate
          ? examData
            ? handleEditExam
            : handleCreateNewExam
          : handleEditExam
      }
      className={clsx(
        "border p-3 rounded-lg",
        isDarkMode
          ? "bg-blue-500/10 border-blue-500/50"
          : "bg-gray-100 border-gray-300"
      )}
    >

      <div className="w-full space-y-3 mb-3">
        <div className="relative">
          <input
            className={clsx(
              "text-center border h-12 w-full rounded-lg px-4 focus:outline-none transition-all outline-none",
              isDarkMode
                ? "border-blue-500/50 focus:border-blue-500 bg-slate-900"
                : "border-gray-300 bg-white focus:border-blue-400"
            )}
            name="examName"
            type="text"
            placeholder="اسم الاختبار"
            defaultValue={examData ? examData.title : ""}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faBook} className="text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <select
            name="stage"
            id="stage"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className={clsx(
              "text-center border h-12 w-full rounded-lg px-4 focus:outline-none transition-all outline-none  appearance-none",
              isDarkMode
                ? "border-blue-500/50 focus:border-blue-500 bg-slate-900"
                : "border-gray-300 bg-white focus:border-blue-400"
            )}
          >
            {stages?.map((stage, index) => (
              <option key={index} value={stage.id}>
                {stage.id !== publicStage ? stage.name : "اختبار عام"}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faGraduationCap} className="text-gray-400" />
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button className="py-3 px-6 bg-gradient-to-r text-white text-center font-bold rounded-lg w-full transition-all flex items-center justify-center gap-2 cursor-pointer bg-blue-600">
          {isCreate ? (examData ? "تعديل" : "إنشاء") : "تعديل"}
          <FontAwesomeIcon
            icon={isCreate ? (examData ? faEdit : faPlus) : faEdit}
          />
        </button>

        {examData && !examData?.isPublished ? (
          <button
            onClick={() => handlePublishAndUndoPublish(true)}
            type="button"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg shadow-sm transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faUpload} />
            نشر الاختبار
          </button>
        ) : examData && examData?.isPublished ? (
          <button
            onClick={() => handlePublishAndUndoPublish(false)}
            type="button"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-3 px-6 rounded-lg shadow-sm transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowRotateBack} />
            إلغاء نشر الاختبار
          </button>
        ) : null}
      </div>
    </form>
  );
}
