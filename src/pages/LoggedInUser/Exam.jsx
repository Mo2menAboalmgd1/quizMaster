import React from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import {
  useExamByItsId,
  useExamsResultsByStudentIdAndExamId,
  useQuestionsByExamId,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faFileAlt, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSaveStudentResult } from "../../QueriesAndMutations/mutationsHooks";
import DisplayFile from "../../components/DisplayFile";
import toast from "react-hot-toast";
import QuestionDisplayedInTheExam from "../../components/QuestionDisplayedInTheExam";
import { supabase } from "../../config/supabase";

export default function Exam() {
  const { id: examId } = useParams();
  const { currentUser } = useCurrentUser();
  const [fileDisplayed, setFileDisplayed] = React.useState(false);

  const {
    data: examData,
    isLoading: isExamDataLoading,
    error: examDataError,
  } = useExamByItsId(examId);

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestionsByExamId(examId);

  questions;

  const {
    data: examResult,
    isLoading: isExamResultLoading,
    error: examResultError,
  } = useExamsResultsByStudentIdAndExamId(currentUser.id, examId);

  const { mutate: sendResult } = useSaveStudentResult();

  const handleSendResult = async () => {
    if (!currentUser?.id || !examId || !examData?.teacherId) {
      toast.error("بيانات ناقصة لحساب النتيجة");
      return;
    }

    toast.loading("جاري حساب نتيجتك...");

    const { data, error } = await supabase.rpc("calculate_exam_result", {
      studentid: currentUser.id,
      examid: examId,
    });

    if (error) {
      toast.error("حدث خطأ أثناء حساب النتيجة");
      console.error("Supabase RPC error:", error.message);
      return;
    }

    const { correct, wrong, not_answered, total } = data[0];

    sendResult({
      studentId: currentUser.id,
      teacherId: examData.teacherId,
      examId,
      total,
      correct,
      wrong,
      notAnswered: not_answered,
    });

    toast.dismiss();
    toast.success("تم إرسال النتيجة بنجاح");
  };

  if (currentUser.type === "teacher") {
    return <div>this page is not fou you</div>;
  }

  if (
    isExamDataLoading ||
    !currentUser ||
    isQuestionsLoading ||
    isExamResultLoading
  ) {
    return <Loader message="جاري تحميل الاختبار" />;
  }

  if (examDataError || questionsError || examResultError) {
    return <ErrorPlaceHolder message={"حدث خطأ، أعد المحاولة"} />;
  }

  if (!examData || !questions) {
    return (
      <NoDataPlaceHolder
        message="لم يتم العثور على الاختبار"
        icon={faFileAlt}
      />
    );
  }

  examResult;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* exam data card */}
      <div className="p-3 px-4 bg-white shadow-sm rounded-xl border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex gap-2 items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm font-medium text-gray-600">المادة:</span>
            <span className="text-sm text-gray-900">{examData.subject}</span>
          </div>
          <div className="flex gap-2 items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm font-medium text-gray-600">
              عنوان الاختبار:
            </span>
            <span className="text-sm text-gray-900">{examData.title}</span>
          </div>
          <div className="flex gap-2 items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm font-medium text-gray-600">
              اسم الطالب:
            </span>
            <span className="text-sm text-gray-900">{currentUser.name}</span>
          </div>
          <div className="flex gap-2 items-center py-2">
            <span className="text-sm font-medium text-gray-600">
              عدد الأسألة:
            </span>
            <span className="text-sm text-gray-900">
              {questions.length} سؤال
            </span>
          </div>
        </div>
      </div>

      {/* questions */}
      {(!examResult || examData.isShowCorrection) && (
        <h2 className="font-extrabold text-center text-3xl p-3 flex gap-2 items-center justify-center text-blue-700">
          <span>الأسئلة</span>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </h2>
      )}

      {/* questions iteration */}
      <div className="space-y-6">
        {(!examResult || examData.isShowCorrection) &&
          questions.map((question, index) => (
            <QuestionDisplayedInTheExam
              key={index}
              question={question}
              examResult={examResult}
              examId={examId}
              questionNumber={index + 1}
              setFileDisplayed={setFileDisplayed}
            />
          ))}
      </div>

      {/* send exam button */}
      {!examResult && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleSendResult}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md"
          >
            إرسال
          </button>
        </div>
      )}

      {/* exam result card */}
      {examResult && (
        <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 mt-8 space-y-8">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-700 mb-3">
              نتيجتك هي:{" "}
              <span className="text-gray-900 font-bold">
                {examResult.correct} من {examResult.total}
              </span>
            </p>
          </div>

          {/* result bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">النسبة المئوية</span>
              <span className="text-lg font-semibold text-gray-900">
                {`${Math.round(
                  (examResult.correct / examResult.total) * 100
                )}%`}
              </span>
            </div>
            <div className="h-2 rounded-full w-full bg-gray-100 overflow-hidden">
              <div
                style={{
                  width: `${(examResult.correct / examResult.total) * 100}%`,
                }}
                className="bg-gradient-to-l from-gray-500 to-gray-900 h-full transition-all duration-700 ease-out"
              ></div>
            </div>
          </div>

          {/* result summary boxes */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-600">الصحيحة</p>
              <p className="text-2xl font-bold text-emerald-600">
                {examResult.correct}
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-600">الخاطئة</p>
              <p className="text-2xl font-bold text-red-500">
                {examResult.wrong}
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-600">لم تُجب</p>
              <p className="text-2xl font-bold text-amber-500">
                {examResult.notAnswered}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* file display */}
      {fileDisplayed && (
        <DisplayFile file={fileDisplayed} setFileDisplayed={setFileDisplayed} />
      )}
    </div>
  );
}
