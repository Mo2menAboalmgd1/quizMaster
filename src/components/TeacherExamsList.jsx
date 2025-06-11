import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteExamMutation,
  useEditExamDataMutation,
} from "../QueriesAndMutations/mutationsHooks";
import { useCurrentUser, useDarkMode } from "../store/useStore";
import {
  faArrowLeft,
  faCheckDouble,
  faFileAlt,
  faInfo,
  // faInfoCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import AlertBox from "./AlertBox";
import { formatTime } from "../utils/getDate";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function TeacherExamsList({ stages, list, isPublished }) {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();
  const [isDelete, setIsDelete] = useState(false);
  const [t] = useTranslation("global");
  const publicExam = t("teacherExamsList.publicExam");

  const { mutate: deleteExamMutation } = useDeleteExamMutation();

  const deleteExamWithResults = async (examId, title, stage) => {
    deleteExamMutation({
      id: examId,
      title,
      actionStage: stage || publicExam,
      teacherId: currentUser?.id,
      isDeleteWithResults: true,
    });
  };

  const deleteExamOnly = async (examId, title, stage) => {
    deleteExamMutation({
      id: examId,
      title,
      actionStage: stage || publicExam,
      teacherId: currentUser?.id,
      isDeleteWithResults: false,
    });
  };

  const { mutateAsync: editExam } = useEditExamDataMutation();

  const handleUndoPublish = async (examId, stageId, title) => {
    console.log("undo publish");
    await editExam({
      action: {
        teacherId: currentUser?.id,
        title: title,
        stage:
          stages?.find((stage) => stage.id === stageId)?.name || publicExam,
        isEdit: "unPublish",
        examId,
      },
      update: {
        isPublished: false,
      },
    });
  };

  const handleShowCorrection = async (examId, title, stageId, value) => {
    editExam({
      action: {
        teacherId: currentUser?.id,
        stage:
          stages?.find((stage) => stage.id === stageId)?.name || publicExam,
        title,
        isEdit: value ? "showCorrection" : "hideCorrection",
        examId,
      },
      update: {
        isShowCorrection: value,
      },
    });
  };

  if (list?.length === 0) {
    return (
      <NoDataPlaceHolder
        message={t("teacherExamsList.noData")}
        icon={faFileAlt}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          "border rounded-lg overflow-hidden",
          isDarkMode ? "border-blue-500/50" : "border-gray-300"
        )}
      >
        <table className="w-full">
          <thead
            className={clsx(
              isDarkMode
                ? "text-blue-500 bg-blue-500/20"
                : "text-slate-800 bg-gray-300"
            )}
          >
            <tr>
              <th className="text-start py-2 px-3">
                {t("teacherExamsList.content.examTitle")}
              </th>
              <th className="max-sm:hidden">
                {t("teacherExamsList.content.date")}
              </th>
              <th className="">
                {t("teacherExamsList.content.controlButtons")}
              </th>
              <th className="max-sm:hidden">
                {t("teacherExamsList.content.information")}
              </th>
            </tr>
          </thead>
          <tbody>
            {list?.map((exam) => {
              const isShowCorrection = exam.isShowCorrection;
              return (
                <tr
                  key={exam.id}
                  className={clsx(
                    "border-t",
                    isDarkMode
                      ? "border-blue-500/50 bg-slate-900"
                      : "border-gray-300"
                  )}
                >
                  <td>
                    <Link
                      className="py-2 px-3 text-blue-500 flex gap-1 items-center"
                      to={"/resumeCreateTest/" + exam.id}
                    >
                      <FontAwesomeIcon icon={faFileAlt} className="ml-2" />
                      <span>{exam.title}</span>
                    </Link>
                  </td>
                  <td
                    className={clsx(
                      "text-center max-sm:hidden",
                      isDarkMode ? "text-slate-500" : "text-gray-600"
                    )}
                  >
                    {formatTime(exam.created_at)}
                  </td>
                  <td className="flex gap-2 py-2 justify-center">
                    <button
                      onClick={() => setIsDelete(true)}
                      title={t("teacherExamsList.content.delete")}
                      className="border border-red-600 text-red-600 hover:text-white hover:bg-red-600 h-7 w-7 rounded-md cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <div className="flex gap-2 max-md:h-8">
                      {isPublished && (
                        <>
                          <div
                            title={t("teacherExamsList.content.showAnswers")}
                          >
                            <input
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleShowCorrection(
                                    exam.id,
                                    exam.title,
                                    exam.stage_id,
                                    true
                                  );
                                } else {
                                  handleShowCorrection(
                                    exam.id,
                                    exam.title,
                                    exam.stage_id,
                                    false
                                  );
                                }
                              }}
                              defaultChecked={isShowCorrection}
                              type="checkbox"
                              id={`${exam.id}`}
                              className="hidden peer"
                            />
                            <label
                              htmlFor={`${exam.id}`}
                              className={clsx(
                                " border peer-checked:border peer-checked:border-blue-400  rounded-md flex items-center justify-center text-sm gap-1 transition-colors md:py-1 cursor-pointer select-none h-7 w-7",
                                isDarkMode
                                  ? "bg-slate-900 border-slate-500 text-slate-400 peer-checked:bg-blue-500/15 peer-checked:text-blue-400"
                                  : "bg-gray-100 border-gray-300 text-gray-700 peer-checked:bg-blue-100 peer-checked:text-blue-600"
                              )}
                            >
                              <FontAwesomeIcon icon={faCheckDouble} />
                            </label>
                          </div>
                          <button
                            onClick={() =>
                              handleUndoPublish(
                                exam.id,
                                exam.stage_id,
                                exam.title
                              )
                            }
                            title={t("teacherExamsList.content.undoPublish")}
                            className="h-7 w-7 border border-orange-600 text-orange-600 hover:text-white hover:bg-orange-600 text-sm rounded-md cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faArrowLeft} />
                          </button>
                          <Link
                            to={"/examData/" + exam.id}
                            className={clsx(
                              "h-7 w-7 border text-sm rounded-md cursor-pointer flex items-center justify-center sm:hidden",
                              isDarkMode
                                ? "border-white text-white hover:bg-white hover:text-slate-900"
                                : "border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
                            )}
                          >
                            <FontAwesomeIcon icon={faInfo} />
                          </Link>
                        </>
                      )}
                    </div>
                    {isDelete && (
                      <AlertBox
                        title={t("teacherExamsList.content.alertBox.title")}
                        type={"red"}
                        message={t("teacherExamsList.content.alertBox.message")}
                        firstOptionText={"حذف"}
                        firstOptionDescription={t(
                          "teacherExamsList.content.alertBox.firstOptionDesc"
                        )}
                        firstOptionFunction={() =>
                          deleteExamOnly(exam.id, exam.title, exam.stage)
                        }
                        setOpen={setIsDelete}
                        isSecondOption={true}
                        secondOptionText={t(
                          "teacherExamsList.content.alertBox.secondOptionTitle"
                        )}
                        secondOptionDescription={t(
                          "teacherExamsList.content.alertBox.secondOptionDesc"
                        )}
                        secondOptionFunction={() =>
                          deleteExamWithResults(exam.id, exam.title, exam.stage)
                        }
                      />
                    )}
                  </td>
                  <td className="text-center w-28 max-sm:hidden">
                    <Link to={"/examData/" + exam.id} className="text-blue-500">
                      <span>عرض</span>
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
