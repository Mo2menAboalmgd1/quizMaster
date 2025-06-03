import React, { useState } from "react";
import { useCurrentUser } from "../../store/useStore";
import DisplayAnswersInCreateExam from "../../components/DisplayAnswersInCreateExam";
import CreateExamForm from "../../components/CreateExamForm";
import AddQuestionForm from "../../components/AddQuestionForm";
import {
  useExamByItsId,
  useStagesByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import PageWrapper from "../../components/PageWrapper";

export default function CreateExam() {
  const { type } = useParams();

  const { currentUser } = useCurrentUser();
  const [examId, setExamId] = useState(null);

  const {
    data: examData,
    isLoading: isExamDataLoading,
    error: examDataError,
  } = useExamByItsId(examId);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser.id);

  if (currentUser.type === "student") {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
        <p className="text-2xl font-semibold text-gray-700">
          عذرًا، هذه الصفحة مخصصة للمعلمين فقط.
        </p>
        <p className="text-gray-500">
          إذا كنت طالبًا، يمكنك العودة إلى الصفحة الرئيسية أو التواصل مع معلمك
          لمزيد من المعلومات.
        </p>
      </div>
    );
  }

  if (isExamDataLoading || isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError || examDataError) {
    <ErrorPlaceHolder message={"حدث خطأ أثناء تحميل الصفحة"} />;
  }

  if (examDataError) toast.error(examDataError.message);

  return (
    <PageWrapper title={`إنشاء اختبار ${type === "time" ? "سرعة" : "تقليدي"}`}>
      <CreateExamForm
        type={type}
        examData={examData}
        examId={examId}
        setExamId={setExamId}
        isCreate={true}
        stages={stages}
      />

      {isExamDataLoading && <Loader message="جاري التحميل" />}

      {examData && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <AddQuestionForm examData={examData} examId={examId} />
        </div>
      )}

      {examId && (
        <div className="rounded-xl overflow-hidden">
          <DisplayAnswersInCreateExam examId={examId} />
        </div>
      )}
    </PageWrapper>
  );
}
