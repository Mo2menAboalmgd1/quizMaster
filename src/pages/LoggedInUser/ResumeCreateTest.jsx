import React from "react";
import { useCurrentUser } from "../../store/useStore";
import DisplayAnswersInCreateExam from "../../components/DisplayAnswersInCreateExam";
import { useParams } from "react-router-dom";
import { useExamByItsId } from "../../QueriesAndMutations/QueryHooks";
import AddQuestionForm from "../../components/AddQuestionForm";
import CreateExamForm from "../../components/CreateExamForm";
import toast from "react-hot-toast";

export default function CreateExam() {
  const { id: examId } = useParams();
  const { currentUser } = useCurrentUser();

  const {
    data: examData,
    isLoading: isExamDataLoading,
    error: examDataError,
  } = useExamByItsId(examId);

  if (currentUser.type === "student") <CreateExamStudentplaceHolder />;

  if (examDataError) {
    toast.error(examDataError.message);
    return;
  }

  return (
    <div>
      <CreateExamForm examData={examData} examId={examId} isCreate={false} />
      {isExamDataLoading && <div>Loading...</div>}
      {examData && <AddQuestionForm examData={examData} examId={examId} />}
      {examId && (
        <div className="mt-5">
          <DisplayAnswersInCreateExam examId={examId} />
        </div>
      )}
    </div>
  );
}
