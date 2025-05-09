import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useJoinTeacherMutation } from "../QueriesAndMutations/mutationsHooks";
import { useCurrentUser } from "../store/useStore";

export default function Join({ stages, teacherId, studentsAndRequests }) {
  const [isJoin, setIsJoin] = React.useState(false);
  const [selectedStage, setSelectedStage] = React.useState("");
  const { currentUser } = useCurrentUser();
  console.log(selectedStage);

  const { mutateAsync: joinTeacher } = useJoinTeacherMutation(
    teacherId,
    setIsJoin
  );

  useEffect(() => {
    if (selectedStage === "") {
      setSelectedStage(stages[0]);
    }
  }, [stages, selectedStage]);

  const handleJoinRequest = async () => {
    const requestData = [
      ...(studentsAndRequests.requests || []),
      {
        studentId: currentUser.id,
        stage: selectedStage,
      },
    ];
    console.log(requestData);
    toast.loading("جاري إرسال طلب انضمامك إلى المعلم");
    await joinTeacher({ teacherId, requestData });
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
            className="border-gray-300 rounded-xl border bg-white p-3 py-6"
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
            <button
              onClick={handleJoinRequest}
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
