import React from "react";
import { useCurrentUser } from "../../store/useStore";
import { useStudentsAndRequestsByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import Request from "../../components/Request";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function Requests() {
  const { currentUser } = useCurrentUser();

  const {
    data: studentsAndRequests,
    isLoading: isStudentsAndRequestsLoading,
    error: studentsAndRequestsError,
  } = useStudentsAndRequestsByTeacherId(currentUser.id);

  if (isStudentsAndRequestsLoading) {
    return <Loader message="جاري تحميل طلبات الانضمام المتاحة" />;
  }

  if (studentsAndRequestsError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب طلبات الانضمام، أعد المحاولة" />
    );
  }

  if (!studentsAndRequests?.requests?.length) {
    return (
      <NoDataPlaceHolder message={"لا يوجد طلبات حاليا"} icon={faUserPlus} />
    );
  }

  return (
    <div className="space-y-3">
      {studentsAndRequests?.requests?.map((request) => {
        return (
          <Request
            key={request.studentId}
            requestId={request.studentId}
            stage={request.stage}
          />
        );
      })}
    </div>
  );
}
