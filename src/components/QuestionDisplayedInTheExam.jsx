import clsx from "clsx";
import React from "react";
import {
  useAnswersByQuestionId,
  useAnswersByStudentIdAndExamId,
} from "../QueriesAndMutations/QueryHooks";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import ErrorPlaceHolder from "./ErrorPlaceHolder";
import Loader from "./Loader";
import { useCurrentUser } from "../store/useStore";
import { useSaveAnswer } from "../QueriesAndMutations/mutationsHooks";

export default function QuestionDisplayedInTheExam({
  question,
  examResult,
  examId,
  questionNumber,
  setFileDisplayed,
}) {
  const { currentUser } = useCurrentUser();

  const {
    data: quesionAnswers,
    isLoading: isQuesionAnswersLoading,
    error: quesionAnswersError,
  } = useAnswersByQuestionId(question?.id, examResult);

  const {
    data: studentAnswers,
    isLoading: isStudentAnswersLoading,
    error: studentAnswersError,
  } = useAnswersByStudentIdAndExamId(currentUser?.id, examId);

  const { mutate: saveAnswer } = useSaveAnswer();

  const handleSaveAnswer = (answer, questionId) => {
    saveAnswer({
      answerId: answer.id,
      studentId: currentUser.id,
      questionId,
      examId,
    });
  };

  if (isQuesionAnswersLoading || isStudentAnswersLoading) {
    return <Loader message="جاري تحميل الاختبار" />;
  }

  if (quesionAnswersError || studentAnswersError) {
    return <ErrorPlaceHolder message="حدث خطأ، أعد المحاولة" />;
  }

  if (!quesionAnswers || quesionAnswers.length === 0) {
    return (
      <NoDataPlaceHolder
        message="لا يوجد اجابات لهذا السؤال"
        icon={faComment}
      />
    );
  }

  const studentAnswer = studentAnswers.find(
    (ans) => ans.questionId === question.id
  );

  const highlightAsNotAnswered = examResult && !studentAnswer;

  return (
    <div
      className={clsx(
        "p-5 border rounded-2xl shadow-sm transition-all",
        highlightAsNotAnswered
          ? "bg-yellow-50 border-yellow-400"
          : "bg-white border-gray-300"
      )}
    >
      {highlightAsNotAnswered && (
        <p className="h-10 w-full rounded-lg border border-yellow-500 flex items-center justify-center font-bold text-yellow-700 bg-yellow-100 mb-3">
          سؤال لم تتم الإجابة عليه
        </p>
      )}

      {/* question title and text */}
      <div className="flex gap-3 mb-2">
        <p className="h-10 min-w-10 flex items-center justify-center bg-gray-700 text-white rounded-lg">
          {questionNumber}
        </p>
        <p className="min-h-10 flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg grow text-gray-800 font-medium">
          {question.text}
        </p>
      </div>

      {/* question images */}
      {question.images && question.images.length > 0 && (
        <div className="flex gap-2 flex-wrap py-3 pr-4 border-b border-gray-200 mb-3">
          {question.images.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt=""
              onClick={() => setFileDisplayed(image)}
              className="h-40 rounded-lg cursor-pointer hover:scale-105 transition-transform"
            />
          ))}
        </div>
      )}

      {/* answers */}
      <div className="space-y-2">
        {quesionAnswers.map((answer, i) => {
          const answerId = `question-${question.id}-answer-${i}`;

          const isCorrectAnswer = examResult && answer.isCorrect;

          const isSelectedWrongAnswer =
            examResult &&
            studentAnswer &&
            studentAnswer.answerId === answer.id &&
            !answer.isCorrect;

          const isSelectedByStudent =
            studentAnswer && studentAnswer.answerId === answer.id;

          return (
            <div
              key={i}
              className={clsx(
                "min-h-10 w-full flex gap-3 items-center border bg-gray-50 border-gray-300 p-3 rounded-lg transition-all",
                examResult ? "cursor-no-drop" : "cursor-pointer",
                isCorrectAnswer && "bg-green-100 border-green-400",
                isSelectedWrongAnswer && "bg-red-100 border-red-400"
              )}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                id={answerId}
                defaultChecked={!!isSelectedByStudent}
                onChange={() => handleSaveAnswer(answer, question.id)}
                disabled={examResult}
                className={clsx(
                  "h-5 w-5",
                  examResult ? "cursor-no-drop" : "cursor-pointer"
                )}
              />
              <label
                htmlFor={answerId}
                className={clsx(
                  "grow flex gap-3 items-center flex-wrap text-gray-800",
                  examResult ? "cursor-no-drop" : "cursor-pointer"
                )}
              >
                {answer.text}
              </label>
              {answer.image && (
                <img
                  src={answer.image}
                  alt=""
                  className="h-20 rounded-lg shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setFileDisplayed(answer.image);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
