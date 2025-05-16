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
  const title = newStage
    ? isPublished
      ? `الامتحانات المنشورة - ${newStage}`
      : `الامتحانات الغير منشورة - ${newStage}`
    : isPublished
    ? "الامتحانات العامة المنشورة"
    : "الامتحانات العامة الغير منشورة";

  console.log(PublishedOrNot);

  const {
    data: exams,
    isLoading: isExamsLoading,
    isError: examsError,
  } = useExamsByTeacherId(currentUser.id);

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

  const doneExams = exams.filter((exam) => exam.done);
  const notDoneExams = exams.filter((exam) => !exam.done);
  const doneStageExams = doneExams.filter((exam) => exam.stage === newStage);
  const notDoneStageExams = notDoneExams.filter(
    (exam) => exam.stage === newStage
  );

  console.log(exams);

  return (
    <div className="py-5">
      <div className="text-center mb-5 text-blue-500">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      {
        <TeacherExamsList
          list={isPublished ? doneStageExams : notDoneStageExams}
          isPublished={isPublished}
        />
      }
    </div>
  );
}
