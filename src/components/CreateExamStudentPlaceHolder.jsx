import React from "react";

export default function CreateExamStudentPlaceHolder() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
      <p className="text-2xl font-semibold text-gray-700">
        عذرًا، هذه الصفحة مخصصة للمعلمين فقط.
      </p>
      <p className="text-gray-500">
        إذا كنت طالبًا، يمكنك العودة إلى الصفحة الرئيسية أو التواصل مع معلمك
        لمزيد من المعلومات.
      </p>
    </div>
  );
}
