import { faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";

export default function AddNewAnswerForm({
  allAnswers,
  setAllAnswers,
  correctIndex,
  setCorrectIndex,
  answer = null,
  isAdding = false,
  index = null,
}) {
  const [newAns, setNewAns] = useState({
    ans: "",
  });

  const handleAddNewAnswer = (e) => {
    e.preventDefault();
    if (!newAns.ans) return;

    const isThereAnotherAnsWithTheSameText = allAnswers.some(
      (ans) => ans.ans === newAns.ans
    );
    if (isThereAnotherAnsWithTheSameText) {
      return alert("هذه الإجابة موجودة بالفعل");
    }

    setAllAnswers((prev) => {
      const updated = [...prev, newAns];
      if (correctIndex === "new") {
        setCorrectIndex(updated.length - 1);
      }
      return updated;
    });

    setNewAns({
      ans: "",
    });
  };

  return (
    <form
      onSubmit={handleAddNewAnswer}
      className="w-full select-none pr-12 flex items-center gap-2"
      dir="rtl"
    >
      <input
        type="radio"
        name="correctAnswer"
        id={isAdding ? "newAnswer" : `answer-${index}`}
        checked={isAdding ? correctIndex === "new" : index === correctIndex}
        onChange={() => {
          if (isAdding) {
            setCorrectIndex("new");
          } else {
            setCorrectIndex(index);
          }
        }}
        className="h-4 w-4 hidden peer"
      />
      <label
        className={clsx(
          "checkbox w-10 h-10 rounded-lg cursor-pointer duration-200 border-2 p-2 flex items-center justify-center peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-600",
          isAdding
            ? "bg-gray-500/10 text-gray-700 border-gray-400"
            : "bg-red-500/10 text-red-700 border-red-400"
        )}
        htmlFor={isAdding ? "newAnswer" : `answer-${index}`}
      >
        <FontAwesomeIcon icon={faCheck} />
      </label>
      <textarea
        onChange={(e) => {
          if (isAdding) {
            setNewAns({
              ...newAns,
              ans: e.target.value,
            });
          } else {
            setAllAnswers((prev) =>
              prev.map((ans, i) => {
                if (i === index) {
                  return {
                    ...ans,
                    ans: e.target.value,
                  };
                }
                return ans;
              })
            );
          }
        }}
        value={isAdding ? newAns.ans : answer?.ans}
        className={clsx(
          "border-2 resize-none field-sizing-content min-h-10 grow py-1.5 px-2 rounded-lg outline-none peer-checked:border-green-600 peer-checked:bg-green-100 peer-checked:text-green-900 peer-checked:font-bold",
          isAdding
            ? " border-gray-400 bg-gray-500/10"
            : "border-red-400 bg-red-500/10"
        )}
        name="answerText"
        placeholder={
          isAdding
            ? allAnswers.length > 0
              ? `إجابة رقم ${allAnswers.length + 1}`
              : "إجابة رقم 1"
            : `إجابة رقم ${index + 1}`
        }
      ></textarea>
      {isAdding ? (
        <button className="w-10 h-10 block text-blue-500 rounded-lg border-blue-400 border-2 bg-blue-500/20 cursor-pointer">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setAllAnswers((prev) => prev.filter((_, i) => i !== index));
            if (correctIndex === index) {
              setCorrectIndex(null);
            } else if (correctIndex > index) {
              setCorrectIndex((prev) => prev - 1);
            }
          }}
          className="w-10 h-10 block text-red-500 rounded-lg border-red-400 border-2 bg-red-500/20 cursor-pointer"
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
      )}
    </form>
  );
}
