import React from "react";
import GradesChart from "./StudentGradesChart";
import {
  useExamsByTeacherId,
  useExamsDataByExamsIds,
  useExamsResultsByStudentId,
} from "../QueriesAndMutations/QueryHooks";
import GradesTable from "./GradesTable";
import Loader from "./Loader";
import ErrorPlaceHolder from "./ErrorPlaceHolder";
import NotTakenExamsTable from "./NotTakenExamsTable";

export default function StudentGradesOverview({ user, currentUser, stage }) {
  const {
    data: allExams,
    isLoading: isLoadingAllExams,
    isError: isErrorAllExams,
  } = useExamsByTeacherId(currentUser.id, true);

  const allStudentStageExams = allExams?.filter(
    (exam) => exam.stage === stage || exam.stage === ""
  );

  const {
    data: examsTaken,
    isLoading: isLoadingExamsTaken,
    isError: isErrorExamsTaken,
  } = useExamsResultsByStudentId(user.id);

  const teacherTakenExams = examsTaken?.filter(
    (exam) => exam.teacherId === currentUser.id
  );

  const teacherTakenExamsIds = teacherTakenExams?.map((exam) => exam.examId);

  const {
    data: teacherExamsTakenData,
    isLoading: isLoadingTeacherExamsTakenData,
    isError: isErrorTeacherExamsTakenData,
  } = useExamsDataByExamsIds(teacherTakenExamsIds);

  const notTakenExams = allStudentStageExams?.filter(
    (exam) => !teacherTakenExamsIds?.includes(exam.id)
  );

  if (
    isLoadingExamsTaken ||
    isLoadingTeacherExamsTakenData ||
    isLoadingAllExams
  ) {
    return <Loader message="جاري التحميل" />;
  }

  if (isErrorExamsTaken || isErrorTeacherExamsTakenData || isErrorAllExams) {
    return <ErrorPlaceHolder message={"حدث خطاً ما، أعد المحاولة"} />;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-green-100">
          <h2 className="text-lg font-semibold text-green-800 text-center">
            رسم بياني لأداء الطالب
          </h2>
        </div>
        <div className="p-4" dir="ltr">
          <GradesChart teacher={currentUser} student={user} />
        </div>
      </div>
      <div>
        <div className="bg-gradient-to-r from-green-100 to-emerald-50 p-4 border-b border-green-100">
          <h2 className="text-lg font-semibold text-green-800 text-center">
            جدول درجات الطالب
          </h2>
        </div>
        <div className="p-4">
          <GradesTable
            exams={teacherTakenExams}
            examsData={teacherExamsTakenData}
          />
        </div>
      </div>
      <div>
        <div className="bg-gradient-to-r from-red-200 to-emerald-50 p-4 border-b border-red-300">
          <h2 className="text-lg font-semibold text-red-800 text-center">
            الاختبارات التي تخلف عنها الطالب
          </h2>
        </div>
        <div className="p-4">
          <NotTakenExamsTable notTakenExams={notTakenExams} />
        </div>
      </div>
    </div>
  );
}
