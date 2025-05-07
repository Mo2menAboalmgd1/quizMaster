import React, { useState } from "react";
import { useCurrentUser } from "../store/useStore";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInsertQuestionMutation } from "../QueriesAndMutations/mutationsHooks";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import AddNewAnswerForm from "./AddNewAnswerForm";

export default function AddQuestionForm({ examData, examId }) {
  const { currentUser } = useCurrentUser();
  const [questionText, setQuestionText] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null); // 🔥 أضفنا دي

  const { data: questions } = useQuestionsByExamId(examId);

  const { mutateAsync: addQuestionMutation } = useInsertQuestionMutation(
    examData,
    examId
  );

  const handleAddNewQuestion = async () => {
    if (!questionText) return alert("لا يمكن أن يكون السؤال فارغًا");
    if (allAnswers.length < 2) {
      return alert("يجب ان يكون السؤال مكون من إجابتين على الأقل");
    }
    if (correctIndex === null) {
      return alert("يجب إن تحتوى السؤال على إجابة صحيحة");
    }

    const updatedAnswers = allAnswers.map((ans, i) => ({
      ...ans,
      isCorrect: i === correctIndex,
    }));

    await addQuestionMutation({ questionText, allAnswers: updatedAnswers });
    setQuestionText("");
    setAllAnswers([]);
    setCorrectIndex(null);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-emerald-400 rounded-lg mt-5 shadow-md space-y-4 p-5">
      <p
        dir="rtl"
        className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center font-bold rounded-lg shadow-sm"
      >
        اختبار {examData.title} ({currentUser.subject})
      </p>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-2 w-full" dir="rtl">
          <label
            dir="rtl"
            htmlFor="quesName"
            className="font-medium text-gray-700"
          >
            السؤال:
          </label>
          <div className="flex gap-3 items-start">
            <h3 className="bg-gradient-to-r from-green-500 to-emerald-600 h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white">
              {questions?.length > 0 ? questions.length + 1 : "1"}
            </h3>
            <textarea
              className="w-full field-sizing-content font-bold text-emerald-600 rounded-lg pt-2 outline-none transition-all resize-none"
              id="quesName"
              name="quesName"
              type="text"
              onChange={(e) => setQuestionText(e.target.value)}
              value={questionText}
              placeholder="اكتب السؤال هنا"
            ></textarea>
          </div>
        </div>

        {allAnswers.map((ans, index) => (
          <AddNewAnswerForm
            key={index}
            answer={ans}
            index={index}
            allAnswers={allAnswers}
            setAllAnswers={setAllAnswers}
            correctIndex={correctIndex}
            setCorrectIndex={setCorrectIndex}
          />
        ))}

        <AddNewAnswerForm
          isAdding={true}
          allAnswers={allAnswers}
          setAllAnswers={setAllAnswers}
          correctIndex={correctIndex}
          setCorrectIndex={setCorrectIndex}
        />

        <div className="flex gap-3 w-full border-t border-gray-400 pt-4">
          <button
            onClick={handleAddNewQuestion}
            className="h-10 flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} /> إضافة السؤال
          </button>
          <button
            onClick={() => {
              setQuestionText("");
              setAllAnswers([]);
              setCorrectIndex(null);
            }}
            className="h-10 flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} /> حذف السؤال
          </button>
        </div>
      </div>
    </div>
  );
}
