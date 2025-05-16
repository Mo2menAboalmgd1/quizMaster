import React from "react";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import {
  useColumnByUserId,
} from "../../QueriesAndMutations/QueryHooks";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import Folder from "../../components/Folder";

export default function JoinCodes() {
  const { currentUser } = useCurrentUser();

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(currentUser?.id, "teachers", "stages");

  if (!currentUser || isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError) {
    return <ErrorPlaceHolder message="حدث خطأ أثناء جلب الأكواد" />;
  }

  if (!stages || stages.length === 0) {
    return <NoDataPlaceHolder message="لم يتم العثور على أكواد انضمام" />;
  }

  console.log(stages);

  return (
    <div>
      <div className="flex gap-3 flex-wrap justify-center">
        <Folder path={"public"} text="أكواد عامة" key={"1"} />
        <Folder path={"private"} text="أكواد خاصة" key={"2"} />
      </div>
    </div>
  );
}
