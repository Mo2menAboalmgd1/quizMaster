// old code

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import {
  useAnswersByStudentIdAndExamId,
  useColumnByUserId,
  useExamByItsId,
  useExamsResultsByStudentIdAndExamId,
  useQuestionsByExamId,
} from "../../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import {
  useSaveAnswer,
  useSaveStudentResult,
  useTakeExam,
} from "../../QueriesAndMutations/mutationsHooks";
import { useCurrentUser } from "../../store/useStore";
import {
  faCheckCircle,
  faExclamationTriangle,
  faPaperPlane,
  faQuestionCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/Loader";

export default function Exam() {
  const { id: examId } = useParams();
  const { currentUser } = useCurrentUser();
  const [isShowResult, setIsShowResult] = React.useState(false);

  useEffect(() => {
    const handleBlur = () => {
      console.log("الطالب فقد التركيز عن الصفحة");
    };

    const handleFocus = () => {
      console.log("الطالب رجع للصفحة");
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const {
    data: examsTaken,
    isLoading: isExamsTakenLoading,
    error: examsTakenError,
  } = useColumnByUserId(currentUser.id, "students", "examsTaken");
  console.log(examsTaken);

  const {
    data: answers,
    isLoading: isAnswersLoading,
    error: answersError,
  } = useAnswersByStudentIdAndExamId(currentUser.id, examId);

  const {
    data: exam,
    isLoading: isExamLoading,
    error: examError,
  } = useExamByItsId(examId);

  const {
    data: examResult,
    isLoading: isExamResultLoading,
    error: examResultError,
  } = useExamsResultsByStudentIdAndExamId(currentUser.id, examId);
  console.log(examResult);

  const isExamTaken = examsTaken?.some((exId) => exId === examId);
  // console.log(isExamTaken);

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestionsByExamId(examId);

  const { mutateAsync: saveAnswerMutation } = useSaveAnswer();

  const handleSaveAnswer = async (
    ansId,
    questionId,
    selectedAns,
    correctAns
  ) => {
    const answer = {
      id: ansId,
      studentId: currentUser.id,
      questionId,
      examId,
      selectedAns,
      correctAns,
      isCorrect: selectedAns === correctAns,
    };
    await saveAnswerMutation(answer);
  };

  const unansweredQuestions = questions?.filter((question) => {
    return !answers?.some((answer) => answer.questionId === question.id);
  });

  console.log("الأسئلة اللي ملهاش إجابة:", unansweredQuestions);

  // send exam
  const { mutateAsync: saveResultMutation } = useSaveStudentResult();
  const { mutateAsync: setExamTaken } = useTakeExam();

  const handleSendExam = async () => {
    if (!answers) return;

    let correctCount = 0;

    answers.forEach((ans) => {
      if (ans.isCorrect) correctCount++;
    });

    setIsShowResult(true);

    const newExamsTaken = (examsTaken || [])?.includes(examId)
      ? examsTaken || []
      : [...(examsTaken || []), examId];

    console.log(newExamsTaken, correctCount);

    try {
      await saveResultMutation({
        grade: correctCount,
        studentId: currentUser.id,
        examId,
        total: questions?.length,
        teacherId: exam?.teacherId,
      });
      await setExamTaken({
        examId,
        studentId: currentUser.id,
        examsTaken: newExamsTaken,
      });
      toast.success("تم إرسال الامتحان بنجاح");
    } catch (error) {
      console.error("خطأ أثناء إرسال الامتحان:", error);
      toast.error("حدث خطأ أثناء إرسال الامتحان");
    }
  };

  // عدد الصح
  const correctCount =
    answers && Array.isArray(answers)
      ? answers.filter((ans) => ans.isCorrect).length
      : 0;

  // عدد الغلط
  const wrongCount = answers ? answers.length - correctCount : 0;

  // عدد اللي متحلش
  const unansweredCount = unansweredQuestions?.length || 0;

  if (
    isExamLoading ||
    isQuestionsLoading ||
    isAnswersLoading ||
    isExamsTakenLoading ||
    isExamResultLoading
  )
    return <Loader message="جري التحميل" />;

  if (examError) {
    toast.error(examError.message);
    return;
  }
  if (questionsError) {
    toast.error(questionsError.message);
    return;
  }
  if (answersError) {
    toast.error(answersError.message);
    return;
  }
  if (examsTakenError) {
    toast.error(examsTakenError.message);
    return;
  }
  if (examResultError) {
    toast.error(examResultError.message);
    return;
  }

  if (!exam) {
    toast.error("لم يتم العثور على الامتحان");
    return (
      <div>لم يتم العثور على هذا الامتحان يبدو أنه غير موجود أو تم حذفه</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-4xl mx-auto">
      <div className="w-full bg-white rounded-xl shadow-lg p-5">
        <h2 className="text-2xl font-bold text-center py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm mb-2">
          {exam.title}
        </h2>
        {isExamTaken ? (
          <p className="text-center text-gray-600 text-sm mt-4">
            لقد قمت بالإجابة على هذا الامتحان مسبقا
          </p>
        ) : (
          <p className="text-center text-gray-600 text-sm mt-4">
            قم بالإجابة على جميع الأسئلة ثم اضغط على زر إرسال الامتحان
          </p>
        )}
      </div>

      <div className="space-y-8 w-full">
        {questions?.map((question, index) => (
          <div
            key={index}
            className={clsx(
              "border rounded-xl p-5 transition-all shadow-sm hover:shadow-md",
              (isShowResult || isExamTaken) &&
                unansweredQuestions?.some((q) => q.id === question.id)
                ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400"
                : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300"
            )}
            dir="rtl"
          >
            {(isShowResult || isExamTaken) &&
              unansweredQuestions?.some((q) => q.id === question.id) && (
                <div className="mb-4 text-center font-semibold text-orange-600 bg-orange-100 py-2 px-4 rounded-lg border border-orange-200 flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <span>سؤال لم يتم الإجابة عليه</span>
                </div>
              )}

            <div className="flex gap-3 w-full items-start mb-4">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-sm flex items-center justify-center min-w-10">
                {index + 1}
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg grow font-medium shadow-sm">
                {question.text}
              </div>
            </div>

            <div className="space-y-3 pr-12">
              {question.answers.map((answer, idx) => {
                const ansId = `${question.id}-${idx}`;
                const currentAnswer = answers?.find((ans) => ans.id === ansId);
                const isCorrect =
                  currentAnswer?.selectedAns === currentAnswer?.correctAns;

                return (
                  <div
                    key={idx}
                    className={clsx(
                      "flex gap-3 items-center p-3 rounded-lg border transition-all",
                      (isShowResult || isExamTaken) &&
                        (currentAnswer
                          ? isCorrect
                            ? "bg-green-50 border-green-300"
                            : "bg-red-50 border-red-300"
                          : answer === question.correct
                          ? "bg-green-50 border-green-300"
                          : "border-gray-200 bg-white"),
                      !(isShowResult || isExamTaken) &&
                        "hover:border-blue-300 border-gray-200 bg-white"
                    )}
                  >
                    <input
                      disabled={isShowResult || isExamTaken}
                      onChange={() =>
                        handleSaveAnswer(
                          ansId,
                          question.id,
                          answer,
                          question.correct
                        )
                      }
                      type="radio"
                      id={ansId}
                      name={question.id}
                      defaultChecked={
                        answers?.find((ans) => ans.questionId === question.id)
                          ?.selectedAns === answer
                      }
                      className="w-5 h-5 accent-blue-600"
                    />
                    <label
                      htmlFor={ansId}
                      className={clsx(
                        "cursor-pointer",
                        (isShowResult || isExamTaken) &&
                          (currentAnswer
                            ? isCorrect
                              ? "text-green-800"
                              : "text-red-800"
                            : answer === question.correct
                            ? "text-green-800"
                            : "")
                      )}
                    >
                      {answer}
                    </label>

                    {(isShowResult || isExamTaken) && (
                      <>
                        {currentAnswer && isCorrect && (
                          <span className="ml-auto text-green-600">
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </span>
                        )}
                        {currentAnswer && !isCorrect && (
                          <span className="ml-auto text-red-600">
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </span>
                        )}
                        {!currentAnswer && answer === question.correct && (
                          <span className="ml-auto text-green-600">
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!isShowResult && !isExamTaken && (
        <button
          onClick={handleSendExam}
          className="py-3 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          <span>إرسال الإمتحان</span>
        </button>
      )}

      {(isShowResult || isExamTaken) && (
        <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-gray-50 to-slate-100 p-6 rounded-xl border border-gray-300 shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 w-full text-center">
            نتيجة الإمتحان
          </h2>
          {isExamsTakenLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <span className="mr-3">Loading...</span>
            </div>
          ) : (
            <div dir="rtl" className="space-y-4 text-lg w-full">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                <p className="font-bold text-blue-800 text-xl mb-1">
                  درجتك هي <span className="text-2xl">{examResult?.grade}</span>{" "}
                  من <span>{examResult?.total}</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (examResult?.grade / examResult?.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {((examResult?.grade / examResult?.total) * 100).toFixed(2)}%
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600"
                    />
                    <span>{correctCount}</span>
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    الإجابات الصحيحة
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-700 font-semibold flex items-center justify-center gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-600"
                    />
                    <span>{wrongCount}</span>
                  </p>
                  <p className="text-xs text-red-700 mt-1">الإجابات الخاطئة</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-yellow-700 font-semibold flex items-center justify-center gap-2">
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="text-yellow-600"
                    />
                    <span>{unansweredCount}</span>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">بدون إجابة</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
