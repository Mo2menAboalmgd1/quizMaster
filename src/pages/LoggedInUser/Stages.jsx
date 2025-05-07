import React from "react";
import { useCurrentUser } from "../../store/useStore";
import { useColumnByUserId } from "../../QueriesAndMutations/QueryHooks";
import StudentComponent from "../../components/StudentComponent";
import { Link } from "react-router-dom";
import StageFolder from "../../components/StageFolder";

export default function Stages() {
  const { currentUser } = useCurrentUser();

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(currentUser?.id, "teachers", "stages");

  console.log(stages)

  if (isStagesLoading) return <p>Loading...</p>;
  if (stagesError) return <p>Error: {stagesError.message}</p>;

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {stages.map((stage, index) => (
        <StageFolder stage={stage} key={index} />
      ))}
    </div>
  );
}
