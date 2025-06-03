import React, { useEffect } from "react";
import SendJoinRequest from "./SendJoinRequest";

export default function Join({ stages, teacher, student }) {
  const [selectedStage, setSelectedStage] = React.useState("");
  const [isJoin, setIsJoin] = React.useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center h-64">
        <p className="mt-4 text-lg font-medium text-red-600">
          ليس لديك صلاحية قراءة الاختبارات الخاصة بهذا المعلم
        </p>
        <button
          onClick={() => setIsJoin(true)}
          className="p-2 px-4 mt-5 cursor-pointer rounded-lg bg-gradient-to-tl from-blue-600 to-blue-500 text-white font-bold"
        >
          أرسل طلب انضمام
        </button>
      </div>
      {isJoin && (
        <SendJoinRequest
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
          stages={stages}
          teacher={teacher}
          studentId={student.id}
          setIsJoin={setIsJoin}
        />
      )}
    </>
  );
}
