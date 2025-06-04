import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getColumn,
  getExam,
  getExams,
  getExamResult,
  getNotifications,
  getProfile,
  getQuestions,
  getStudentAnswers,
  getStudentsAndRequests,
  getTeachers,
  getUser,
  getExamsResults,
  getRows,
  getTeachersByStudentId,
  getJoinCodes,
  getLastActions,
  getPosts,
  getPostsDisplayedInStudentPosts,
  getReactionsOnPost,
  getQuestionAnswersWithCorrection,
  getQuestionAnswersForExam,
  getResults,
  getStudentsFromStudentsIds,
  getReactionsOnPostByTeacherId,
  getReactionsOnPostByTeachersIds,
  getExamsResultsByStudentId,
  getUsersData,
  getExamsDataFromIds,
  getTeacherStages,
  getTasks,
  getTasksByUsersIds,
  getStudentStages,
  getStagesByStagesIds,
  getDoneTasks,
  getAllexams,
  getStudentPosts,
  getStudentExams,
  getSingleExamResult,
  // getData,
} from "../api/AllApiFunctions";

// export const useCommonQuery = ({
//   arguments,
//   queryKey,
//   queryFn,
//   enabled = true,
//   staleTime = 0,
// }) => {
//   return useQuery({
//     queryKey,
//     queryFn: () => queryFn(arguments),
//     enabled,
//     staleTime,
//   });
// };
/*
(
  { studentId: currentUser?.id },
  ["studentTeachers", currentUser?.id],
  getTeachersByStudentId,
  5 * 60 * 1000
)
*/

export const useNotificationsByUserId = (userId) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
  });
};

export const useLastActionsByUserId = (userId) => {
  return useQuery({
    queryKey: ["lastActions", userId],
    queryFn: () => getLastActions(userId),
    enabled: !!userId,
  });
};

export const useColumnByUserId = (userId, table, column) => {
  return useQuery({
    queryKey: [column, table, userId],
    queryFn: () => getColumn(userId, table, column),
    enabled: !!userId && !!table && !!column,
    staleTime: 5 * 60 * 1000, // 5 minu
  });
};

export const useStagesByTeacherId = (teacherId) => {
  return useQuery({
    queryKey: ["stages", teacherId],
    queryFn: () => getTeacherStages(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000, // 5 minu
  });
};

export const useStagesByStudentId = (studentId) => {
  return useQuery({
    queryKey: ["stages", studentId],
    queryFn: () => getStudentStages(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minu
  });
};

export const useStagesByStagesIds = (stagesIds) => {
  return useQuery({
    queryKey: ["stages", stagesIds],
    queryFn: () => getStagesByStagesIds(stagesIds),
    enabled: stagesIds?.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minu
  });
};

export const useAlotIfRowsInAnyTable = (teachersIds, table) => {
  return useQuery({
    queryKey: ["many-rows", table, teachersIds],
    queryFn: () => getRows(teachersIds, table),
    enabled: !!teachersIds && !!table && teachersIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minu
  });
};

export const useUserDataByUserId = (userId, table) => {
  return useQuery({
    queryKey: ["userData", userId, table],
    queryFn: () => getUser(userId, table),
    enabled: !!userId && !!table,
  });
};

export const useUserDataByUsersIdsAndKey = (usersIds, key, table) => {
  return useQuery({
    queryKey: [key, usersIds],
    queryFn: () => getUsersData(usersIds, table),
    enabled: usersIds?.length > 0,
  });
};

export const useProfileByUserId = (userId) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  });
};

export const useQuestionsByExamId = (examId, type) => {
  return useQuery({
    queryKey:
      type === "length" ? ["questionsLength", examId] : ["questions", examId],
    queryFn: () => getQuestions(examId, type),
    enabled: !!examId,
  });
};

export const useReslutsByExamId = (examId) => {
  return useQuery({
    queryKey: ["examStudents", examId],
    queryFn: () => getResults(examId),
    enabled: !!examId,
  });
};

// export const usePostsByTeacherId = (teacherId) => {
//   return useQuery({
//     queryKey: ["posts", teacherId],
//     queryFn: () => getPosts(teacherId),
//     enabled: !!teacherId,
//   });
// };

export const usePostsByTeacherId = (teacherId) => {
  return useInfiniteQuery({
    queryKey: ["posts", teacherId],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, teacherId),
    getNextPageParam: (lastPage) => {
      if (lastPage.isLastPage) return undefined;
      return lastPage.nextPage;
    },
    staleTime: Infinity,
    enabled: !!teacherId,
  });
};

export const useStudentPostsByTeacherIdAnStage = (teacherId, stageId) => {
  return useInfiniteQuery({
    queryKey: ["studentPosts", teacherId, stageId],
    queryFn: ({ pageParam = 1 }) =>
      getStudentPosts(pageParam, teacherId, stageId),
    getNextPageParam: (lastPage) => {
      if (lastPage.isLastPage) return undefined;
      return lastPage.nextPage;
    },
    staleTime: Infinity,
    enabled: !!teacherId && !!stageId,
  });
};

export const useTasksByUserId = (userId) => {
  return useQuery({
    queryKey: ["tasks", userId],
    queryFn: () => getTasks(userId),
    enabled: !!userId,
  });
};

export const useTasksByUsersIds = (usersIds) => {
  return useQuery({
    queryKey: ["tasks", usersIds],
    queryFn: () => getTasksByUsersIds(usersIds),
    enabled: usersIds.length > 0,
  });
};

export const useDoneTasksByStudentId = (studentId) => {
  return useQuery({
    queryKey: ["doneTasks", studentId],
    queryFn: () => getDoneTasks(studentId),
    enabled: !!studentId,
  });
};

export const useReactionsByPostId = (postId) => {
  return useQuery({
    queryKey: ["post_reactions", postId],
    queryFn: () => getReactionsOnPost(postId),
    enabled: !!postId,
  });
};

export const useReactionsByTeacherId = (teacherId) => {
  return useQuery({
    queryKey: ["post_reactions_teacherId", teacherId],
    queryFn: () => getReactionsOnPostByTeacherId(teacherId),
    enabled: !!teacherId,
  });
};

export const useReactionsByTeachersIds = (teachersIds) => {
  return useQuery({
    queryKey: ["post_reactions_teacherIds", teachersIds],
    queryFn: () => getReactionsOnPostByTeachersIds(teachersIds),
    enabled: teachersIds?.length > 0,
  });
};

// export const useTeachersPosts = (teachersIds, stagesIds) => {
//   return useQuery({
//     queryKey: ["posts", teachersIds, stagesIds],
//     queryFn: () => getPostsDisplayedInStudentPosts(teachersIds, stagesIds),
//     enabled: Array.isArray(teachersIds) && teachersIds.length > 0,
//   });
// };

export const useTeachersPosts = (teachersIds, stagesIds) => {
  return useInfiniteQuery({
    queryKey: ["posts", teachersIds, stagesIds],
    queryFn: ({ pageParam = 1 }) =>
      getPostsDisplayedInStudentPosts(pageParam, teachersIds, stagesIds),
    getNextPageParam: (lastPage) => {
      if (lastPage.isLastPage) return undefined;
      return lastPage.nextPage;
    },
    staleTime: Infinity,
    enabled: teachersIds?.length > 0 && stagesIds?.length > 0,
  });
};

export const useStudentExamsByteacherIdAndStagesIds = (
  teacherId,
  stagesIds
) => {
  return useInfiniteQuery({
    queryKey: ["studentExams", teacherId, stagesIds],
    queryFn: ({ pageParam = 1 }) =>
      getStudentExams(pageParam, teacherId, stagesIds),
    getNextPageParam: (lastPage) => {
      if (lastPage.isLastPage) return undefined;
      return lastPage.nextPage;
    },
    staleTime: Infinity,
    enabled: !!teacherId && stagesIds?.length > 0,
  });
};

// currentUser.id, isPublished, isTime, stageId
// export const useExamsByTeacherId = (
//   teacherId,
//   isPublished,
//   isTime,
//   stageId
// ) => {
//   return useInfiniteQuery({
//     queryKey: ["exams", teacherId, isPublished, isTime, stageId],
//     queryFn: ({ pageParam = 1 }) => {
//       getExams(teacherId, isPublished, isTime, stageId, pageParam);
//     },
//     getNextPageParam: (lastPage) => {
//       if (lastPage.isLastPage) return undefined;
//       return lastPage.nextPage;
//     },
//     staleTime: Infinity,
//     enabled:
//       !!teacherId &&
//       typeof isPublished === "boolean" &&
//       typeof isTime === "boolean" &&
//       !!stageId,
//   });
// };
// currentUser.id, isPublished, isTime, stageId
export const useExamsByTeacherId = (
  teacherId,
  isPublished,
  isTime,
  stageId
) => {
  console.log({
    teacherId,
    isPublished,
    isTime,
    stageId,
  });
  return useInfiniteQuery({
    queryKey: ["exams", teacherId, isPublished, isTime, stageId],
    queryFn: ({ pageParam = 1 }) =>
      getExams(pageParam, teacherId, isPublished, isTime, stageId),
    getNextPageParam: (lastPage) => {
      if (lastPage.isLastPage) return undefined;
      return lastPage.nextPage;
    },
    staleTime: Infinity,
    enabled:
      !!teacherId &&
      typeof isPublished === "boolean" &&
      typeof isTime === "boolean" &&
      !!stageId,
  });
};

export const useAllTeacherExams = (teacherId) => {
  return useQuery({
    queryKey: ["allExams", teacherId],
    queryFn: () => getAllexams(teacherId),
    staleTime: 5 * 60 * 1000,
    enabled: !!teacherId,
  });
};

export const useExamResultByStudentId = (examId, studentId) => {
  return useQuery({
    queryKey: ["singleExamResult", examId, studentId],
    queryFn: () => getSingleExamResult(examId, studentId),
    staleTime: 5 * 60 * 1000,
    enabled: !!studentId,
  });
};

// {
// key: [folder.path, currentUser?.id, true],
// table: "exams",
// filters: {
//   teacherId: currentUser?.id,
//   isPublished: folder.isPublished,
// },
// enabled:
//   !!currentUser?.id && typeof folder.isPublished === "boolean",
// }

// export const useFolderHasData = (query) => {
//   return useQuery({
//     queryKey: query.key,
//     queryFn: () => getData(query.table, query.filters),
//     staleTime: 5 * 60 * 1000,
//     enabled: query.enabled,
//   });
// };

/*
useFolderHasData(
    ["exam", currentUser?.id, true],
    () =>
      getData("exmas", "*", "teacherId", currentUser?.id, "isPublished", true),
    [!!currentUser?.id, typeof true === "boolean"]
  );
*/

export const useExamsDataByExamsIds = (examsIds) => {
  return useQuery({
    queryKey: ["exams", examsIds],
    queryFn: () => getExamsDataFromIds(examsIds),
    staleTime: 5 * 60 * 1000,
    enabled: examsIds?.length > 0,
  });
};

export const useExamsResultsByTeacherId = (teacherId, studentId) => {
  return useQuery({
    queryKey: ["examsResults", teacherId, studentId],
    queryFn: () => getExamsResults(teacherId, studentId),
    staleTime: 5 * 60 * 1000,
    enabled: !!teacherId && !!studentId,
  });
};

export const useExamsResultsByStudentId = (studentId) => {
  return useQuery({
    queryKey: ["examsResults", studentId],
    queryFn: () => getExamsResultsByStudentId(studentId),
    staleTime: 5 * 60 * 1000,
    enabled: !!studentId,
  });
};

export const useStudentsAndRequestsByTeacherIdAndTable = (teacherId, table) => {
  return useQuery({
    queryKey: [
      table === "teachers_students"
        ? "students"
        : table === "teachers_requests"
        ? "requests"
        : null,
      teacherId,
    ],
    queryFn: () => getStudentsAndRequests(teacherId, table),
    staleTime: 5 * 60 * 1000,
    enabled: !!teacherId && !!table,
  });
};

export const useStudentsFromStudentsIds = (studentsIds) => {
  return useQuery({
    queryKey: ["students", studentsIds],
    queryFn: () => getStudentsFromStudentsIds(studentsIds),
    staleTime: 5 * 60 * 1000,
    enabled: studentsIds?.length > 0,
  });
};

// export const useJoinCodes = (teacherId) => {
//   return useQuery({
//     queryKey: ["joinCodes", teacherId],
//     queryFn: () => getJoinCodes(teacherId),
//     staleTime: 5 * 60 * 1000,
//     enabled: !!teacherId,
//   });
// };

export const useJoinCodes = (teacherId, isPublic) => {
  return useInfiniteQuery({
    queryKey: ["joinCodes", teacherId, isPublic],
    queryFn: ({ pageParam = 1 }) =>
      getJoinCodes(pageParam, teacherId, isPublic),
    getNextPageParam: (lastPage) => {
      if (lastPage.isLastPage) return undefined;
      return lastPage.nextPage;
    },
    staleTime: Infinity,
    enabled: !!teacherId && typeof isPublic === "boolean",
  });
};

export const useTeachersFromTeachersStudents = (studentId) => {
  return useQuery({
    queryKey: ["studentTeachers", studentId],
    queryFn: () => getTeachersByStudentId(studentId),
    staleTime: 5 * 60 * 1000,
    enabled: !!studentId,
  });
};

export const useExamByItsId = (examId) => {
  return useQuery({
    queryKey: ["exam", examId],
    queryFn: () => getExam(examId),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => getTeachers(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnswersByQuestionId = (questionId, isExamResult) => {
  return useQuery({
    queryKey: ["answers", questionId, isExamResult],
    queryFn: () =>
      isExamResult
        ? getQuestionAnswersWithCorrection(questionId)
        : getQuestionAnswersForExam(questionId),
    enabled: !!questionId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnswersByStudentIdAndExamId = (studentId, examId) => {
  return useQuery({
    queryKey: ["studentAnswers", studentId, examId],
    queryFn: () => getStudentAnswers(studentId, examId),
    enabled: !!studentId && !!examId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useExamsResultsByStudentIdAndExamId = (studentId, examId) => {
  return useQuery({
    queryKey: ["studentExamResult", studentId, examId],
    queryFn: () => getExamResult(studentId, examId),
    staleTime: 5 * 60 * 1000,
    enabled: !!studentId && !!examId,
  });
};
