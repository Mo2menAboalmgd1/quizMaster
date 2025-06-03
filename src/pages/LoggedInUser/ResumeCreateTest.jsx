import React from "react";
import { useCurrentUser } from "../../store/useStore";
import DisplayAnswersInCreateExam from "../../components/DisplayAnswersInCreateExam";
import { useParams } from "react-router-dom";
import { useExamByItsId } from "../../QueriesAndMutations/QueryHooks";
import AddQuestionForm from "../../components/AddQuestionForm";
import CreateExamForm from "../../components/CreateExamForm";
import toast from "react-hot-toast";
import PageWrapper from "../../components/PageWrapper";
import Loader from "../../components/Loader";

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
    <PageWrapper
      title={
        examData?.isTime ? "استكمال اختبار السرعة" : "استكمال الاختبار التقليدي"
      }
    >
      <CreateExamForm examData={examData} examId={examId} isCreate={false} />
      {isExamDataLoading && <Loader />}
      {examData && <AddQuestionForm examData={examData} examId={examId} />}
      {examId && (
        <div className="mt-5">
          <DisplayAnswersInCreateExam examId={examId} />
        </div>
      )}
    </PageWrapper>
  );
}
