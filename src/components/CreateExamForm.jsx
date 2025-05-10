import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../store/useStore";
import {
  useCreateNewExamMutation,
  useEditExamDataMutation,
} from "../QueriesAndMutations/mutationsHooks";
import {
  useColumnByUserId,
  useQuestionsByExamId,
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

export default function CreateExamForm({
  examData,
  examId,
  setExamId,
  isCreate,
}) {
  const { currentUser } = useCurrentUser();
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    if (examData?.stage) setSelectedStage(examData.stage);
  }, [examData]);

  console.log(examData);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(currentUser?.id, "teachers", "stages");

  const { mutate: newExamMutation } = useCreateNewExamMutation(setExamId);

  const handleCreateNewExam = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const testData = {
      subject: currentUser.subject,
      title: formData.get("examName"),
      stage: selectedStage,
      teacherId: currentUser.id,
    };
    if (!testData.title) return;
    newExamMutation(testData);
  };

  const handleEditExam = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const testData = {
      title: formData.get("examName"),
      stage: selectedStage,
      teacherId: currentUser.id,
    };
    await editExamMutation({ testData, examId: examData.id, isEdit: "edit" });
  };

  const { data: questions } = useQuestionsByExamId(examId);
  const { mutateAsync: editExamMutation } = useEditExamDataMutation();

  const handlePublishExam = async () => {
    console.log(questions);
    if (!questions || questions.length < 1) {
      return toast.error("لا يوجد أسئلة في الاختبار");
    }

    const testData = { done: true };

    await editExamMutation({
      testData,
      examId: examData.id,
      isEdit: "publish",
    });
  };

  const { mutateAsync: undoPublishMutation } = useEditExamDataMutation();

  const handleUndoPublish = async (examId) => {
    const testData = {
      done: false,
    };

    await undoPublishMutation({ testData, examId, isEdit: "unPublish" });
  };

  if (isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError) {
    toast.error("حدث خطأ أثناء تحميل المراحل");
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
      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg flex flex-col gap-4 items-center p-6 relative shadow-sm w-full"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

      <p className="py-2 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center font-bold text-lg rounded-lg shadow-sm">
        {isCreate ? "إنشاء" : "تعديل"} اختبار {currentUser.subject}
      </p>

      <div className="w-full space-y-4">
        <div className="relative">
          <input
            className="text-center h-12 border border-gray-300 bg-white w-full rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm"
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
            className="text-center h-12 border border-gray-300 bg-white w-full rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm appearance-none"
          >
            {stages?.map((stage, index) => (
              <option key={index} value={stage}>
                {stage}
              </option>
            ))}
            <option value="">جميع الصفوف</option>
          </select>

          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faGraduationCap} className="text-gray-400" />
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-full mt-2">
        <button className="py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center font-bold rounded-lg shadow-sm w-full transition-all flex items-center justify-center gap-2">
          <FontAwesomeIcon
            icon={isCreate ? (examData ? faEdit : faPlus) : faEdit}
          />
          {isCreate ? (examData ? "تعديل" : "إنشاء") : "تعديل"}
        </button>

        {examData && !examData?.done ? (
          <button
            onClick={handlePublishExam}
            type="button"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faUpload} />
            نشر الاختبار
          </button>
        ) : examData && examData?.done ? (
          <button
            onClick={() => handleUndoPublish(examId)}
            type="button"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-3 px-6 rounded-lg shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowRotateBack} />
            إلغاء نشر الاختبار
          </button>
        ) : null}
      </div>
    </form>
  );
}
