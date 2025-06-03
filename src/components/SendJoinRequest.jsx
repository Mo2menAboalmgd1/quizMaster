import React from "react";
import {
  useJoinTeacherMutation,
  useJoinTeacherWithJoinCodeMutation,
} from "../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";
import clsx from "clsx";
import { publicStage, useDarkMode } from "../store/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

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
  const { isDarkMode } = useDarkMode();

  const { mutateAsync: joinTeacher } = useJoinTeacherMutation(setIsJoin);
  const { mutateAsync: joinTeacherWithJoinCode } =
    useJoinTeacherWithJoinCodeMutation(setIsJoin);
  const handleJoin = async () => {
    if (!selectedStage) {
      toast.error("يجب اختيار المرحلة الدراسية");
      return;
    }

    if (hasJoinCode) {
      console.log({
        value: joinCode,
        teacher,
        stage: selectedStage,
        studentId,
      });
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
      className="fixed left-1/2 top-1/2 -translate-1/2 h-screen w-screen bg-black/30 backdrop-blur-md z-20 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "rounded-xl border p-3 py-4 flex flex-col gap-2",
          isDarkMode
            ? "border-blue-500/50 bg-blue-500/10"
            : "border-gray-300 bg-white"
        )}
      >
        <h3 className="font-bold text-blue-500 text-2xl w-96 text-center">
          {hasJoinCode ? "انضمام مباشر" : "طلب انضمام"}
        </h3>

        <div className="flex flex-col items-start mt-2 w-full">
          <p className="mb-2">اختر المرحلة الدراسية:</p>
          <div className="relative w-full">
            <span className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <FontAwesomeIcon icon={faAngleDown} />
            </span>
            <select
              className={clsx(
                "h-10 w-full px-3 outline-none border rounded-lg appearance-none",
                isDarkMode
                  ? "border-blue-500/50 bg-slate-900 focus:border-blue-500"
                  : "border-gray-300"
              )}
              name="stage"
              id="stage"
              value={selectedStage?.id || ""} // ✅ اضافة value property
              onChange={(e) => {
                const selected = stages.find(
                  (stage) => stage.id === e.target.value
                );
                setSelectedStage(selected);
              }}
            >
              <option value="" disabled>
                اختر المرحلة الدراسية
              </option>{" "}
              {/* ✅ اضافة placeholder option */}
              {stages?.map((stage, index) => {
                if (stage.id === publicStage) return null;
                return (
                  <option key={index} value={stage.id}>
                    {stage.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="flex gap-2 w-full mt-2">
          <button
            onClick={() => setHasJoinCode(true)}
            className={clsx(
              "h-10 px-4 rounded-lg border border-blue-500 cursor-pointer",
              hasJoinCode && "bg-blue-500/30 text-blue-400"
            )}
          >
            أمتلك رمز انضمام مباشر
          </button>
          <button
            onClick={() => setHasJoinCode(false)}
            className={clsx(
              "h-10 px-4 rounded-lg border border-blue-500 cursor-pointer",
              !hasJoinCode &&
                (isDarkMode
                  ? "bg-blue-500/30 text-blue-400"
                  : "bg-blue-500/30 text-blue-600")
            )}
          >
            لا أمتلك رمز انضمام
          </button>
        </div>
        {hasJoinCode && (
          <div className="w-full flex flex-col items-start gap-2">
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
