import React from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser, useDarkMode } from "../../store/useStore";
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
import clsx from "clsx";
import PageWrapper from "../../components/PageWrapper";

export default function Exam() {
  const { id: examId } = useParams();
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();
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

  const examDataTable = {
    ["المادة"]: examData.subject,
    ["العنوان"]: examData.title,
    ["الطالب"]: currentUser.name,
    ["عدد الأسئلة"]: questions.length,
  };

  return (
    <PageWrapper title={`امتحان ${examData.title}`}>
      {/* exam data card */}
      <div
        className={clsx(
          "shadow-sm rounded-xl border space-y-4",
          isDarkMode ? "bg-blue-500/10 border-blue-500/50" : "border-gray-200"
        )}
      >
        <div className="grid grid-cols-1">
          {Object.entries(examDataTable).map(([key, value]) => (
            <div
              className={clsx(
                "flex gap-2 items-center py-2 border-b last:border-b-0",
                isDarkMode ? "border-blue-500/50" : "border-gray-100"
              )}
            >
              <div className="py-1 px-3 space-x-2">
                <span
                  className={clsx(
                    "text-sm font-medium",
                    isDarkMode ? "text-blue-400" : "text-gray-600"
                  )}
                >
                  {key}:
                </span>
                <span
                  className={clsx(
                    "text-sm",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}
                >
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* questions */}
      {(!examResult || examData.isShowCorrection) && (
        <h2
          className={clsx(
            "font-extrabold text-center text-3xl p-5 flex gap-2 items-center justify-center",
            isDarkMode ? "text-blue-500" : "text-blue-700"
          )}
        >
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
        <div
          className={clsx(
            "p-8 rounded-lg border mt-8 space-y-8",
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-gray-50 border-gray-300"
          )}
        >
          <div className="text-center">
            <p
              className={clsx(
                "text-xl font-semibold mb-3",
                isDarkMode ? "text-blue-400" : "text-gray-700"
              )}
            >
              نتيجتك هي:{" "}
              <span
                className={clsx(
                  "font-bold",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}
              >
                {examResult.correct} من {examResult.total}
              </span>
            </p>
          </div>

          {/* result bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span
                className={clsx(
                  "text-sm",
                  isDarkMode ? "text-white" : "text-gray-600"
                )}
              >
                النسبة المئوية
              </span>
              <span
                className={clsx(
                  "text-lg font-semibold",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}
              >
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
                className="bg-gradient-to-l from-blue-500 to-blue-700 h-full transition-all duration-700 ease-out"
              ></div>
            </div>
          </div>

          {/* result summary boxes */}
          <div
            className={clsx(
              "grid grid-cols-3 gap-6",
              isDarkMode ? "text-white" : "text-gray-600"
            )}
          >
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">الصحيحة</p>
              <p className="text-2xl font-bold text-emerald-600">
                {examResult.correct}
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">الخاطئة</p>
              <p className="text-2xl font-bold text-red-500">
                {examResult.wrong}
              </p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">لم تُجب</p>
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
    </PageWrapper>
  );
}
