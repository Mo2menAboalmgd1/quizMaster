import clsx from "clsx";
import React from "react";
import { useAnswersByQuestionId } from "../QueriesAndMutations/QueryHooks";
import Loader from "./Loader";
import ErrorPlaceHolder from "./ErrorPlaceHolder";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export default function QuestionDisplayedInCreateTest({
  question,
  questionNumber,
  setFileDisplayed,
}) {
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
    <div dir="rtl" className="space-y-3 border border-gray-300 rounded-2xl p-3">
      {/* question text and images */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <p className="rounded-lg bg-gray-800 font-bold text-white flex items-center justify-center h-10 min-w-10">
            {questionNumber}
          </p>
          {question.text && (
            <p className="w-full flex items-center rounded-lg bg-blue-100 px-3">
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
                  "flex gap-3 items-center p-2 border border-gray-300 rounded-lg",
                  isCorrect && "bg-green-100"
                )}
              >
                <p
                  className={clsx(
                    "min-h-10 min-w-10 flex items-center justify-center bg-gray-200 rounded-md border",
                    isCorrect
                      ? "bg-green-500 text-white border-green-500"
                      : "border-gray-300"
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
