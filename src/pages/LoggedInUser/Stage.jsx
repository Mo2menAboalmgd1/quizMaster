import React from "react";
import { useColumnByUserId } from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import StudentComponent from "../../components/StudentComponent";

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
  if (!students) return <p>لا يوجد طلاب بهذه المرحلة</p>;

  const stageStudents = students.filter((student) => student.stage === stage);

  console.log(stageStudents);
  return (
    <div>
      <h1 className="font-bold text-2xl text-blue-500 text-center mb-4">
        {stage}
      </h1>
      {stageStudents.map((student) => {
        return <StudentComponent studentId={student.studentId} />;
      })}
    </div>
  );
}
