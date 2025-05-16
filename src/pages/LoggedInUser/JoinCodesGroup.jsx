import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  useColumnByUserId,
  useJoinCodes,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { faFire, faLock, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { nanoid } from "nanoid";
import { useGenerateJoinCodeMutation } from "../../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";

export default function JoinCodesGroup() {
  const { currentUser } = useCurrentUser();
  const { group } = useParams();
  const [selectedStage, setSelectedStage] = useState("");
  console.log(selectedStage);

  const {
    data: allJoinCodes,
    isLoading: isLoadingAllJoinCodes,
    error: allJoinCodesError,
  } = useJoinCodes(currentUser?.id);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(currentUser?.id, "teachers", "stages");

  console.log(stages);
  useEffect(() => {
    if (stages?.length > 1 || stages) setSelectedStage(stages[0]);
  }, [stages]);

  const { mutate: generateCode } = useGenerateJoinCodeMutation();

  const handleGenerateCode = async () => {
    const randomCode = nanoid(14);
    console.log(randomCode);
    generateCode({
      teacherId: currentUser?.id,
      value: randomCode,
      isPublic: group === "public",
      stage: selectedStage,
    });
  };

  if (!currentUser || isLoadingAllJoinCodes || isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (allJoinCodesError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب الأكواد، أعد المحاولة"} />
    );
  }

  if (stagesError) {
    toast.error("حدث خطأ أثناء جلب الصفوف، أعد المحاولة");
  }

  if (!allJoinCodes || (group !== "public" && group !== "private")) {
    return (
      <NoDataPlaceHolder message="لم يتم العثور على أي أكواد" icon={faLock} />
    );
  }

  const isPublic = group === "public";

  const groupJoinCodes = allJoinCodes.filter((joinCode) => {
    // return joinCode.isPublic ? === (group === "public");
    return joinCode.isPublic === isPublic;
  });
  console.log(groupJoinCodes);

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
        {isPublic ? "الأكواد العامة" : "الأكواد الخاصة"}
      </h1>

      <div
        className="p-5 rounded-xl border-2 border-dashed border-gray-300 flex flex-col gap-4 mb-6 shadow-sm bg-gray-50"
        dir="rtl"
      >
        <div className="w-full flex flex-col gap-2">
          <label className="text-lg font-medium text-gray-700">
            اختر المرحلة الدراسية:
          </label>
          <select
            name="stage"
            id="stage"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="text-center h-12 border border-gray-300 bg-white w-full rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm appearance-none hover:border-green-400"
          >
            {stages?.map((stage, index) => (
              <option key={index} value={stage}>
                {stage}
              </option>
            ))}
            <option value="">جميع الصفوف</option>
          </select>
        </div>

        <button
          onClick={handleGenerateCode}
          className="h-12 px-6 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white cursor-pointer font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:from-sky-600 hover:to-blue-700 flex items-center justify-center"
        >
          أنشئ كود جديد
        </button>
      </div>

      {groupJoinCodes.length === 0 ? (
        <NoDataPlaceHolder message="لم يتم العثور على أي أكواد" icon={faX} />
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {groupJoinCodes.map((joinCode, index) => (
            <div
              key={index}
              className={clsx(
                "p-5 rounded-xl border shadow-sm transition-all",
                joinCode.isUsed
                  ? "bg-red-50 border-red-200 hover:border-red-300"
                  : "bg-green-50 border-green-200 hover:border-green-300"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    <span className="text-gray-500">المرحلة:</span>{" "}
                    {joinCode.stage || "جميع الصفوف"}
                  </p>

                  <h3 className="text-xl font-bold tracking-wide">
                    <span className="text-gray-500">الكود:</span>{" "}
                    {joinCode.value}
                  </h3>
                </div>

                <p className="flex items-center gap-2">
                  <span className="text-gray-500">الحالة:</span>{" "}
                  {joinCode.isPublic ? (
                    <span className="flex items-center gap-2 text-amber-600 font-medium">
                      عام{" "}
                      <FontAwesomeIcon
                        icon={faFire}
                        className="text-amber-500"
                      />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-blue-600 font-medium">
                      خاص{" "}
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-blue-500"
                      />
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
