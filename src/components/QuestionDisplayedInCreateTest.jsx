import clsx from "clsx";
import React from "react";
import { useAnswersByQuestionId } from "../QueriesAndMutations/QueryHooks";
import Loader from "./Loader";
import ErrorPlaceHolder from "./ErrorPlaceHolder";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useDarkMode } from "../store/useStore";

export default function QuestionDisplayedInCreateTest({
  question,
  questionNumber,
  setFileDisplayed,
}) {
  const { isDarkMode } = useDarkMode();
  const {
    data: questionAnswers,
    isLoading: isQuestionAnswersLoading,
    error: questionAnswersError,
  } = useAnswersByQuestionId(question?.id, true);

  if (isQuestionAnswersLoading) {
    return <Loader message="جاري تحميل الاجابات" />;
  }

  if (questionAnswersError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ اثناء جلب الاجابات، اعد المحاولة"} />
    );
  }

  return (
    <div
      className={clsx(
        "space-y-3 border rounded-lg p-3",
        isDarkMode ? "border-blue-500/50 bg-slate-800/10" : "border-gray-300"
      )}
    >
      {/* question text and images */}
      <div>
        <div className="flex gap-3 mb-1">
          <p
            className={clsx(
              "rounded-lg font-bold text-white flex items-center justify-center h-10 min-w-10",
              isDarkMode ? "bg-blue-500" : "bg-slate-700"
            )}
          >
            {questionNumber}
          </p>
          {question.text && (
            <p
              className={clsx(
                "w-full flex items-center rounded-lg px-3",
                isDarkMode
                  ? "bg-blue-500/10 border border-blue-500/50"
                  : "bg-blue-100"
              )}
            >
              {question.text}
            </p>
          )}
        </div>
        <div className="flex gap-3 pr-13 flex-wrap">
          {question.images &&
            question.images.map((image, index) => {
              return (
                <img
                  onClick={() => setFileDisplayed(image)}
                  key={index}
                  className="h-32 object-cover rounded-lg cursor-pointer grow max-w-40"
                  src={image}
                  alt=""
                />
              );
            })}
        </div>
      </div>

      {/* display answers */}
      <div className="space-y-2">
        {questionAnswers.length === 0 && (
          <NoDataPlaceHolder
            message="لا يوجد اجابات لهذه السؤال"
            icon={faComment}
          />
        )}
        {questionAnswers &&
          questionAnswers.length > 0 &&
          questionAnswers.map((answer, index) => {
            const isCorrect = answer.isCorrect;
            return (
              // each answer
              <div
                key={index}
                className={clsx(
                  "flex gap-3 items-center p-1.5 border rounded-lg",
                  isCorrect
                    ? isDarkMode
                      ? "bg-green-500/10 border-green-500/50"
                      : "bg-green-100 border-green-300"
                    : isDarkMode
                    ? "border-slate-800"
                    : "border-gray-300"
                )}
              >
                <p
                  className={clsx(
                    "min-h-9 min-w-9 flex items-center justify-center rounded-md ",
                    isCorrect
                      ? "bg-green-500 text-white"
                      : isDarkMode
                      ? "border border-slate-800 bg-slate-800/20"
                      : "border border-gray-300 bg-gray-300/40"
                  )}
                >
                  {index + 1}
                </p>
                {answer.text && <p>{answer.text}</p>}
                {answer.image && (
                  <img
                    onClick={() => setFileDisplayed(answer.image)}
                    className="h-15 w-fit object-contain rounded-lg cursor-pointer"
                    src={answer.image}
                    alt=""
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
