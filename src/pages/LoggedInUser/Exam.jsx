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
import {
  useSaveAnswer,
  useSaveStudentResult,
} from "../../QueriesAndMutations/mutationsHooks";
import clsx from "clsx";
import DisplayFile from "../../components/DisplayFile";

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

  const {
    data: answers,
    isLoading: isAnswersLoading,
    error: answersError,
  } = useAnswersByStudentIdAndExamId(currentUser.id, examId);

  const {
    data: examResult,
    isLoading: isExamResultLoading,
    error: examResultError,
  } = useExamsResultsByStudentIdAndExamId(currentUser.id, examId);

  const { mutate: saveAnswer } = useSaveAnswer();

  const handleSaveAnswer = (answer, questionId, correct) => {
    saveAnswer({
      selectedAns: answer,
      studentId: currentUser.id,
      questionId,
      examId,
      correct,
      isCorrect: answer.text === correct.text && answer.image === correct.image,
    });
  };

  const { mutate: sendResult } = useSaveStudentResult();

  const handleSendResult = () => {
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let notAnswered = 0;

    questions.forEach((question) => {
      const answer = answers.find(
        (answer) => answer.questionId === question.id
      );
      if (answer) {
        if (answer.isCorrect) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
      } else {
        notAnswered++;
      }
    });

    sendResult({
      studentId: currentUser.id,
      teacherId: examData.teacherId,
      examId,
      total: questions.length,
      correct: correctAnswers,
      wrong: wrongAnswers,
      notAnswered,
    });
  };

  if (currentUser.type === "teacher") {
    return <div>this page is not fou you</div>;
  }

  if (
    isExamDataLoading ||
    !currentUser ||
    isQuestionsLoading ||
    isAnswersLoading ||
    isExamResultLoading
  ) {
    return <Loader message="جاري تحميل الامتحان" />;
  }

  if (examDataError || questionsError || answersError || examResultError) {
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
      {examResult && (
        <p className="text-center text-sm text-red-600 font-medium">
          هذا الامتحان تم تقديمه مسبقًا
        </p>
      )}

      {/* questions iteration */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const isQuestionSolved = answers.some(
            (answer) => answer.questionId === question.id
          );
          const highlightAsNotAnswered = examResult && !isQuestionSolved;

          return (
            <div
              key={index}
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
                  {index + 1}
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
                {question.answers.map((answer, i) => {
                  const answerId = `question-${question.id}-answer-${i}`;
                  const studentAnswer = answers.find(
                    (ans) => ans.questionId === question.id
                  );

                  const isCorrectAnswer =
                    examResult &&
                    answer.text === question.correct.text &&
                    answer.image === question.correct.image;

                  const isAnswerWrong =
                    examResult &&
                    studentAnswer &&
                    studentAnswer.selectedAns.text === answer.text &&
                    studentAnswer.selectedAns.image === answer.image &&
                    !studentAnswer.isCorrect;

                  return (
                    <div
                      key={i}
                      className={clsx(
                        "min-h-10 w-full flex gap-3 items-center border bg-gray-50 border-gray-300 p-3 rounded-lg transition-all",
                        examResult ? "cursor-no-drop" : "cursor-pointer",
                        isCorrectAnswer && "bg-green-100 border-green-400",
                        isAnswerWrong && "bg-red-100 border-red-400"
                      )}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        id={answerId}
                        checked={
                          studentAnswer &&
                          studentAnswer.selectedAns.text === answer.text &&
                          studentAnswer.selectedAns.image === answer.image
                        }
                        onChange={() =>
                          !examResult &&
                          handleSaveAnswer(
                            answer,
                            question.id,
                            question.correct
                          )
                        }
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
                          examResult ? "cursor-no-drop" : "cursor-pointer",
                          isCorrectAnswer && "bg-green-100 border-green-400"
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
        })}
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
