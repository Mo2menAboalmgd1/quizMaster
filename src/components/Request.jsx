import React from "react";
import { useUserDataByUserId } from "../QueriesAndMutations/QueryHooks";
import { useCurrentUser, useDarkMode } from "../store/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faCheck,
  faCheckCircle,
  // faX,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  useAcceptRequestMutation,
  useRemoveRequestMutation,
} from "../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";
import Loader from "./Loader";
import clsx from "clsx";

export default function Request({ requestId, stage }) {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();

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
      className={clsx(
        "p-3 flex justify-between items-center border border-b-4 rounded-xl max-sm:flex-col",
        isDarkMode ? "border-blue-500/30" : "border-gray-200"
      )}
    >
      <div className="flex items-center gap-3 grow w-full">
        <div className="relative">
          <img
            src={
              student.image ||
              "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"
            }
            alt="Student img"
            className="w-15 h-15 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-xl">{student.name}</h3>
          <div className="flex items-center text-gray-600">
            <span className="text-blue-500">{stage.name}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 w-full max-sm:mt-3">
        <button
          onClick={() => handleAcceptRequest(student.id)}
          className="py-2 px-4 rounded-lg bg-blue-500 text-white flex gap-2 items-center cursor-pointer hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
          <span>قبول</span>
        </button>
        <button
          onClick={() => handleRejectRequest(student.id)}
          className={clsx(
            "py-2 px-4 rounded-lg flex gap-2 items-center cursor-pointer",
            isDarkMode
              ? "bg-gray-200/30 hover:bg-gray-200/20"
              : "bg-gray-200 hover:bg-gray-300"
          )}
        >
          <FontAwesomeIcon icon={faXmarkCircle} className="text-sm" />
          <span>رفض</span>
        </button>
      </div>
    </div>
  );
}
