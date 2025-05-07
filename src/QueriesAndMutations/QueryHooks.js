import { useQuery } from "@tanstack/react-query";
import {
  getColumn,
  getExam,
  getExams,
  getExamsResults,
  getNotifications,
  getQuestions,
  getStudent,
  getStudentAnswers,
  getStudentsAndRequests,
  getTeachers,
  getUser,
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

export const useUserDataByUserId = (userId, table) => {
  return useQuery({
    queryKey: ["userData", userId],
    queryFn: () => getUser(userId, table),
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

export const useStudentsAndRequestsByTeacherId = (teacherId) => {
  return useQuery({
    queryKey: ["studentsAndRequests", teacherId],
    queryFn: () => (teacherId ? getStudentsAndRequests(teacherId) : null),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRequestByRequestId = (teacherId, studentId) => {
  return useQuery({
    queryKey: ["request", studentId, teacherId],
    queryFn: () => getStudent(studentId),
    staleTime: 5 * 60 * 1000,
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
    queryFn: () => getExamsResults(studentId, examId),
    staleTime: 5 * 60 * 1000,
  });
};
