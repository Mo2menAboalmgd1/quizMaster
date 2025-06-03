import React from "react";
import { publicStage, useCurrentUser, useDarkMode } from "../../store/useStore";
import {
  useStagesByTeacherId,
  useTasksByUserId,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import {
  faAngleDown,
  faTasks,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import {
  useAddNewTaskMutation,
  useDeleteTaskMutation,
} from "../../QueriesAndMutations/mutationsHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatTime } from "../../utils/getDate";
import { Link } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";

export default function TeacherTasks() {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();

  const {
    data: tasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useTasksByUserId(currentUser?.id);

  const {
    data: stages,
    isLoading: isStagesLoading,
    isError: isStagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const { mutate: deleteTaskMutation } = useDeleteTaskMutation();
  const handleDeleteTask = (taskId) => {
    // TODO: delete task
    deleteTaskMutation({
      id: taskId,
      userId: currentUser?.id,
    });
  };

  if (isTasksLoading || isStagesLoading) {
    return <Loader message="جاري تحميل المهام" />;
  }

  if (isTasksError || isStagesError) {
    return <ErrorPlaceHolder message={"حدث خطأ ما، أعد المحاولة"} />;
  }

  return (
    <PageWrapper title={"قائمة المهام"}>
      <AddNewTaskForm stages={stages} />

      {/* if there are tasks */}
      <h2 className="text-2xl font-bold py-3 pt-5 text-blue-500">
        المهام المُضافة
      </h2>
      {tasks?.length === 0 ? (
        <NoDataPlaceHolder message={"لا يوجد مهام، اضف البعض"} icon={faTasks} />
      ) : (
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
                  ? "text-blue-500 bg-blue-500/15"
                  : "text-slate-800 bg-gray-300"
              )}
            >
              <tr>
                <th className="text-start py-2 px-3">عنوان المهمة</th>
                <th>المجموعة</th>
                <th className="max-md:hidden">التاريخ</th>
                <th className="px-3 max-sm:text-transparent">ازرار التحكم</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const stage = stages?.find(
                  (stage) => stage.id === task.stage_id
                );
                return (
                  <tr
                    key={task.id}
                    className={clsx(
                      "border-t",
                      isDarkMode
                        ? "text-white/70 font-light border-blue-500/50 bg-slate-900"
                        : "text-gray-700 border-gray-300"
                    )}
                  >
                    <td
                      className={clsx(
                        "py-2 px-3",
                        isDarkMode ? "text-white font-normal" : "text-black"
                      )}
                    >
                      {task.task}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {stage.id !== publicStage ? stage.name : "مهمة عامة"}
                    </td>
                    <td className="text-center py-2 max-md:hidden">
                      {formatTime(task.created_at)}
                    </td>
                    <td className="flex justify-center items-center py-2">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-7 w-7 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-md flex items-center justify-center cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}

function AddNewTaskForm({ stages }) {
  const [selectedStage, setSelectedStage] = React.useState("");
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();

  React.useEffect(() => {
    setSelectedStage(stages?.[0]?.id);
  }, [stages]);

  const { mutate: addNewTask } = useAddNewTaskMutation();
  const handleAddNewTask = (e) => {
    // TODO: add new task
    e.preventDefault();
    addNewTask(
      {
        stage_id: selectedStage,
        user_id: currentUser?.id,
        task: e.target.task.value,
        isTeacher: true,
      },
      {
        onSuccess: () => {
          e.target.reset();
          setSelectedStage(stages?.[0]?.id);
        },
      }
    );
  };

  return (
    <form
      className={clsx(
        "p-3 border rounded-lg w-full space-y-3",
        isDarkMode
          ? "border-blue-500/50 bg-blue-500/10"
          : "border-gray-300 bg-gray-50"
      )}
      onSubmit={handleAddNewTask}
    >
      <div className="space-y-2">
        <label htmlFor="stage" className="block">
          اختر المرحلة الدراسية:
        </label>
        <div className="relative">
          <div className="text-gray-500 absolute inset-2.5 z-10 pointer-events-none">
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          <select
            name="stage"
            id="stage"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className={clsx(
              "py-2 rounded-lg appearance-none w-full text-center outline-none",
              isDarkMode
                ? "bg-slate-900 border border-blue-500/30 focus:border-blue-500"
                : "bg-gray-200 focus:ring-blue-300 focus:ring"
            )}
          >
            {stages?.map((stage, index) => {
              if (stage.id === publicStage) return null;
              return (
                <option key={index} value={stage.id}>
                  {stage.name}
                </option>
              );
            })}
            <option value={publicStage}>مهمة عامة</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="task" className="block">
          عنوان المهمة:
        </label>
        <input
          type="text"
          id="task"
          placeholder="أضف مهمة جديدة"
          className={clsx(
            "py-2 px-3 rounded-lg w-full outline-none",
            isDarkMode
              ? "bg-slate-900 border border-blue-500/30 focus:border-blue-500"
              : "bg-gray-200 focus:ring-2 focus:ring-blue-300"
          )}
        />
      </div>
      <button className="rounded-lg w-full text-white bg-blue-600 py-2 ">
        إضافة
      </button>
    </form>
  );
}
