import React from "react";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataPlaceHolder from "../components/NoDataPlaceHolder";
import Loader from "./Loader";
import DisplayFile from "../components/DisplayFile";
import QuestionDisplayedInCreateTest from "./QuestionDisplayedInCreateTest";
import clsx from "clsx";
import { useDarkMode } from "../store/useStore";

export default function DisplayAnswersInCreateExam({ examId }) {
  const [fileDisplayed, setFileDisplayed] = React.useState(null);
  const { isDarkMode } = useDarkMode();
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

  questions;

  return (
    <div className="space-y-6 mt-8">
      <h2
        className={clsx(
          "text-center text-2xl font-semibold pb-2 mb-4 flex gap-2 items-center justify-center",
          isDarkMode
            ? "text-white border-b-2 border-blue-400"
            : "text-gray-800 border-b-2 border-blue-500"
        )}
      >
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className={clsx(
            "ml-2",
            isDarkMode ? "text-blue-400" : "text-blue-500"
          )}
        />
        الأسئلة المضافة
      </h2>

      {/* display image when click on it */}
      {fileDisplayed && (
        <DisplayFile setFileDisplayed={setFileDisplayed} file={fileDisplayed} />
      )}

      {/* Display questions */}
      {[...questions].map((question, index) => {
        return (
          <QuestionDisplayedInCreateTest
            question={question}
            key={index}
            questionNumber={index + 1}
            setFileDisplayed={setFileDisplayed}
          />
        );
      })}
    </div>
  );
}
