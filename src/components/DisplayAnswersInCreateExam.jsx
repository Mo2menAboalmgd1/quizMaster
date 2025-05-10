import React, { useState } from "react";
import clsx from "clsx";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import {
  faCheck,
  faEdit,
  faQuestionCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataPlaceHolder from "../components/NoDataPlaceHolder";
import {
  useDeleteQuestionMutation,
  useEditExistingQuestionMutation,
} from "../QueriesAndMutations/mutationsHooks";
import Loader from "./Loader";

export default function DisplayAnswersInCreateExam({ examId }) {
  const [isEditAnswer, setIsEditAnswer] = useState(null);
  const [editedCorrectAnswers, setEditedCorrectAnswers] = useState({});
  const [editedQuestion, setEditedQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  console.log("editedCorrectAnswers :", editedCorrectAnswers);
  console.log("editedQeustion: ", editedQuestion);
  console.log("editedAnswers", answers);

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestionsByExamId(examId);

  const { mutateAsync: editQuestionMutation } =
    useEditExistingQuestionMutation(examId);
  const { mutateAsync: deleteQuestionMutation } =
    useDeleteQuestionMutation(examId);

  if (isQuestionsLoading) return <Loader message="جاري تحميل الأسألة" />;

  if (questionsError) return <div>{questionsError.message}</div>;

  if (questions.length === 0)
    return (
      <NoDataPlaceHolder
        message={"لا يوجد اسألة بعد"}
        icon={faQuestionCircle}
      />
    );

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-center text-2xl font-semibold text-gray-800 border-b-2 border-green-400 pb-2 mb-6 flex gap-2 items-center justify-center">
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="ml-2 text-green-500"
        />
        الأسئلة المضافة
      </h2>

      {questions.map((question, index) => {
        const isEditThisQuestion = isEditAnswer === question.id;
        const selectedAnswer =
          editedCorrectAnswers[question.id] ?? question.correct;

        return (
          <div
            key={index}
            className="border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md"
            dir="rtl"
          >
            <div className="flex gap-3 w-full items-start mb-4">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg text-lg font-bold flex items-center justify-center shadow-sm min-w-10">
                {index + 1}
              </div>
              {isEditThisQuestion ? (
                <textarea
                  className="p-4 bg-white border border-dashed border-gray-300 min-h-24 max-h-36 field-sizing-content resize-none grow font-medium"
                  name="editAddedQuestion"
                  placeholder="enter edited question"
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  autoFocus
                ></textarea>
              ) : (
                <div className="p-4 bg-white border border-gray-200 rounded-lg grow font-medium shadow-sm">
                  {question.text}
                </div>
              )}
              <div className="space-x-2">
                {isEditThisQuestion && (
                  <button
                    onClick={() => deleteQuestionMutation(question.id)}
                    className={clsx(
                      "h-10 w-10 rounded-sm text-white cursor-pointer bg-red-600"
                    )}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (isEditAnswer === question.id) {
                      await editQuestionMutation({
                        editedQuestion,
                        editedAnswers: answers,
                        questionId: question.id,
                      });
                      setIsEditAnswer(null);
                      setAnswers([]);
                      setIsEditAnswer(null);
                    } else {
                      setEditedQuestion(question.text);
                      setAnswers(
                        question.answers.map((answer, idx) => {
                          return {
                            id: `${question.id}-${idx}`,
                            text: answer,
                            isCorrect: answer === question.correct,
                          };
                        })
                      );
                      setIsEditAnswer(question.id);
                    }
                  }}
                  className={clsx(
                    "h-10 w-10 rounded-sm text-white cursor-pointer",
                    isEditThisQuestion ? "bg-green-500" : "bg-blue-500"
                  )}
                >
                  <FontAwesomeIcon
                    icon={isEditThisQuestion ? faCheck : faEdit}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-3 mt-4 pr-12">
              {question.answers.map((answer, idx) => (
                <div key={idx}>
                  {isEditThisQuestion ? (
                    <div
                      className={clsx(
                        "flex items-center gap-2 p-3 border rounded-lg transition-all",
                        selectedAnswer === answer
                          ? "border-green-500 bg-green-50 font-semibold shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        id={`${question.id}-${idx}`}
                        className="h-8 w-8"
                        checked={selectedAnswer === answer}
                        onChange={() => {
                          setEditedCorrectAnswers((prev) => ({
                            ...prev,
                            [question.id]: answer,
                          }));
                          setAnswers((prev) => {
                            return prev.map((ans) => {
                              if (ans.text === answer) {
                                ans.isCorrect = true;
                              } else {
                                ans.isCorrect = false;
                              }
                              return ans;
                            });
                          });
                        }}
                      />
                      <textarea
                        value={
                          answers.find(
                            (ans) => ans.id === `${question.id}-${idx}`
                          )?.text || ""
                        }
                        className="w-full min-h-10 max-h-24 field-sizing-content resize-none p-2 border border-dashed border-gray-300"
                        onChange={(e) => {
                          const newText = e.target.value;
                          setAnswers((prev) =>
                            prev.map((ans) => {
                              if (ans.id === `${question.id}-${idx}`) {
                                return { ...ans, text: newText };
                              }
                              return ans;
                            })
                          );
                        }}
                      ></textarea>
                    </div>
                  ) : (
                    <div
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
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
