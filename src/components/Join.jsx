import React, { useEffect } from "react";
import toast from "react-hot-toast";
import {
  useJoinTeacherMutation,
  useJoinTeacherWithJoinCodeMutation,
} from "../QueriesAndMutations/mutationsHooks";
import { useCurrentUser } from "../store/useStore";
import clsx from "clsx";

export default function Join({ stages, teacherId }) {
  const [isJoin, setIsJoin] = React.useState(false);
  const [selectedStage, setSelectedStage] = React.useState("");
  const [joinCode, setJoinCode] = React.useState("");
  const [hasJoinCode, setHasJoinCode] = React.useState(false);
  const { currentUser } = useCurrentUser();
  console.log(selectedStage);

  const { mutateAsync: joinTeacher } = useJoinTeacherMutation(setIsJoin);
  const { mutateAsync: joinTeacherWithJoinCode } =
    useJoinTeacherWithJoinCodeMutation(setIsJoin);

  useEffect(() => {
    if (selectedStage === "") {
      setSelectedStage(stages[0]);
    }
  }, [stages, selectedStage]);

  const handleJoin = async () => {
    if (hasJoinCode) {
      await joinTeacherWithJoinCode({
        value: joinCode,
        teacherId,
        stage: selectedStage,
        studentId: currentUser?.id,
      });
      return;
    } else {
      toast.loading("جاري إرسال طلب انضمامك إلى المعلم");
      await joinTeacher({
        teacherId,
        stage: selectedStage,
        studentId: currentUser?.id,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="mt-4 text-lg font-medium text-red-600">
        ليس لديك صلاحية قراءة الامتحانات الخاصة بهذا المعلم
      </p>
      <button
        onClick={() => setIsJoin(!isJoin)}
        className="p-2 px-4 mt-5 cursor-pointer rounded-lg bg-gradient-to-tl from-blue-600 to-blue-500 text-white font-bold"
      >
        أرسل طلب انضمام
      </button>
      {isJoin && (
        <div
          onClick={() => setIsJoin(false)}
          className="fixed left-1/2 top-1/2 -translate-1/2 h-screen w-screen bg-black/30 z-20 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border-gray-300 rounded-xl border bg-white p-3 py-6 flex flex-col gap-2"
          >
            <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-l from-green-400 to-emerald-600 text-2xl w-96">
              طلب انضمام
            </h3>
            <div dir="rtl" className="flex flex-col items-start mt-5 w-full">
              <p>اختر المرحلة الدراسية:</p>
              <select
                className="h-10 w-full mt-2 px-3 outline-none border border-gray-300 rounded-lg"
                name="stage"
                id="stage"
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                {stages?.map((stage, index) => (
                  <option key={index} value={stage}>
                    {stage}
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
      )}
    </div>
  );
}
