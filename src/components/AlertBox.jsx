import React from "react";

/*
funtionToExcute={() =>
  handleDeleteExam(exam.id, exam.title, exam.stage)
}
title={"حذف"}
type={"red"}
message={"هذه الخطوة لا يمكن التراجع عنها"}
firstOptionText={"حذف"}
firstOptionDescription={
  "سيتم حذف هذا الاختبار مع الحفاظ على النتائج"
}
setOpen={setIsDelete}
isAnotherOption={true}
anotherOptionText={"الحذف نهائياَ"}
anotherOptionDescription={
  "سيؤدي هذا الاختيار لحذف الاختبار وجميع النتائج المتعلقة به"
}
*/

export default function AlertBox({
  title,
  type,
  message,
  firstOptionText,
  firstOptionDescription,
  firstOptionFunction,
  isSecondOption,
  secondOptionText,
  secondOptionDescription,
  secondOptionFunction,
  setOpen,
}) {
  const titleColor =
    type === "red"
      ? "text-red-500"
      : type === "green"
      ? "text-green-500"
      : type === "blue"
      ? "text-blue-500"
      : type === "yellow"
      ? "text-yellow-500"
      : "text-gray-700";

  const buttonsColor =
    type === "red"
      ? "bg-red-500 hover:bg-red-700"
      : type === "green"
      ? "bg-green-500 hover:bg-green-700"
      : type === "blue"
      ? "bg-blue-500 hover:bg-blue-700"
      : type === "yellow"
      ? "bg-yellow-500 hover:bg-yellow-700"
      : "bg-gray-500 hover:bg-gray-700";
  return (
    <div
      className="h-screen w-screen bg-black/40 fixed inset-0 z-30"
      onClick={() => setOpen(false)}
    >
      <div
        className="fixed inset-0 flex justify-center items-center z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className={`text-xl font-semibold mb-2 ${titleColor}`}>
            {title}
          </h2>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end gap-3">
            {isSecondOption && (
              <button
                onClick={secondOptionFunction}
                title={secondOptionDescription}
                className={`${buttonsColor} text-white font-bold py-2 px-4 rounded cursor-pointer`}
              >
                {secondOptionText}
              </button>
            )}
            <button
              title={firstOptionDescription}
              onClick={firstOptionFunction}
              className={`${buttonsColor} text-white font-bold py-2 px-4 rounded cursor-pointer`}
            >
              {firstOptionText}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
            >
              الغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
