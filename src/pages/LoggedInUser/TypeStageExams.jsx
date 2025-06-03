import React from "react";
import { useParams } from "react-router-dom";
import { publicStage, useCurrentUser } from "../../store/useStore";
import {
  useExamsByTeacherId,
  useStagesByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import { faAngleDown, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import TeacherExamsList from "../../components/TeacherExamsList";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function StageExams() {
  const { stageId, PublishedOrNot, type } = useParams();
  const newStage = stageId === "all" ? publicStage : stageId;
  const isPublished = PublishedOrNot === "published";
  const isTime = type === "time";

  console.log("stageId: ", newStage);
  console.log("PublishedOrNot: ", PublishedOrNot);
  console.log("type: ", type);
  // console.log("newStage: ", newStage);

  const { currentUser } = useCurrentUser();

  const {
    data: examsData,
    isLoading: isExamsLoading,
    isError: examsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExamsByTeacherId(currentUser.id, isPublished, isTime, newStage);

  const exams = examsData?.pages.flatMap((page) => page.data);

  console.log("examsData: ", examsData);
  console.log("exams: ", exams);

  const {
    data: stages,
    isLoading: isStagesLoading,
    isError: stagesError,
  } = useStagesByTeacherId(currentUser.id);

  if (isExamsLoading || isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (examsError || stagesError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء تحميل الصفحة، أعد المحاولة"} />
    );
  }

  if (exams?.length === 0) {
    return <NoDataPlaceHolder message={"لا يوجد اختبارات"} icon={faFileAlt} />;
  }

  exams;

  return (
    <div className="py-5">
      <div className="text-center mb-5 text-blue-500">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      <TeacherExamsList
        stages={stages}
        list={exams}
        isPublished={isPublished}
      />
    </div>
  );
}
