import React from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  useStagesByTeacherId,
  useTasksByUserId,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faTasks, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import {
  useAddNewTaskMutation,
  useDeleteTaskMutation,
} from "../../QueriesAndMutations/mutationsHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TeacherTasks() {
  const { currentUser } = useCurrentUser();

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
    <div>
      <div className="text-center text-3xl font-bold mb-5 text-blue-500">
        قائمة المهام
      </div>
      <AddNewTaskForm stages={stages} />
      {tasks?.length === 0 && (
        <NoDataPlaceHolder message={"لا يوجد مهام، اضف البعض"} icon={faTasks} />
      )}
      {/* if there are tasks */}
      {tasks?.map((task, index) => (
        // TODO: add delete button
        <div
          key={index}
          className="flex flex-col gap-2 mb-5 border border-gray-300 bg-blue-50 w-full p-4 rounded-xl relative"
          dir="rtl"
        >
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="h-8 w-8 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg absolute left-3 bottom-3 flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-blue-500">
              {stages.find((stage) => stage.id === task?.stage_id)?.name ||
                "الكل"}
            </p>
            <p className="text-lg font-bold text-gray-500">
              {task?.created_at?.split("T")[0]}
            </p>
          </div>
          <p className="text-lg font-bold text-gray-500 w-11/12">
            {task?.task}
          </p>
        </div>
      ))}
    </div>
  );
}

function AddNewTaskForm({ stages }) {
  const [selectedStage, setSelectedStage] = React.useState("");
  const { currentUser } = useCurrentUser();

  React.useEffect(() => {
    setSelectedStage(stages?.[0]?.id);
  }, [stages]);

  const { mutate: addNewTask } = useAddNewTaskMutation();
  const handleAddNewTask = (e) => {
    // TODO: add new task
    e.preventDefault();
    addNewTask({
      stage_id: selectedStage || null,
      user_id: currentUser?.id,
      task: e.target.task.value,
      isTeacher: true,
    });
  };

  return (
    <form
      className="flex flex-col gap-2 mb-5 border border-gray-300 bg-blue-50 w-full p-4 rounded-xl"
      dir="rtl"
      onSubmit={handleAddNewTask}
    >
      <div className="space-y-2">
        <label htmlFor="stage" className="block">
          اختر المرحلة الدراسية:
        </label>
        <select
          name="stage"
          id="stage"
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className={clsx(
            "text-center py-2 px-3 border border-gray-300 bg-white w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-400 transition-all shadow-sm appearance-none"
          )}
        >
          {stages?.map((stage, index) => (
            <option key={index} value={stage.id}>
              {stage.name}
            </option>
          ))}
          <option value="">جميع الصفوف</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="task" className="block">
          عنوان المهمة:
        </label>
        <input
          type="text"
          id="task"
          placeholder="أضف مهمة جديدة"
          className="border border-gray-300 rounded-md px-3 py-2 w-full bg-white focus:ring-2 focus:border-transparent focus:ring-blue-400 outline-none"
        />
      </div>
      <button className="bg-blue-500 text-white rounded-md px-3 py-2 mt-2 cursor-pointer hover:bg-blue-600 transition-all shadow-sm focus:outline-none active:bg-blue-500">
        إضافة
      </button>
    </form>
  );
}
