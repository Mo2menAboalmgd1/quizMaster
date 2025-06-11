import React from "react";
import { publicStage, useCurrentUser } from "../../store/useStore";
import { useStagesByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import PageWrapper from "../../components/PageWrapper";
import Folder from "../../components/Folder";
import { Outlet } from "react-router-dom";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";

export default function EducationalContent() {
  const { currentUser } = useCurrentUser();

  const {
    data: allStages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  if (isStagesLoading) {
    return <Loader />;
  }

  if (stagesError) {
    return <ErrorPlaceHolder />;
  }

  const stages = allStages.filter((stage) => stage.id !== publicStage);

  if (stages.length === 0) {
    return <NoDataPlaceHolder message={"قم بإضافة مجموعات دراسية أولاً"} />;
  }

  return (
    <PageWrapper title={"المحتوى التعليمي"}>
      <div className="flex gap-3 flex-wrap justify-center">
        {stages.map((stage) => {
          return (
            <Folder key={stage.id} path={stage.id} text={stage.name}>
              {stage.name}
            </Folder>
          );
        })}
      </div>
      <Outlet />
    </PageWrapper>
  );
}
