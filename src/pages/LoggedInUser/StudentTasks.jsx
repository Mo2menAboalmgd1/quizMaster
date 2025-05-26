import React, { useEffect } from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  useDoneTasksByStudentId,
  useStagesByStagesIds,
  useStagesByStudentId,
  useTasksByUsersIds,
  useTeachersFromTeachersStudents,
  useUserDataByUsersIdsAndKey,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import {
  useAddNewTaskMutation,
  useCheckTaskMutation,
} from "../../QueriesAndMutations/mutationsHooks";

export default function StudentTasks() {
  const { currentUser } = useCurrentUser();
  const myId = currentUser?.id;

  const {
    data: mySubsciptions,
    isLoading: isSubsciptionsLoading,
    isError: isSubsciptionsError,
  } = useTeachersFromTeachersStudents(myId);

  const usersIds = mySubsciptions?.map((sub) => sub.teacherId) ?? [];

  const {
    data: teachersData,
    isLoading: isTeachersLoading,
    isError: isTeachersError,
  } = useUserDataByUsersIdsAndKey(usersIds, "teachers", "teachers");

  console.log("teachersData:  ", teachersData);

  const {
    data: allTasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useTasksByUsersIds([...usersIds, myId]);

  const {
    data: doneTasks,
    isLoading: isDoneTasksLoading,
    isError: isDoneTasksError,
  } = useDoneTasksByStudentId(myId);

  console.log("doneTasks:  ", doneTasks);

  const {
    data: stages,
    isLoading: isStagesLoading,
    isError: isStagesError,
  } = useStagesByStudentId(myId);

  const stagesIds = stages?.map((stage) => stage.stage_id);

  const {
    data: stagesData,
    isLoading: isStagesDataLoading,
    isError: isStagesDataError,
  } = useStagesByStagesIds(stagesIds);

  const myTasks = allTasks?.filter(
    (task) =>
      stagesData?.some((stage) => stage?.id === task?.stage_id) ||
      !task?.stage_id
  );

  console.log("myTasks:  ", myTasks);

  if (
    isSubsciptionsLoading ||
    isTasksLoading ||
    isTeachersLoading ||
    isStagesLoading ||
    isStagesDataLoading ||
    isDoneTasksLoading
  ) {
    return <Loader message="جاري التحميل" />;
  }

  if (
    isSubsciptionsError ||
    isTasksError ||
    isTeachersError ||
    isStagesError ||
    isStagesDataError ||
    isDoneTasksError
  ) {
    return <ErrorPlaceHolder />;
  }

  if (!allTasks) {
    return <NoDataPlaceHolder message={"لا يوجد مهام حاليا"} icon={faTasks} />;
  }

  return (
    <div dir="rtl">
      <h1 className="text-3xl font-bold text-center pb-4">قائمة مهامي</h1>

      <AddNewTaskForm />

      <div className="space-y-3">
        {myTasks?.map((task) => {
          const teacher = teachersData?.find(
            (teacher) => teacher.id === task.user_id
          );
          const isDone = doneTasks?.some(
            (doneTask) => doneTask.task_id === task.id
          );
          // const stage = stagesData?.find((stage) => stage.id === task.stage_id);
          return (
            <StudentTask
              key={task.id}
              task={task}
              teacher={teacher}
              usersIds={usersIds}
              isDone={isDone}
            />
          );
        })}
      </div>
    </div>
  );
}

function AddNewTaskForm() {
  const { currentUser } = useCurrentUser();

  const { mutate: addNewTask } = useAddNewTaskMutation();
  const handleAddNewTask = (e) => {
    // TODO: add new task
    e.preventDefault();
    addNewTask({
      stage_id: null,
      user_id: currentUser?.id,
      task: e.target.task.value,
      isTeacher: false,
    });
  };
  return (
    <form
      className="flex flex-col gap-2 mb-5 border border-gray-300 bg-blue-50 w-full p-4 rounded-xl"
      dir="rtl"
      onSubmit={handleAddNewTask}
    >
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

function StudentTask({ task, teacher, usersIds, isDone }) {
  const [isChecked, setIsChecked] = React.useState(false);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    setIsChecked(isDone);
  }, [isDone]);

  const { mutate: checkTaskMutation } = useCheckTaskMutation();
  const handleCheckTask = (newChecked) => {
    setIsChecked(newChecked); // لحظي للواجهة

    checkTaskMutation({
      isChecked: newChecked,
      usersIds,
      taskId: task.id,
      studentId: currentUser?.id,
    });
  };


  return (
    <div
      className={clsx(
        "border p-3 rounded-lg",
        isChecked
          ? "bg-green-50 border-green-500 transition-colors"
          : "bg-white border-gray-300"
      )}
    >
      <div className="flex gap-2 items-center">
        {task.isTeacher ? (
          <h4>
            <span
              className={clsx(
                "font-bold transition-colors",
                isChecked ? "text-green-600" : "text-gray-600"
              )}
            >
              {teacher.gender === "male" ? "الأستاذ:" : "الأستاذة:"}{" "}
            </span>
            <span>
              {teacher?.name} - {teacher?.subject}
            </span>
          </h4>
        ) : (
          <h4
            className={clsx(
              "font-bold transition-colors",
              isChecked ? "text-green-600" : "text-gray-600"
            )}
          >
            مهمة شخصية
          </h4>
        )}
        {/* -{!stage?.name && <h3 className="font-bold"> مهمة عامة</h3>} */}
      </div>
      <hr
        className={clsx(
          "border-dashed my-2 transition-colors",
          isChecked ? "border-green-500" : "border-gray-300"
        )}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="taskCheckBox"
          id={`taskCheckBox-${task.id}`}
          className="w-4 h-4 border border-gray-300 hidden"
          checked={isChecked}
          onChange={(e) => {
            handleCheckTask(e.target.checked);
          }}
        />
        <label
          htmlFor={`taskCheckBox-${task.id}`}
          className={clsx(
            "cursor-pointer grow select-none",
            (isChecked) && "line-through"
          )}
        >
          {task.task}
        </label>
      </div>
    </div>
  );
}
