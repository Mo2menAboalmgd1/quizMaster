import React from "react";
import {
  useStagesByTeacherId,
  useStudentsAndRequestsByTeacherIdAndTable,
  useStudentsFromStudentsIds,
} from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import { Link, useParams } from "react-router-dom";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";

export default function Stage() {
  const { currentUser } = useCurrentUser();
  const { stageId } = useParams();

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const {
    data: teacherStudents,
    isLoading: isTeacherStudentsLoading,
    error: teacherStudentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  const stageStudents = teacherStudents.filter(
    (student) => student.stage_id === stageId
  );

  const studentsIds = stageStudents.map((student) => student.studentId);

  const {
    data: studentsData,
    isLoading: isStudentsDataLoading,
    error: studentsDataError,
  } = useStudentsFromStudentsIds(studentsIds);

  if (isStagesLoading || isTeacherStudentsLoading || isStudentsDataLoading) {
    return <Loader message="جاري تحميل المراحل الدراسية" />;
  }

  if (stagesError || teacherStudentsError || studentsDataError) {
    return <NoDataPlaceHolder message="حدث خطأ ما" />;
  }

  if (stageStudents.length === 0) {
    return <NoDataPlaceHolder message="لا يوجد طلاب بهذه المرحلة" icon={faUserSlash} />;
  }

  return (
    <div>
      <h1 className="font-bold text-2xl text-blue-500 text-center mb-4">
        {stages?.find((stage) => stage.id === stageId)?.name || ""}
      </h1>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full" dir="rtl">
          <thead>
            <tr className="h-10">
              <th className="px-3 bg-yellow-300">{studentsData.length}</th>
              <th className="border-x bg-blue-200">الاسم</th>
              <th className="w-1/3 bg-emerald-100">الملف الشخصي</th>
            </tr>
          </thead>
          <tbody>
            {stageStudents.map((student, index) => {
              const studentData = studentsData?.find(
                (studentData) => studentData.id === student.studentId
              );
              return (
                <tr className="border-t" key={index}>
                  <td className="flex items-center justify-center py-1">
                    {index + 1}
                  </td>
                  <td className="border-x px-3">{studentData.name}</td>
                  <td className="text-center px-3">
                    <Link
                      to={`/userProfile/${student.studentId}`}
                      className="text-blue-600"
                    >
                      زيارة الملف
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
