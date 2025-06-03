import React, { useRef, useState } from "react";
import { useCurrentUser, useDarkMode } from "../store/useStore";
import {
  faSave,
  faTrash,
  faUpload,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInsertQuestionMutation } from "../QueriesAndMutations/mutationsHooks";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import AddNewAnswerForm from "./AddNewAnswerForm";
import clsx from "clsx";
import Loader from "./Loader";

const MAX_IMAGE_SIZE_MB = 3;

export default function AddQuestionForm({ examData, examId }) {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();
  const [questionText, setQuestionText] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [questionImages, setQuestionImages] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [addingNewQuestionLoading, setAddingNewQuestionLoading] =
    useState(false);

  const fileInputRef = useRef(null);

  const { data: questions } = useQuestionsByExamId(examId);

  const { mutate: addQuestionMutation } = useInsertQuestionMutation(
    setQuestionText,
    setAllAnswers,
    setCorrectIndex,
    setQuestionImages,
    setAddingNewQuestionLoading
  );

  const handleAddNewQuestion = async () => {
    if (!questionText) return alert("لا يمكن أن يكون السؤال فارغًا");
    if (allAnswers.length < 2) {
      return alert("يجب ان يكون السؤال مكون من إجابتين على الأقل");
    }
    if (correctIndex === null) {
      return alert("يجب إن تحتوى السؤال على إجابة صحيحة");
    }

    setAddingNewQuestionLoading(true);

    const updatedAnswers = allAnswers.map((ans, i) => ({
      ...ans,
      isCorrect: i === correctIndex,
    }));

    "examData", examData;

    addQuestionMutation({
      text: questionText,
      images: questionImages,
      answers: updatedAnswers,
      exam: examData,
      studentId: currentUser.id,
    });
  };

  return (
    <>
      <p
        className={clsx(
          "py-2 px-4 text-white text-center font-bold rounded-lg shadow-sm mt-7 rounded-b-none",
          isDarkMode
            ? "bg-gradient-to-r from-blue-400 to-blue-500"
            : "bg-gray-700"
        )}
      >
        اضافة سؤال
      </p>
      <div
        className={clsx(
          "border p-3 rounded-lg rounded-t-none relative overflow-hidden",
          isDarkMode ? "border-blue-500/50 bg-blue-500/5" : "border-gray-300"
        )}
      >
        {addingNewQuestionLoading && (
          <div
            className={clsx(
              "h-full w-full backdrop-blur-xs flex items-center justify-center absolute top-0 left-0 z-40",
              isDarkMode ? "bg-blue-500/10" : "bg-white/50"
            )}
          >
            <Loader message="جاري اضافة السؤال" />
          </div>
        )}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="quesName"
              className={clsx(
                "font-medium",
                isDarkMode ? "text-blue-500" : "text-gray-700"
              )}
            >
              السؤال:
            </label>
            <div className="flex gap-3 items-start">
              <h3 className="bg-gradient-to-r from-blue-500 to-blue-600 h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white shrink-0">
                {questions?.length > 0 ? questions.length + 1 : "1"}
              </h3>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false); // نوقف التأثير بعد الإفلات

                  const files = Array.from(e.dataTransfer.files);
                  const imageFiles = files.filter((file) => {
                    if (file.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
                      alert(`❌ الصورة "${file.name}" أكبر من 3MB ولن تُرفع`);
                      return false;
                    }
                    return file.type.startsWith("image/");
                  });

                  const newFiles = imageFiles.filter((file) => {
                    return !questionImages.some(
                      (img) =>
                        img instanceof File &&
                        img.size === file.size &&
                        img.type === file.type
                    );
                  });

                  if (newFiles.length > 0) {
                    setQuestionImages((prev) => [...prev, ...newFiles]);
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true); // فعل التأثير
                }}
                onDragLeave={() => {
                  setIsDraggingOver(false); // لما يخرج بدون ما يفلت
                }}
                className={clsx(
                  "relative w-full transition-colors",
                  isDraggingOver &&
                    "border-2 border-dashed border-blue-400 bg-blue-50"
                )}
              >
                <textarea
                  className={clsx(
                    "w-full field-sizing-content rounded-lg py-2 outline-none transition-all resize-none border  border-dashed px-3 grow min-h-10 max-h-32",
                    isDarkMode
                      ? "border-blue-500/50 focus:border-blue-500 text-white"
                      : "border-gray-400"
                  )}
                  id="quesName"
                  name="quesName"
                  type="text"
                  onChange={(e) => setQuestionText(e.target.value)}
                  onPaste={(e) => {
                    const items = e.clipboardData.items;
                    for (const item of items) {
                      if (item.type.startsWith("image/")) {
                        const file = item.getAsFile();
                        if (file) {
                          if (file.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
                            alert("❌ حجم الصورة كبير جدًا، الحد الأقصى 3MB");
                            return;
                          }

                          const isDuplicate = questionImages.some((img) => {
                            if (img instanceof File) {
                              return (
                                img.size === file.size && img.type === file.type
                              );
                            }
                            return false;
                          });

                          if (!isDuplicate) {
                            setQuestionImages((prev) => [...prev, file]);
                          } else {
                            ("❌ صورة مكررة، لم يتم إضافتها");
                          }
                        }
                      }
                    }
                  }}
                  value={questionText}
                  placeholder="اكتب السؤال هنا"
                ></textarea>
                {questionImages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {questionImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`questionImage-${index}`}
                          className="h-15 w-15 rounded-lg object-cover ل"
                        />
                        <button
                          onClick={() => {
                            const updatedImages = questionImages.filter(
                              (_, i) => i !== index
                            );
                            setQuestionImages(updatedImages);
                            if (
                              fileInputRef.current &&
                              updatedImages.length === 0
                            )
                              fileInputRef.current.value = "";
                          }}
                          className="h-5 w-5 text-xs border border-black bg-white text-black cursor-pointer rounded-md absolute left-1 top-1"
                        >
                          <FontAwesomeIcon icon={faX} size="sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <label
                  htmlFor="questionImage"
                  className="h-10 w-10 border border-dashed border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center rounded-lg cursor-pointer transition-colors"
                >
                  <FontAwesomeIcon icon={faUpload} />
                </label>
                <input
                  type="file"
                  name="questionImage"
                  id="questionImage"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);

                    const validFiles = files.filter((file) => {
                      if (file.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
                        alert(
                          `❌ الصورة "${file.name}" أكبر من ${MAX_IMAGE_SIZE_MB}MB ولن تُرفع`
                        );
                        return false;
                      }
                      return true;
                    });

                    setQuestionImages((prev) => {
                      const newFiles = validFiles.filter(
                        (file) =>
                          !prev.some(
                            (existing) =>
                              existing.name === file.name &&
                              existing.size === file.size &&
                              existing.type === file.type
                          )
                      );
                      return [...prev, ...newFiles];
                    });

                    "✅ الصور المختارة:", validFiles;
                  }}
                />
              </div>
            </div>
          </div>

          <p className="w-full pr-12 -mb-2">الاجابات</p>
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
    </>
  );
}
