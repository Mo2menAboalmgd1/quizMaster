import React from "react";
import { Outlet, useParams } from "react-router-dom";
import Folder from "../../components/Folder";
import PageWrapper from "../../components/PageWrapper";
import { useExamByItsId } from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";

export default function ExamData() {
  const { id: examId } = useParams();
  console.log(examId);

  const {
    data: examData,
    isLoading: isExamDataLoading,
    error: examDataError,
  } = useExamByItsId(examId);

  if (isExamDataLoading) {
    return <Loader message="جاري تحميل معلومات الاختبار" />;
  }

  if (examDataError) {
    return <div>Error</div>;
  }

  if (!examData) {
    return <div>No exam data</div>;
  }

  return (
    <PageWrapper title={`معلومات عن اختبار (${examData.title})`} isBold={false}>
      <div className="flex gap-5 justify-center flex-wrap pb-5">
        <Folder path={""} text={"درجات الطلاب"} isEnd />
        <Folder path={"didNotTakeExam"} text={"المتخلفين عن الاختبار"} />
      </div>
      <Outlet />
    </PageWrapper>
  );
}
