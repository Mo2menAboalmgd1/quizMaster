import React from "react";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataPlaceHolder from "../components/NoDataPlaceHolder";
import Loader from "./Loader";
import clsx from "clsx";
import DisplayFile from "../components/DisplayFile";

export default function DisplayAnswersInCreateExam({ examId }) {
  const [fileDisplayed, setFileDisplayed] = React.useState(null);
  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestionsByExamId(examId);

  if (isQuestionsLoading) return <Loader message="جاري تحميل الأسألة" />;

  if (questionsError) return <div>{questionsError.message}</div>;

  if (questions.length === 0)
    return (
      <NoDataPlaceHolder
        message={"لا يوجد اسألة بعد"}
        icon={faQuestionCircle}
      />
    );

  console.log(questions);

  return (
    <div className="space-y-6 pt-3">
      <h2 className="text-center text-2xl font-semibold text-gray-800 border-b-2 border-green-400 pb-2 mb-6 flex gap-2 items-center justify-center">
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="ml-2 text-green-500"
        />
        الأسئلة المضافة
      </h2>

      {/* display image when click on it */}
      {fileDisplayed && (
        <DisplayFile
          setFileDisplayed={setFileDisplayed}
          file={fileDisplayed}
        />
      )}

      {/* Display questions */}
      {[...questions].reverse().map((question, index) => {
        return (
          <div
            key={index}
            dir="rtl"
            className="space-y-3 border border-gray-300 rounded-2xl p-3"
          >

            {/* question text and images */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <p className="rounded-lg bg-gray-800 font-bold text-white flex items-center justify-center h-10 min-w-10">
                  {questions.length - index}
                </p>
                {question.text && (
                  <p className="w-full flex items-center rounded-lg bg-blue-100 px-3">
                    {question.text}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pr-13">
                {question.images &&
                  question.images.map((image, index) => {
                    return (
                      <img
                        onClick={() => setFileDisplayed(image)}
                        key={index}
                        className="h-32 w-fit object-contain rounded-lg cursor-pointer"
                        src={image}
                        alt=""
                      />
                    );
                  })}
              </div>
            </div>

            {/* display answers */}
            <div className="space-y-2">
              {question.answers.map((answer, index) => {
                const isCorrect =
                  answer?.text === question?.correct?.text &&
                  answer?.image === question?.correct?.image;
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
      })}
    </div>
  );
}
