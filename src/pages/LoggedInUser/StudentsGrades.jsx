import {
  faAngleDown,
  faUserSlash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useReslutsByExamId,
  useStudentsAndRequestsByTeacherIdAndTable,
  useStudentsFromStudentsIds,
} from "../../QueriesAndMutations/QueryHooks";
import StudentGrade from "../../components/StudentGrade";
import Loader from "../../components/Loader";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { useCurrentUser } from "../../store/useStore";

export default function StudentsGrades() {
  const { id: examId } = useParams();
  const { currentUser } = useCurrentUser();

  const { data: myStudents, isLoading: isMyStudentsLoading } =
    useStudentsAndRequestsByTeacherIdAndTable(
      currentUser.id,
      "teachers_students"
    );

  const {
    data: resluts,
    isLoading: isReslutsLoading,
    error: reslutsError,
  } = useReslutsByExamId(examId);

  const studentsIds = useMemo(() => {
    return resluts?.map((reslut) => reslut.studentId) ?? [];
  }, [resluts]);

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useStudentsFromStudentsIds(studentsIds);

  if (isReslutsLoading || isStudentsLoading || isMyStudentsLoading) {
    return <Loader message="جاري تحميل النتائج" />;
  }

  if (reslutsError || studentsError) {
    return <Loader message="حدث خطأ أثناء جلب النتائج" />;
  }

  if (myStudents?.length === 0) {
    return (
      <NoDataPlaceHolder message="ليس لديك طلاب مسجلين" icon={faUserSlash} />
    );
  }

  if (resluts?.length === 0) {
    return (
      <NoDataPlaceHolder
        message="لم يقم أي طالب بحل هذا الاختبار"
        icon={faXmarkCircle}
      />
    );
  }

  return (
    <div>
      <div className="text-center mb-5 text-blue-500">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-300">
            <tr className="h-10">
              <th className="text-start px-3">الاسم</th>
              <th className="max-sm:hidden">الإجابات الخاطئة</th>
              <th className="max-sm:hidden">الاسئلة المتروكة</th>
              <th className="">المجموع</th>
            </tr>
          </thead>
          <tbody>
            {resluts?.map((result) => (
              <StudentGrade
                key={result.id}
                students={students}
                result={result}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
