import React from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import { useExamsByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import {
  faAngleDown,
  faBed,
  faFileAlt,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import TeacherExamsList from "../../components/TeacherExamsList";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Folder from "../../components/Folder";

export default function StageExams() {
  return (
    <div className="py-5">
      <div className="text-center mb-5 text-blue-500">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      <div className="flex gap-5 justify-center max-md:flex-col">
        <Folder path={"normal"} text={"اختبارات تقليدية"} icon={faBed} />
        <Folder path={"time"} text={"اختبارات تقليدية"} icon={faRocket} />
      </div>
    </div>
  );
}

/*
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
  const { stage, PublishedOrNot } = useParams();
  const newStage = stage === "جميع الصفوف" ? "" : stage;
  const isPublished = PublishedOrNot === "published";
  const { currentUser } = useCurrentUser();

  (PublishedOrNot);

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
    return <NoDataPlaceHolder message={"لا يوجد اختبارات"} icon={faFileAlt} />;
  }

  const publishedExams = exams.filter((exam) => exam.isPublished);
  const notPublishedExams = exams.filter((exam) => !exam.isPublished);
  const publishedStageExams = publishedExams.filter((exam) => exam.stage === newStage);
  const notPublishedStageExams = notPublishedExams.filter(
    (exam) => exam.stage === newStage
  );

  (exams);

  return (
    <div className="py-5">
      <div className="text-center mb-5 text-blue-500">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      {
        <TeacherExamsList
          list={isPublished ? publishedStageExams : notPublishedStageExams}
          isPublished={isPublished}
        />
      }
    </div>
  );
}

*/
