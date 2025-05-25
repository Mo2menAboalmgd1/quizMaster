import React from "react";
import Folder from "../../components/Folder";
import { Outlet } from "react-router-dom";
import { useExamsByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";

export default function Exams() {
  const { currentUser } = useCurrentUser();

  const statesFolders = [
    {
      id: 1,
      path: "unPublished",
      text: "الامتحانات الغير منشورة",
      isPublished: false,
    },
    {
      id: 2,
      path: "published",
      text: "الامتحانات المنشورة",
      isPublished: true,
    },
  ];

  const {
    data: exams,
    isLoading: isExamsLoading,
    isError: examsError,
  } = useExamsByTeacherId(currentUser?.id, "all");

  if (!currentUser || isExamsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (examsError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب الامتحانات، أعد المحاولة" />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center flex-wrap gap-5 p-5 pt-0">
        {statesFolders.map((folder) => {
          const stateExams = exams?.filter((exam) => exam.isPublished === folder.isPublished);
          return (
            <div className="relative" key={folder.id}>
              <Folder path={folder.path} text={folder.text} isSmall />
              {stateExams?.length > 0 && (
                <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-3 -top-2">
                  {stateExams?.length || 0}
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
