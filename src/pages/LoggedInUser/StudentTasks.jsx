import React, { useEffect } from "react";
import { useCurrentUser, useDarkMode } from "../../store/useStore";
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
import PageWrapper from "../../components/PageWrapper";
import { useTranslation } from "react-i18next";

export default function StudentTasks() {
  const { currentUser } = useCurrentUser();
  const myId = currentUser?.id;
  const [t] = useTranslation("global");

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
    return <Loader message={t("tasks.student.studentTasks.loader")} />;
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

  return (
    <PageWrapper title={t("tasks.student.studentTasks.content.title")}>
      <div>
        <div className="mb-4">
          <h1 className="text-3xl font-bold">
            {t("tasks.student.studentTasks.content.addNewTask")}
          </h1>
        </div>

        <AddNewTaskForm />

        {allTasks.length === 0 ? (
          <NoDataPlaceHolder
            message={t("tasks.student.studentTasks.noData")}
            icon={faTasks}
          />
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-blue-400 mb-3">
              {t("tasks.student.studentTasks.content.addedTasks")}
            </h2>
            <div className="space-y-2">
              {myTasks?.map((task) => {
                const teacher = teachersData?.find(
                  (teacher) => teacher.id === task.user_id
                );
                const isDone = doneTasks?.some(
                  (doneTask) => doneTask.task_id === task.id
                );
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
          </>
        )}
      </div>
    </PageWrapper>
  );
}

function AddNewTaskForm() {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();
  const { mutate: addNewTask } = useAddNewTaskMutation();
  const [t] = useTranslation("global");

  const handleAddNewTask = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const taskInput = formdata.get("task");
    console.log({
      stage_id: null,
      user_id: currentUser?.id,
      task: formdata.value,
      isTeacher: false,
    });
    if (taskInput.trim()) {
      addNewTask({
        stage_id: null,
        user_id: currentUser?.id,
        task: taskInput,
        isTeacher: false,
      });
      e.target.reset();
    }
  };

  return (
    <div className="mb-5">
      <div>
        <div className="space-y-4">
          {/* <label
            htmlFor="task"
            className="block text-sm font-medium text-blue-500"
          >
            إضافة مهمة جديدة
          </label> */}
          <form className="flex gap-3 min-h-12" onSubmit={handleAddNewTask}>
            <input
              type="text"
              name="task"
              // id="task"
              placeholder={t(
                "tasks.student.addNewTaskForm.formInputPlaceHolder"
              )}
              className={clsx(
                "w-full px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-slate-400",
                isDarkMode ? "border-blue-500/50" : "border-slate-300"
              )}
            />
            <button className="w-max shrink-0 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg duration-200 cursor-pointer transition-colors active:bg-blue-600">
              {t("tasks.student.addNewTaskForm.addTaskButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function StudentTask({ task, teacher, usersIds, isDone }) {
  const [isChecked, setIsChecked] = React.useState(false);
  const { isDarkMode } = useDarkMode();
  const { currentUser } = useCurrentUser();
  const [t] = useTranslation("global");

  useEffect(() => {
    setIsChecked(isDone);
  }, [isDone]);

  const { mutate: checkTaskMutation } = useCheckTaskMutation();
  const handleCheckTask = (newChecked) => {
    setIsChecked(newChecked);

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
        "p-3 rounded-xl border transition-all duration-300 relative",
        isChecked
          ? isDarkMode
            ? "border-green-500/50  bg-green-500/10"
            : "border-green-300  bg-green-50"
          : isDarkMode
          ? "border-slate-800 hover:border-slate-700 hover:bg-slate-900"
          : "border-slate-200 hover:border-slate-300"
      )}
    >
      <label
        htmlFor={`taskCheckBox-${task.id}`}
        className="h-full w-full absolute left-0 top-0 cursor-pointer"
      ></label>
      <div className="flex justify-between items-center">
        <div>
          <div>
            <div className="relative">
              <input
                type="checkbox"
                id={`taskCheckBox-${task.id}`}
                className="sr-only hidden"
                checked={isChecked}
                onChange={(e) => handleCheckTask(e.target.checked)}
              />
            </div>
            <span className={clsx("font-bold", isChecked && "line-through")}>
              {task.task}
            </span>
          </div>

          {task.isTeacher ? (
            <div className="mt-0.5 space-x-1">
              <span
                className={clsx(
                  "text-sm",
                  isChecked ? "text-green-500" : "text-blue-500"
                )}
              >
                {t("tasks.student.studentTask.taskBy")}{" "}
                {teacher?.gender === "male"
                  ? t("tasks.student.studentTask.teacher.male")
                  : t("tasks.student.studentTask.teacher.female")}
                :
              </span>
              <span className="text-gray-500 text-sm">
                {teacher?.name} - {teacher?.subject}
              </span>
            </div>
          ) : (
            <p
              className={clsx(
                "text-sm mt-1",
                isChecked ? "text-green-500" : "text-blue-500"
              )}
            >
              {t("tasks.student.studentTask.personalTask")}
            </p>
          )}
        </div>

        <div
          className={clsx(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
            isChecked
              ? "bg-green-500 border-green-500 text-white"
              : "border-slate-300 group-hover:border-slate-400"
          )}
        >
          {isChecked && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
