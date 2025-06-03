import React from "react";
import { useParams } from "react-router-dom";
import {
  useReslutsByExamId,
  useStudentsAndRequestsByTeacherIdAndTable,
  useStudentsFromStudentsIds,
} from "../../QueriesAndMutations/QueryHooks";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import {
  faAngleDown,
  faCircleCheck,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";

export default function DidNotTakeExam() {
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

  const {
    data: allStudents,
    isLoading: isAllStudentsLoading,
    error: allStudentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  allStudents, resluts;

  const studentsDidNotTakeExam = allStudents?.filter(
    (student) =>
      !resluts?.some((result) => result.studentId === student.studentId)
  );

  const studentsDidNotTakeExamIds = studentsDidNotTakeExam?.map(
    (student) => student.studentId
  );

  const {
    data: studentsDidNotTakeExamData,
    isLoading: isStudentsDidNotTakeExamDataLoading,
    error: studentsDidNotTakeExamDataError,
  } = useStudentsFromStudentsIds(studentsDidNotTakeExamIds);

  studentsDidNotTakeExamIds;

  if (
    isReslutsLoading ||
    isAllStudentsLoading ||
    isStudentsDidNotTakeExamDataLoading ||
    isMyStudentsLoading
  ) {
    return <Loader message="جاري تحميل النتائج" />;
  }

  if (reslutsError || allStudentsError || studentsDidNotTakeExamDataError) {
    return <ErrorPlaceHolder message="حدث خطأ أثناء جلب النتائج" />;
  }

  if (myStudents?.length === 0) {
    return (
      <NoDataPlaceHolder message="ليس لديك طلاب مسجلين" icon={faUserSlash} />
    );
  }

  if (!studentsDidNotTakeExam || studentsDidNotTakeExam.length === 0) {
    return (
      <NoDataPlaceHolder
        message="قام جميع الطلاب بحل هذا الاختبار"
        icon={faCircleCheck}
      />
    );
  }

  return (
    <div>
      <div>
        <div className="text-center mb-5 text-blue-500">
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-300">
          <table className="w-full">
            <thead>
              <tr>
                <th className="bg-gray-300 h-10 col-span-2">اسم الطالب</th>
              </tr>
            </thead>
            <tbody>
              {studentsDidNotTakeExamData?.map((student) => {
                return (
                  <tr key={student.id} className="border-t border-gray-300">
                    <td className="px-2 py-1">{student.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
