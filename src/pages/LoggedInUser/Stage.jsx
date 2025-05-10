import React from "react";
import { useStudentsAndRequestsByTeacherIdAndTable } from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import StudentComponent from "../../components/StudentComponent";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Stage() {
  const { currentUser } = useCurrentUser();
  const { stage } = useParams();

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  if (isStudentsLoading) return <Loader message="جاري تحميل الطلاب" />;
  if (studentsError) {
    return <ErrorPlaceHolder message="حدث خطأ اثناء جلب الطلاب" />;
  }
  if (!students) {
    return <NoDataPlaceHolder message="لا يوجد طلاب" icon={faUser} />;
  }

  const stageStudents = students?.filter((student) => student.stage === stage);
  console.log(stageStudents);

  console.log(stageStudents);
  return (
    <div>
      <h1 className="font-bold text-2xl text-blue-500 text-center mb-4">
        {stage}
      </h1>
      {stageStudents.map((student) => {
        return (
          <StudentComponent
            key={student.studentId}
            studentId={student.studentId}
          />
        );
      })}
    </div>
  );
}
