import React from "react";
import clsx from "clsx";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import { faCheck, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DisplayAnswersInCreateExam({ examId }) {
  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestionsByExamId(examId);

  if (isQuestionsLoading) return <div>Loading...</div>;

  if (questionsError) return <div>{questionsError.message}</div>;

  if (questions.length === 0) return <div>still now questions</div>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-center text-2xl font-semibold text-gray-800 border-b-2 border-green-400 pb-2 mb-6 flex gap-2 items-center justify-center">
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="ml-2 text-green-500"
        />
        الأسئلة المضافة
      </h2>

      {questions.length === 0 ? (
        <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          لا توجد أسئلة مضافة بعد
        </div>
      ) : (
        questions.map((question, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md"
            dir="rtl"
          >
            <div className="flex gap-3 w-full items-start mb-4">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg text-lg font-bold flex items-center justify-center shadow-sm min-w-10">
                {index + 1}
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg grow font-medium shadow-sm">
                {question.text}
              </div>
            </div>

            <div className="space-y-3 mt-4 pr-12">
              {question.answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "flex items-center gap-2 p-3 border rounded-lg transition-all",
                    question.correct === answer
                      ? "border-green-500 bg-green-50 font-semibold shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div
                    className={clsx(
                      "w-6 h-6 flex items-center justify-center rounded-full mr-2",
                      question.correct === answer
                        ? "bg-green-500 text-white shrink-0"
                        : "bg-gray-200 text-gray-600 shrink-0"
                    )}
                  >
                    {question.correct === answer ? (
                      <FontAwesomeIcon icon={faCheck} className="text-xs" />
                    ) : (
                      <span className="text-xs">{idx + 1}</span>
                    )}
                  </div>
                  {answer}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
