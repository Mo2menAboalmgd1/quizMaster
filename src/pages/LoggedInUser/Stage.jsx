import React from "react";
import { useColumnByUserId } from "../../QueriesAndMutations/QueryHooks";
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
  } = useColumnByUserId(currentUser?.id, "teachers", "students");

  if (isStudentsLoading) return <Loader message="جاري تحميل الطلاب" />;
  if (studentsError) return <p>Error: {studentsError.message}</p>;

  const stageStudents = students?.filter((student) => student.stage === stage);
  if (stageStudents.length === 0) {
    return (
      <NoDataPlaceHolder
        message={"لا يوجد طلاب بهذة المرحلة الدراسية إلى الآن"}
        icon={faUser}
      />
    );
  }

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
