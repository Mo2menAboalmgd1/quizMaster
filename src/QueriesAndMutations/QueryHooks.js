import { useQuery } from "@tanstack/react-query";
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

export const usePostsByTeacherId = (teacherId) => {
  return useQuery({
    queryKey: ["posts", teacherId],
    queryFn: () => getPosts(teacherId),
    enabled: !!teacherId,
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

export const useTeachersPosts = (teachersIds, stagesIds) => {
  return useQuery({
    queryKey: ["posts", teachersIds, stagesIds],
    queryFn: () => getPostsDisplayedInStudentPosts(teachersIds, stagesIds),
    enabled: Array.isArray(teachersIds) && teachersIds.length > 0,
  });
};

export const useExamsByTeacherId = (teacherId, isPublished) => {
  "isPublished", isPublished;
  return useQuery({
    queryKey: ["exams", teacherId, isPublished],
    queryFn: () => getExams(teacherId, isPublished),
    staleTime: 5 * 60 * 1000,
    enabled: !!teacherId,
  });
};

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

export const useJoinCodes = (teacherId) => {
  return useQuery({
    queryKey: ["joinCodes", teacherId],
    queryFn: () => getJoinCodes(teacherId),
    staleTime: 5 * 60 * 1000,
    enabled: !!teacherId,
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
