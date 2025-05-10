import React from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  useStudentsAndRequestsByTeacherIdAndTable,
} from "../../QueriesAndMutations/QueryHooks";
import Request from "../../components/Request";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function Requests() {
  const { currentUser } = useCurrentUser();

  const {
    data: requests,
    isLoading: isRequestsLoading,
    error: requestsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_requests"
  );

  if (isRequestsLoading) {
    return <Loader message="جاري تحميل طلبات الانضمام المتاحة" />;
  }

  if (requestsError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب طلبات الانضمام، أعد المحاولة" />
    );
  }

  if (!requests || requests?.length === 0) {
    return (
      <NoDataPlaceHolder message={"لا يوجد طلبات حاليا"} icon={faUserPlus} />
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
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
