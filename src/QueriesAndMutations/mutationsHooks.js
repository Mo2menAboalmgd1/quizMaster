import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewExam,
  deleteAns,
  deleteExam,
  editExamData,
  handleCreateStudent,
  handleCreateTeacher,
  insertQuestion,
  makeProfile,
  register,
  saveAns,
  saveAnswer,
  signIn,
} from "../api/AllApiFunctions";
import toast from "react-hot-toast";

export const useRegister = (isStudent) => {
  return useMutation({
    mutationFn: register,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      // 1. save type and id in profiles table
      await makeProfile(data, isStudent);

      // 2. save data in students or teachers table
      if (isStudent) {
        await handleCreateStudent(data);
      } else {
        await handleCreateTeacher(data);
      }
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useInsertQuestionMutation = (examData, examId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionData) => {
      const answersArray = questionData.allAnswers.map((ans) => ans.ans);
      const correctAnsText = questionData.allAnswers.find(
        (ans) => ans.isCorrect
      ).ans;

      await insertQuestion({
        examId: examData.id,
        text: questionData.questionText,
        answers: answersArray,
        correct: correctAnsText,
      });
    },
    // onMutate: async (questionData) => {
    //   await queryClient.cancelQueries(["questions", examId]);

    //   const previousQuestions = queryClient.getQueryData(["questions", examId]);
    //   queryClient.setQueryData(["questions", examId], (old) => {
    //     return [...old, questionData];
    //   });
    //   return { previousQuestions };
    // },
    onSuccess: () => {
      queryClient.invalidateQueries(["questions", examId]);
    },
  });
};

export const useCreateNewExamMutation = (setExamId, queryClient) => {
  return useMutation({
    mutationFn: createNewExam,
    onSuccess: (data) => {
      setExamId(data.id);
      queryClient.invalidateQueries(["exam", data.id]);
    },
  });
};

export const useEditExamDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editExamData,
    onSuccess: (_, examId) => {
      queryClient.invalidateQueries(["exam", examId]);
    },
  });
};

export const useDeleteExamMutation = (currentUserId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries(["exams", currentUserId]);
    },
  });
};

export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId }) => deleteAns(questionId),
    onSuccess: (_, { ansId }) => {
      queryClient.invalidateQueries(["answer", ansId]);
    },
  });
};

export const useSaveAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ansId, answer }) => saveAns(ansId, answer),
    onSuccess: (_, { ansId }) => {
      queryClient.invalidateQueries(["answer", ansId]);
    },
  });
};

export const useSaveStudentResult = (studentId, examId, total) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grade) => saveAnswer(studentId, examId, grade, total),
    onSuccess: () => {
      queryClient.invalidateQueries(["student", studentId]);
    },
  });
};
