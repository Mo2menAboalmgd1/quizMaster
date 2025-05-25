import React from "react";
import { useUserDataByUserId } from "../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../store/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import {
  useAcceptRequestMutation,
  useRemoveRequestMutation,
} from "../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";
import Loader from "./Loader";

export default function Request({ requestId, stage }) {
  const { currentUser } = useCurrentUser();

  const {
    data: student,
    isLoading: isStudentLoading,
    error: studentError,
  } = useUserDataByUserId(requestId, "students");

  const { mutateAsync: rejectRequest } = useRemoveRequestMutation();
  const handleRejectRequest = async (studentId) => {
    await rejectRequest({
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      studentId,
    });
  };

  // studentId, column, table, teacherId
  const { mutateAsync: acceptRequest } = useAcceptRequestMutation();
  const handleAcceptRequest = async (studentId) => {
    await acceptRequest({
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      stageId: stage.id,
      studentId,
    });
  };

  if (isStudentLoading) return <Loader message="جاري تحميل طلبات الانضمام" />;
  if (studentError) {
    toast.error(studentError.message);
    return;
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
      dir="rtl"
    >
      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                student.image ||
                "https://cdn-icons-png.freepik.com/512/8801/8801434.png"
              }
              alt="Student img"
              className="w-16 h-16 rounded-full object-cover border-2 border-green-400 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-green-600">
              {student.name}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
              <span className="font-bold">المرحلة المعنية:</span>
              <span className="mr-1 bg-gray-100 px-2 py-0.5 rounded-full text-sm">
                {stage.name}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3 w-full">
          <button
            onClick={() => handleAcceptRequest(student.id)}
            className="p-2 px-6 flex gap-2 items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faCheck} className="text-sm" />
            <span>قبول</span>
          </button>
          <button
            onClick={() => handleRejectRequest(student.id)}
            className="p-2 px-6 flex gap-2 items-center justify-center bg-gradient-to-r from-red-500 to-rose-600 rounded-lg text-white cursor-pointer hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faX} className="text-sm" />
            <span>رفض</span>
          </button>
        </div>
      </div>
    </div>
  );
}
