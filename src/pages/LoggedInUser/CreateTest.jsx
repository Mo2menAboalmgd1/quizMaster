import React, { useState } from "react";
import { useCurrentUser } from "../../store/useStore";
import DisplayAnswersInCreateExam from "../../components/DisplayAnswersInCreateExam";
import CreateExamForm from "../../components/CreateExamForm";
import AddQuestionForm from "../../components/AddQuestionForm";
import { useExamByItsId } from "../../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import CreateExamStudentplaceHolder from "../../components/CreateExamStudentPlaceHolder";

export default function CreateExam() {
  const { currentUser } = useCurrentUser();
  const [examId, setExamId] = useState(null);

  const {
    data: examData,
    isLoading: isExamDataLoading,
    error: examDataError,
  } = useExamByItsId(examId);

  if (currentUser.type === "student") return <CreateExamStudentplaceHolder />;

  if (examDataError) toast.error(examDataError.message);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <CreateExamForm
          examData={examData}
          examId={examId}
          setExamId={setExamId}
          isCreate={true}
        />
      </div>

      {isExamDataLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <span className="mr-3 font-medium text-gray-700">
            جاري التحميل...
          </span>
        </div>
      )}

      {examData && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <AddQuestionForm examData={examData} examId={examId} />
        </div>
      )}

      {examId && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <DisplayAnswersInCreateExam examId={examId} />
        </div>
      )}
    </div>
  );
}
