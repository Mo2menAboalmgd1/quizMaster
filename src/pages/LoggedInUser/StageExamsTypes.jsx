import React from "react";
import { Outlet, useParams } from "react-router-dom";
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

export default function StageExamsTypes() {
  const { PublishedOrNot, stageId } = useParams();
  const newStage = stageId === "all" ? null : stageId;
  const isPublished = PublishedOrNot === "published";
  const { currentUser } = useCurrentUser();

  const typesFolders = [
    {
      id: 1,
      path: "normal",
      text: "اختبارات تقليدية",
      isPublished,
      isTime: false,
      icon: faBed,
    },
    {
      id: 2,
      path: "time",
      text: "اختبارات سريعة",
      isPublished,
      isTime: true,
      icon: faRocket,
    },
  ];

  const {
    data: exams,
    isLoading: isExamsLoading,
    isError: examsError,
  } = useExamsByTeacherId(currentUser.id, isPublished);

  if (isExamsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (examsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء تحميل الصفحة، أعد المحاولة"} />
    );
  }

  if (!exams) {
    <NoDataPlaceHolder message={"لا يوجد امتحانات"} icon={faFileAlt} />;
  }

  return (
    <div className="py-5">
      <div className="text-center mb-3 text-blue-500">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      <div className="flex gap-5 justify-center max-md:flex-col">
        {typesFolders.map((folder) => {
          const typeExams = exams?.filter(
            (exam) =>
              exam.isTime === folder.isTime && exam.stage_id === newStage
          );
          "typeExams", typeExams;
          return (
            <div className="relative" key={folder.id}>
              <Folder
                path={folder.path}
                text={folder.text}
                icon={folder.icon}
                isSmall={true}
              />
              {typeExams.length > 0 && (
                <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-2 -top-1.5 max-lg:hidden">
                  {typeExams.length}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}