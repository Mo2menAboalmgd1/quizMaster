import React from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import {
  useAnswersByStudentIdAndExamId,
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

  console.log(questions);

  const {
    data: studentAnswers,
    isLoading: isStudentAnswersLoading,
    error: studentAnswersError,
  } = useAnswersByStudentIdAndExamId(currentUser?.id, examId);

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
    isExamResultLoading ||
    isStudentAnswersLoading
  ) {
    return <Loader message="جاري تحميل الامتحان" />;
  }

  if (
    examDataError ||
    questionsError ||
    examResultError ||
    studentAnswersError
  ) {
    return <ErrorPlaceHolder message={"حدث خطأ، أعد المحاولة"} />;
  }

  if (!examData || !questions) {
    return (
      <NoDataPlaceHolder
        message="لم يتم العثور على الامتحان"
        icon={faFileAlt}
      />
    );
  }

  console.log(examResult);

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* exam data card */}
      <div className="p-5 border border-gray-300 bg-white shadow-md rounded-2xl space-y-2">
        <p className="text-lg font-semibold text-gray-700">
          المادة: <span className="text-gray-900">{examData.subject}</span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          عنوان الامتحان:{" "}
          <span className="text-gray-900">{examData.title}</span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          اسم الطالب: <span className="text-gray-900">{currentUser.name}</span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          عدد الأسألة:{" "}
          <span className="text-gray-900">{questions.length} سؤال</span>
        </p>
      </div>

      {/* questions */}
      <h2 className="font-extrabold text-center text-3xl p-3 flex gap-2 items-center justify-center text-blue-700">
        <span>الأسئلة</span>
        <FontAwesomeIcon icon={faQuestionCircle} />
      </h2>

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
        <div className="p-6 border-2 border-blue-400 bg-blue-50 rounded-2xl shadow-md mt-8 space-y-6">
          <p className="font-bold text-blue-700 text-lg text-center">
            نتيجتك هي:{" "}
            <span className="text-black">
              {examResult.correct} من {examResult.total}
            </span>
          </p>

          {/* result bar */}
          <div className="flex gap-3 items-center w-full">
            <div className="h-5 rounded-full w-full bg-blue-100 border border-blue-500 overflow-hidden">
              <div
                style={{
                  width: `${(examResult.correct / examResult.total) * 100}%`,
                }}
                className="bg-blue-500 h-full transition-all duration-500"
              ></div>
            </div>
            <p className="min-w-max font-medium text-blue-700">
              {`${Math.round((examResult.correct / examResult.total) * 100)}%`}
            </p>
          </div>

          {/* result summary boxes */}
          <div className="flex justify-center gap-6 text-center">
            <div className="bg-green-100 border border-green-500 rounded-xl p-4 w-32 shadow">
              <p className="text-green-700 font-bold text-sm">الصحيحة</p>
              <p className="text-green-900 text-2xl font-extrabold">
                {examResult.correct}
              </p>
            </div>
            <div className="bg-red-100 border border-red-500 rounded-xl p-4 w-32 shadow">
              <p className="text-red-700 font-bold text-sm">الخاطئة</p>
              <p className="text-red-900 text-2xl font-extrabold">
                {examResult.wrong}
              </p>
            </div>
            <div className="bg-yellow-100 border border-yellow-500 rounded-xl p-4 w-32 shadow">
              <p className="text-yellow-700 font-bold text-sm">لم تُجب</p>
              <p className="text-yellow-900 text-2xl font-extrabold">
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
