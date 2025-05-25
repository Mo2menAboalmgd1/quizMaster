import React from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import { useExamsByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import { faAngleDown, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import TeacherExamsList from "../../components/TeacherExamsList";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function StageExams() {
  const { stageId, PublishedOrNot, type } = useParams();
  const newStage = stageId === "all" ? null : stageId;
  const isPublished = PublishedOrNot === "published";
  const isTime = type === "time";

  const { currentUser } = useCurrentUser();

  const {
    data: exams,
    isLoading: isExamsLoading,
    isError: examsError,
  } = useExamsByTeacherId(currentUser.id, "all");

  if (isExamsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (examsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء تحميل الصفحة، أعد المحاولة"} />
    );
  }

  if (!exams) {
    return <NoDataPlaceHolder message={"لا يوجد امتحانات"} icon={faFileAlt} />;
  }

  const publishedExams = exams.filter((exam) => exam.isPublished);
  const notPublishedExams = exams.filter((exam) => !exam.isPublished);
  const publishedStageExams = publishedExams.filter(
    (exam) => exam.stage_id === newStage
  );
  const notPublishedStageExams = notPublishedExams.filter(
    (exam) => exam.stage_id === newStage
  );
  const timePublishedStageExams = publishedStageExams.filter(
    (exam) => exam.isTime
  );
  const normalPublishedStageExams = publishedStageExams.filter(
    (exam) => !exam.isTime
  );
  const timeNotPublishedStageExams = notPublishedStageExams.filter(
    (exam) => exam.isTime
  );
  const normalNotPublishedStageExams = notPublishedStageExams.filter(
    (exam) => !exam.isTime
  );

  exams;

  return (
    <div className="py-5">
      <div className="text-center mb-5 text-blue-500">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      {
        <TeacherExamsList
          list={
            isPublished
              ? isTime
                ? timePublishedStageExams
                : normalPublishedStageExams
              : isTime
              ? timeNotPublishedStageExams
              : normalNotPublishedStageExams
          }
          isPublished={isPublished}
        />
      }
    </div>
  );
}
