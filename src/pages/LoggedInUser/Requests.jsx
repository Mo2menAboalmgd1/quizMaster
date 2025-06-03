import React from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  useStagesByTeacherId,
  useStudentsAndRequestsByTeacherIdAndTable,
} from "../../QueriesAndMutations/QueryHooks";
import Request from "../../components/Request";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "../../components/PageWrapper";

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

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  if (isRequestsLoading || isStagesLoading) {
    return <Loader message="جاري تحميل طلبات الانضمام المتاحة" />;
  }

  if (requestsError || stagesError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب طلبات الانضمام، أعد المحاولة" />
    );
  }

  if (!requests || requests?.length === 0) {
    return (
      <PageWrapper title={"طلبات الانضمام"}>
        <NoDataPlaceHolder message={"لا يوجد طلبات حاليا"} icon={faUserSlash} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={"طلبات الانضمام"}>
      {requests.map((request) => {
        const stage = stages.find((stage) => stage.id === request.stage_id);
        return (
          <Request
            key={request.studentId}
            requestId={request.studentId}
            stage={stage}
          />
        );
      })}
    </PageWrapper>
  );
}
