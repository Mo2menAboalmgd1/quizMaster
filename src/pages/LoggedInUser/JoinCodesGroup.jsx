import React, { useEffect, useState } from "react";
import { publicStage, useCurrentUser, useDarkMode } from "../../store/useStore";
import {
  useJoinCodes,
  useStagesByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import {
  faAngleDown,
  faCopy,
  faLock,
  faMessage,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { nanoid } from "nanoid";
import { useGenerateJoinCodeMutation } from "../../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";
import PageWrapper from "../../components/PageWrapper";

export default function JoinCodesGroup() {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();
  const { group } = useParams();
  const isPublic = group === "public";
  const [selectedStage, setSelectedStage] = useState("");
  const [isCopyCode, setIsCopyCode] = useState(null);
  const [isSendCode, setIsSendCode] = useState(null);
  const [number, setNumber] = useState("");
  selectedStage;

  const {
    data: joinCodes,
    isLoading: isJoinCodesLoading,
    isError: JoinCodesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useJoinCodes(currentUser?.id, isPublic);

  console.log(joinCodes);

  const groupJoinCodes = joinCodes?.pages.flatMap((page) => page.data);
  console.log(groupJoinCodes);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  useEffect(() => {
    if (stages?.length > 1 || stages) setSelectedStage(stages[0].id);
  }, [stages]);

  const { mutate: generateCode } = useGenerateJoinCodeMutation();

  const handleGenerateCode = async () => {
    const random1 = nanoid(8);
    const random2 = nanoid(4);
    const random3 = nanoid(4);
    const random4 = nanoid(4);
    const random5 = nanoid(12);
    const randomCode = `${random1}-${random2}-${random3}-${random4}-${random5}`;
    generateCode({
      teacherId: currentUser?.id,
      value: randomCode,
      isPublic,
      stage_id: selectedStage,
    });
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("تم النسخ", { duration: 1000 });
    setIsCopyCode(code);
    setTimeout(() => {
      setIsCopyCode(null);
    }, 1000);
  };

  const handleSendCode = () => {
    if (typeof window !== "undefined" && window.open) {
      window.open(`https://wa.me/+2${number}?text=${isSendCode}`);
    }
    setIsSendCode(null);
    setNumber("");
  };

  if (!currentUser || isJoinCodesLoading || isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (JoinCodesError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب الأكواد، أعد المحاولة"} />
    );
  }

  if (stagesError) {
    toast.error("حدث خطأ أثناء جلب الصفوف، أعد المحاولة");
  }

  if (!joinCodes || (group !== "public" && group !== "private")) {
    return (
      <NoDataPlaceHolder message="لم يتم العثور على أي أكواد" icon={faLock} />
    );
  }

  return (
    <PageWrapper title={isPublic ? "الأكواد العامة" : "الأكواد الخاصة"}>
      <div className="w-full flex flex-col gap-2 mb-5">
        <label
          className={clsx(
            "text-lg font-medium",
            isDarkMode ? "text-white" : "text-gray-700"
          )}
        >
          اختر المرحلة الدراسية:
        </label>
        <div className="flex gap-3">
          <div className="relative grow">
            <select
              name="stage"
              id="stage"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className={clsx(
                "text-center h-12 w-full rounded-lg px-4 focus:outline-none transition-all duration-200 appearance-none",
                isDarkMode
                  ? "bg-slate-800 border border-blue-500/50 focus:border-blue-500"
                  : "bg-white border border-gray-200 focus:border-transparent focus:ring-2 focus:ring-blue-400"
              )}
            >
              {stages?.map((stage, index) => {
                return (
                  <option key={index} value={stage.id}>
                    {stage.id !== publicStage ? stage.name : "كل المجموعات"}
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-gray-500">
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </div>

          <button
            onClick={handleGenerateCode}
            className="bg-blue-500 text-white rounded-lg px-5 hover:bg-blue-600 transition-colors cursor-pointer active:bg-blue-500"
          >
            إنشاء
          </button>
        </div>
      </div>

      {groupJoinCodes.length === 0 ? (
        <NoDataPlaceHolder message="لم يتم العثور على أي أكواد" icon={faX} />
      ) : (
        <div className="space-y-4">
          <h1 className="font-bold text-blue-500 text-2xl mb-3 mt-6">
            جدول الأكواد
          </h1>
          <div
            className={clsx(
              "rounded-lg border overflow-hidden",
              isDarkMode ? "border-blue-500/50" : "border-gray-300"
            )}
          >
            <table className="w-full max-md:text-sm">
              <thead
                className={clsx(
                  isDarkMode ? "bg-blue-500/15 text-blue-400" : "bg-gray-300"
                )}
              >
                <tr>
                  <th className="py-2 px-3">الكود</th>
                  <th className="py-2 px-3">المرحلة</th>
                  <th className="py-2 px-3">ازرار التحكم</th>
                </tr>
              </thead>
              <tbody>
                {groupJoinCodes.map((joinCode, index) => {
                  const stage = stages?.find(
                    (stage) => stage.id === joinCode.stage_id
                  );
                  return (
                    <tr
                      key={index}
                      className={clsx(
                        "border-t",
                        isDarkMode
                          ? "border-blue-500/50 bg-slate-900"
                          : "border-gray-300"
                      )}
                    >
                      <td className="py-2 px-3 flex gap-2">
                        <button
                          className={clsx(
                            "text-gray-500 hover:text-gray-600 transition-all duration-200 cursor-pointer",
                            isCopyCode === joinCode.value && "text-green-500"
                          )}
                          onClick={() => handleCopyCode(joinCode.value)}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                        <span
                          dir="ltr"
                          className="cursor-pointer"
                          onClick={() => handleCopyCode(joinCode.value)}
                        >
                          {joinCode.value}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {stage.id !== publicStage ? stage.name : "كل المجموعات"}
                      </td>
                      <td className="py-2 px-3 text-center flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setIsSendCode(joinCode.value);
                          }}
                          className="h-7 w-7 rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 cursor-pointer text-sm flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faMessage} />
                        </button>
                        <button className="h-7 w-7 rounded-lg border border-red-500 text-red-500 hover:text-white hover:bg-red-500 cursor-pointer text-sm flex items-center justify-center">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button className="h-7 w-7 rounded-lg border border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 cursor-pointer text-sm flex items-center justify-center">
                          <FontAwesomeIcon icon={faLock} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {isSendCode && (
            <div
              className="fixed inset-0 bg-black/15 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsSendCode(null)}
            >
              <form
                className={clsx(
                  "p-3 rounded-lg  border  w-md mx-3 flex flex-col gap-3 items-end",
                  isDarkMode
                    ? "border-blue-500/50 bg-slate-900"
                    : "border-blue-500 bg-white"
                )}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCode();
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-2 w-full">
                  <label
                    htmlFor="phoneNumber"
                    className="select-none block font-semibold"
                  >
                    ادخل رقم الهاتف:
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="ex. 01026201555"
                    value={number}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (/^\d*$/.test(newValue)) {
                        // Only digits allowed
                        setNumber(newValue);
                      }
                    }}
                    className={clsx(
                      "h-10 rounded-md outline-none w-full px-3 transition-all",
                      isDarkMode
                        ? "bg-slate-800 border border-blue-500/30 focus:border-blue-500"
                        : "bg-gray-200 focus:ring-2 focus:ring-blue-300"
                    )}
                    dir="ltr"
                  />
                </div>
                <button className="py-2 px-5 rounded-lg text-white bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-500">
                  ارسال الرمز
                </button>
              </form>
            </div>
          )}
        </div>
      )}
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isFetchingNextPage ? "جاري التحميل..." : "تحميل المزيد"}
          </button>
        </div>
      )}
    </PageWrapper>
  );
}

/*
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
                    {stages.find((stage) => stage.id === joinCode.stage_id)
                      ?.name || "جميع الصفوف"}
                  </p>

                  <div className="text-xl font-bold tracking-wide flex gap-2">
                    <span className="text-gray-500">الكود:</span>{" "}
                    <div className="flex gap-2">
                      <span>{joinCode.value}</span>
                      <button
                        className={clsx(
                          "text-gray-500 hover:text-gray-600 transition-all duration-200 cursor-pointer",
                          isCopyCode && "text-green-500"
                        )}
                        onClick={() => {
                          navigator.clipboard.writeText(joinCode.value);
                          toast.success("تم النسخ", { duration: 1000 });
                          setIsCopyCode(true);
                          setTimeout(() => {
                            setIsCopyCode(false);
                          }, 1000);
                        }}
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    </div>
                  </div>
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
*/
