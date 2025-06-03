import {
  faCheck,
  faMinus,
  faPlus,
  faUpload,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRef, useState } from "react";
import { useDarkMode } from "../store/useStore";

const MAX_IMAGE_SIZE_MB = 3;

export default function AddNewAnswerForm({
  allAnswers,
  setAllAnswers,
  correctIndex,
  setCorrectIndex,
  answer = null,
  isAdding = false,
  index = null,
}) {
  const { isDarkMode } = useDarkMode();
  const [newAns, setNewAns] = useState({ ans: "", image: null });
  const fileInputRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const currentImage = isAdding ? newAns.image : answer?.image || null;

  const handleImageAdd = (files) => {
    const file = files[0];
    if (!file) return;

    if (file.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
      alert(
        `❌ الصورة "${file.name}" أكبر من ${MAX_IMAGE_SIZE_MB}MB ولن تُرفع`
      );
      return;
    }
    if (!file.type.startsWith("image/")) return;

    if (isAdding) {
      setNewAns((prev) => ({ ...prev, image: file }));
    } else {
      setAllAnswers((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], image: file };
        return updated;
      });
    }
  };

  const handleAddNewAnswer = (e) => {
    e.preventDefault();
    if (!newAns.ans) return;

    const isDuplicate = allAnswers.some((ans) => ans.ans === newAns.ans);
    if (isDuplicate) return alert("هذه الإجابة موجودة بالفعل");

    setAllAnswers((prev) => {
      const updated = [...prev, newAns];
      if (correctIndex === "new") setCorrectIndex(updated.length - 1);
      return updated;
    });

    setNewAns({ ans: "", image: null });
  };

  return (
    <form
      onSubmit={handleAddNewAnswer}
      className={clsx(
        "w-full select-none pr-12 flex flex-col gap-2",
        isDraggingOver &&
          (isDarkMode
            ? "border-2 border-dashed border-blue-400 bg-blue-500/10 p-2 rounded-lg"
            : "border-2 border-dashed border-blue-400 bg-blue-50 p-2 rounded-lg")
      )}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const files = Array.from(e.dataTransfer.files);
        handleImageAdd(files);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
    >
      <div className="flex items-center gap-2 max-sm:flex-col">
        <div className="flex gap-2 grow max-sm:w-full">
          <input
            type="radio"
            name="correctAnswer"
            id={isAdding ? "newAnswer" : `answer-${index}`}
            checked={isAdding ? correctIndex === "new" : index === correctIndex}
            onChange={() => {
              if (isAdding) setCorrectIndex("new");
              else setCorrectIndex(index);
            }}
            className="h-4 w-4 hidden peer"
          />
          <label
            className={clsx(
              "checkbox w-10 h-10 rounded-lg cursor-pointer duration-200 border p-2 flex items-center justify-center peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-600",
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
                setNewAns((prev) => ({ ...prev, ans: e.target.value }));
              } else {
                setAllAnswers((prev) =>
                  prev.map((ans, i) =>
                    i === index ? { ...ans, ans: e.target.value } : ans
                  )
                );
              }
            }}
            onPaste={(e) => {
              const items = e.clipboardData.items;
              for (const item of items) {
                if (item.type.startsWith("image/")) {
                  const file = item.getAsFile();
                  if (file) handleImageAdd([file]);
                }
              }
            }}
            value={isAdding ? newAns.ans : answer?.ans || ""}
            className={clsx(
              "border resize-none field-sizing-content min-h-10 grow pt-2 px-2 rounded-lg outline-none peer-checked:border-green-600 peer-checked:bg-green-500/10",
              isDarkMode
                ? "peer-checked:text-green-500"
                : "peer-checked:text-green-700",
              isAdding
                ? " border-gray-400 bg-gray-500/10"
                : isDarkMode
                ? "border-red-400 bg-red-500/10 text-red-500"
                : "border-red-400 bg-red-500/10 text-red-600"
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
        </div>
        <div className="flex gap-2 justify-end max-sm:w-full">
          {currentImage && (
            <div className="flex justify-start grow sm:hidden">
              <div className="relative">
                <img
                  src={URL.createObjectURL(currentImage)}
                  alt="answer-image"
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isAdding) {
                      setNewAns((prev) => ({ ...prev, image: null }));
                    } else {
                      setAllAnswers((prev) => {
                        const updated = [...prev];
                        updated[index] = { ...updated[index], image: null };
                        return updated;
                      });
                    }
                  }}
                  className="h-5 w-5 text-xs border border-black bg-white text-black cursor-pointer rounded-md absolute left-1 top-1"
                >
                  <FontAwesomeIcon icon={faX} size="sm" />
                </button>
              </div>
            </div>
          )}
          {isAdding ? (
            <button className="w-10 h-10 block text-blue-500 rounded-lg border-blue-400 border bg-blue-500/20 cursor-pointer">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAllAnswers((prev) => prev.filter((_, i) => i !== index));
                if (correctIndex === index) setCorrectIndex(null);
                else if (correctIndex > index)
                  setCorrectIndex((prev) => prev - 1);
              }}
              className="w-10 h-10 block text-red-500 rounded-lg border-red-400 border bg-red-500/20 cursor-pointer"
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
          )}
          <label className="h-10 w-10 border border-dashed border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center rounded-lg cursor-pointer transition-colors">
            <FontAwesomeIcon icon={faUpload} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                handleImageAdd(files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {currentImage && (
        <div className="flex justify-start max-sm:hidden">
          <div className="relative">
            <img
              src={URL.createObjectURL(currentImage)}
              alt="answer-image"
              className="h-20 w-20 object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                if (isAdding) {
                  setNewAns((prev) => ({ ...prev, image: null }));
                } else {
                  setAllAnswers((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], image: null };
                    return updated;
                  });
                }
              }}
              className="h-5 w-5 text-xs border border-black bg-white text-black cursor-pointer rounded-md absolute left-1 top-1"
            >
              <FontAwesomeIcon icon={faX} size="sm" />
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
