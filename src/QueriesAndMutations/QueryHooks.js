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
} from "../api/AllApiFunctions";

export const useNotificationsByUserId = (userId) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
  });
};

export const useColumnByUserId = (userId, table, column) => {
  return useQuery({
    queryKey: [column, table, userId],
    queryFn: () => getColumn(userId, table, column),
    enabled: !!userId,
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

export const useProfileByUserId = (userId) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  });
};

export const useQuestionsByExamId = (examId) => {
  return useQuery({
    queryKey: ["questions", examId],
    queryFn: () => getQuestions(examId),
    enabled: !!examId,
  });
};

export const useExamsByTeacherId = (teacherId, done) => {
  return useQuery({
    queryKey: ["exams", teacherId],
    queryFn: () => getExams(teacherId, done),
    staleTime: 5 * 60 * 1000,
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

// export const useStudentsAndRequestsByTeacherId = (teacherId) => {
//   return useQuery({
//     queryKey: ["studentsAndRequests", teacherId],
//     queryFn: () => (teacherId ? getStudentsAndRequests(teacherId) : null),
//     staleTime: 5 * 60 * 1000,
//   });
// };

export const useStudentsAndRequestsByTeacherIdAndTable = (teacherId, table) => {
  return useQuery({
    queryKey: [table, teacherId],
    queryFn: () => getStudentsAndRequests(teacherId, table),
    staleTime: 5 * 60 * 1000,
    enabled: !!teacherId && !!table,
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

export const useAnswersByStudentIdAndExamId = (studentId, examId) => {
  return useQuery({
    queryKey: ["studentAnswers", studentId, examId],
    queryFn: () => getStudentAnswers(studentId, examId),
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
