import React from "react";
import {
  useJoinTeacherMutation,
  useJoinTeacherWithJoinCodeMutation,
} from "../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function SendJoinRequest({
  selectedStage,
  setSelectedStage,
  stages,
  teacher,
  studentId,
  setIsJoin,
}) {
  const [hasJoinCode, setHasJoinCode] = React.useState(false);
  const [joinCode, setJoinCode] = React.useState("");

  const { mutateAsync: joinTeacher } = useJoinTeacherMutation(setIsJoin);
  const { mutateAsync: joinTeacherWithJoinCode } =
    useJoinTeacherWithJoinCodeMutation(setIsJoin);
  const handleJoin = async () => {
    if (!selectedStage) {
      toast.error("يجب اختيار المرحلة الدراسية");
      return;
    }

    if (hasJoinCode) {
      await joinTeacherWithJoinCode({
        value: joinCode,
        teacher,
        stage: selectedStage,
        studentId,
      });
      return;
    } else {
      toast.loading("جاري إرسال طلب انضمامك إلى المعلم");
      await joinTeacher({
        teacherId: teacher.id,
        stageId: selectedStage.id,
        studentId,
      });
    }
  };
  return (
    <div
      onClick={() => {
        setIsJoin(false);
      }}
      className="fixed left-1/2 top-1/2 -translate-1/2 h-screen w-screen bg-black/30 z-20 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-gray-300 rounded-xl border bg-white p-3 py-6 flex flex-col gap-2"
      >
        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-l from-green-400 to-emerald-600 text-2xl w-96">
          {hasJoinCode ? "انضمام مباشر" : "طلب انضمام"}
        </h3>
        <div dir="rtl" className="flex flex-col items-start mt-5 w-full">
          <p>اختر المرحلة الدراسية:</p>
          <select
            className="h-10 w-full mt-2 px-3 outline-none border border-gray-300 rounded-lg"
            name="stage"
            id="stage"
            onChange={(e) => {
              const selected = stages.find(
                (stage) => stage.id === e.target.value
              );
              setSelectedStage(selected); // ✅ كده بتخزن object مش string
            }}
          >
            {stages?.map((stage, index) => (
              <option key={index} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>
        <div dir="rtl" className="flex gap-2 w-full">
          <button
            onClick={() => setHasJoinCode(true)}
            className={clsx(
              "h-10 px-4 rounded-lg border border-indigo-500 cursor-pointer",
              hasJoinCode && "bg-indigo-500 text-white"
            )}
          >
            أمتلك رمز انضمام مباشر
          </button>
          <button
            onClick={() => setHasJoinCode(false)}
            className={clsx(
              "h-10 px-4 rounded-lg border border-indigo-500 cursor-pointer",
              !hasJoinCode && "bg-indigo-500 text-white"
            )}
          >
            لا أمتلك رمز انضمام
          </button>
        </div>
        {hasJoinCode && (
          <div dir="rtl" className="w-full flex flex-col items-start gap-2">
            <p>أدخل رمز الانضمام:</p>
            <input
              type="text"
              name="joinCode"
              placeholder="x4FF23E"
              className="h-10 w-full rounded-lg border border-gray-400 border-dashed outline-none px-3 focus:border-blue-500"
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </div>
        )}
        <button
          onClick={handleJoin}
          className="px-3 py-2 mt-3 bg-gradient-to-l from-blue-400 to-blue-600 text-white rounded-lg cursor-pointer"
        >
          انضمام
        </button>
      </div>
    </div>
  );
}
