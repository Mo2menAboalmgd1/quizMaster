import React from "react";
import { useCurrentUser } from "../../store/useStore";
import { useColumnByUserId } from "../../QueriesAndMutations/QueryHooks";
import StageFolder from "../../components/StageFolder";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";

export default function Stages() {
  const { currentUser } = useCurrentUser();

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(currentUser?.id, "teachers", "stages");

  console.log(stages);

  if (isStagesLoading) {
    return <Loader message="جاري تحميل المراحل الدراسية" />;
  }
  if (stagesError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب المراحل الدراسية يُرجى إعادة المحاولة" />
    );
  }

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {stages.map((stage, index) => (
        <StageFolder stage={stage} key={index} />
      ))}
    </div>
  );
}
