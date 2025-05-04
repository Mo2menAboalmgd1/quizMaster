import { useQuery } from "@tanstack/react-query";
import {
  getExam,
  getExams,
  getExamsResults,
  getQuestions,
  getStudentAnswers,
  getTeachers,
} from "../api/AllApiFunctions";

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
