import React from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  useColumnByUserId,
  useStudentsAndRequestsByTeacherIdAndTable,
} from "../../QueriesAndMutations/QueryHooks";
import Folder from "../../components/Folder";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";

export default function Stages() {
  const { currentUser } = useCurrentUser();

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(currentUser?.id, "teachers", "stages");

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  console.log(stages);

  if (isStagesLoading || isStudentsLoading) {
    return <Loader message="جاري تحميل المراحل الدراسية" />;
  }
  if (stagesError || studentsError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب المراحل الدراسية يُرجى إعادة المحاولة" />
    );
  }

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {stages.map((stage, index) => {
        const stageStudents = students?.filter(
          (student) => student.stage === stage
        );
        return (
          <div className="relative" key={index}>
            <Folder path={stage} text={stage} />
            {stageStudents?.length > 0 && (
              <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-2 -top-1">
                {stageStudents?.length || 0}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
