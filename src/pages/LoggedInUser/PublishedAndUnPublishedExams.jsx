import React from "react";
import { Outlet, useParams } from "react-router-dom";
import {
  useExamsByTeacherId,
  useStagesByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faAngleDown, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import Folder from "../../components/Folder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PublishedAndUnPublishedExams() {
  const { PublishedOrNot } = useParams();
  const { currentUser } = useCurrentUser();
  const isPublished = PublishedOrNot === "published";

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const {
    data: exams,
    isLoading: isExamsLoading,
    isError: examsError,
  } = useExamsByTeacherId(currentUser?.id, "all");

  if (isStagesLoading || isExamsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError || examsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء تحميل الصفحة، أعد المحاولة"} />
    );
  }

  if (!stages) {
    return (
      <NoDataPlaceHolder message={"أضف مراحل دراسية أولاً"} icon={faFileAlt} />
    );
  }

  const publicExams = exams?.filter(
    (exam) => !exam.stage_id && exam.isPublished === isPublished
  );
  "publicExams", publicExams;

  return (
    <div dir="rtl">
      <div className="text-center mb-3 text-blue-500">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>

      <div className="flex gap-5 items-center justify-center flex-wrap">
        <div className="relative">
          <Folder path={"all"} text={"الامتحانات العامة"} isSmall />
          {publicExams?.length > 0 && (
            <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-3 -top-2">
              {publicExams?.length || 0}
            </span>
          )}
        </div>
        {stages.map((stage) => {
          const stageExams = exams?.filter(
            (exam) =>
              exam.stage_id === stage.id && exam.isPublished === isPublished
          );
          return (
            <div className="relative" key={stage.id || "all"}>
              <Folder
                path={stage.id || "all"}
                text={stage.name || "الامتحانات العامة"}
                isSmall
              />
              {stageExams?.length > 0 && (
                <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-3 -top-2">
                  {stageExams?.length || 0}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
