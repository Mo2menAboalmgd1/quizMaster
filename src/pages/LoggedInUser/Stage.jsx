import React from "react";
import {
  useStudentsAndRequestsByTeacherIdAndTable,
  useStudentsFromStudentsIds,
} from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import { Link, useParams } from "react-router-dom";
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

  const studentsIds = students?.map((student) => student.studentId);

  const {
    data: studentsData,
    isLoading: isStudentsDataLoading,
    error: studentsDataError,
  } = useStudentsFromStudentsIds(studentsIds);

  if (isStudentsLoading || isStudentsDataLoading)
    return <Loader message="جاري تحميل الطلاب" />;
  if (studentsError || studentsDataError) {
    return <ErrorPlaceHolder message="حدث خطأ اثناء جلب الطلاب" />;
  }

  const stageStudents = students?.filter((student) => student.stage === stage);
  console.log(stageStudents);

  console.log(stageStudents);

  if (!students || !stageStudents || stageStudents.length === 0) {
    return <NoDataPlaceHolder message="لا يوجد طلاب" icon={faUser} />;
  }
  return (
    <div>
      <h1 className="font-bold text-2xl text-blue-500 text-center mb-4">
        {stage}
      </h1>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full" dir="rtl">
          <thead>
            <tr className="h-10">
              <th className="px-3 bg-yellow-300">{ stageStudents.length}</th>
              <th className="border-x bg-blue-200">الاسم</th>
              <th className="w-1/3 bg-emerald-100">الملف الشخصي</th>
            </tr>
          </thead>
          <tbody>
            {stageStudents.map((student, index) => {
              return (
                <tr className="border-t">
                  <td className="flex items-center justify-center py-1">
                    {index + 1}
                  </td>
                  <StudentComponent
                    key={student.studentId}
                    studentId={student.studentId}
                    students={studentsData}
                  />
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
