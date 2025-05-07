import React from "react";
import { useCurrentUser } from "../../store/useStore";
import { useStudentsAndRequestsByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import Request from "../../components/Request";

export default function Requests() {
  const { currentUser } = useCurrentUser();

  const {
    data: studentsAndRequests,
    isLoading: isStudentsAndRequestsLoading,
    error: studentsAndRequestsError,
  } = useStudentsAndRequestsByTeacherId(currentUser.id);

  return (
    <div className="space-y-3">
      {studentsAndRequests?.requests?.map((request) => {
        return (
          <Request key={request.studentId} requestId={request.studentId} stage={request.stage} />
        );
      })}
    </div>
  );
}
