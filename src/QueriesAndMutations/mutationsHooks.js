import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptRequest,
  createNewExam,
  deleteExam,
  deleteNotification,
  deleteQuestion,
  editExamData,
  editQeustion,
  getColumn,
  handleCreateStudent,
  handleCreateTeacher,
  insertQuestion,
  joinTeacher,
  makeProfile,
  readNotification,
  register,
  removeRequest,
  saveAns,
  saveResult,
  sendNotification,
  signIn,
} from "../api/AllApiFunctions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useRegister = (isStudent) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      // 1. save type and id in profiles table
      await makeProfile(data, isStudent);

      // 2. save data in students or teachers table
      if (isStudent) {
        await handleCreateStudent(data);
      } else {
        await handleCreateTeacher(data);
      }

      toast.dismiss();
      toast.success(
        "تم إنشاء الحساب بنجاح .. تحقق من بريدك الالكتروني لتأكيد تسجيل الحساب",
        { duration: 5000 }
      );
      navigate("/");
    },
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ أثناء إنشاء الحساب، تأكد من صحة البيانات", {
        duration: 5000,
      });
    },
  });
};

export const useSignIn = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signIn,
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("مرحبا بك مجدداً");
      navigate("/");
    },
  });
};

export const useJoinTeacherMutation = (setIsJoin) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinTeacher,
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess: (teacherId) => {
      toast.dismiss();
      toast.success("تم الإرسال بنجاح، في انتظار الموافقة");
      setIsJoin(false);
      queryClient.invalidateQueries(["requests", teacherId]);
    },
  });
};

export const useRemoveRequestMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: sendNotification } = useSendNotificationMutation();
  return useMutation({
    mutationFn: removeRequest,
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess: (_, data) => {
      toast.dismiss();
      sendNotification({
        studentId: data.studentId,
        text: `تم رفض طلب انضمامك من ${data.teacherName}`,
      });
      queryClient.invalidateQueries(["students", data.teacherId]);
      queryClient.invalidateQueries(["requests", data.teacherId]);
    },
  });
};

export const useTableColumnByUserId = (studentId, column, table) => {
  return useMutation({
    mutationFn: async () => await getColumn(studentId, column, table),
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ أثناء إرسال الإشعار إلى الطالب");
    },
  });
};

export const useAcceptRequestMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: sendNotification } = useSendNotificationMutation();
  return useMutation({
    mutationFn: acceptRequest,
    onError: () => {
      toast.dismiss();
      toast.error("فشل قبول الانضمام، أعد المحاولة");
    },
    onSuccess: (data) => {
      // 👈 هنا التعديل
      toast.dismiss();
      sendNotification({
        studentId: data.studentId,
        text: `تم قبول طلب انضمامك من ${data.teacherName}`,
      });
      queryClient.invalidateQueries(["students", data.teacherId]);
      queryClient.invalidateQueries(["requests", data.teacherId]);
    },
  });
};

export const useSendNotificationMutation = () => {
  return useMutation({
    mutationFn: sendNotification,
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ أثناء إرسال الإشعار إلى الطالب");
    },
  });
};

export const useReadNotificationMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readNotification,
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ، أعد المحاولة");
    },
    onSuccess: () => {
      toast.dismiss();
      queryClient.invalidateQueries(["notifications"], userId);
    },
  });
};

export const useDeleteNotification = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ، أعد المحاولة");
    },
    onSuccess: () => {
      toast.dismiss();
      queryClient.invalidateQueries(["notifications"], userId);
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
    onSuccess: () => {
      queryClient.invalidateQueries(["questions", examId]);
    },
  });
};

export const useEditExistingQuestionMutation = (examId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editQeustion,
    onSuccess: () => {
      toast.success("تم تعديل السؤال بنجاح");
      queryClient.invalidateQueries(["questions", examId]);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تعديل السؤال");
    },
  });
};

export const useDeleteQuestionMutation = (examId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      toast.success("تم حذف السؤال بنجاح");
      queryClient.invalidateQueries(["questions", examId]);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف السؤال");
    },
  });
};

export const useCreateNewExamMutation = (setExamId) => {
  const queryClient = useQueryClient();
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
    onSuccess: ({ examId, isEdit }) => {
      if (isEdit === "publish") {
        toast.success("تم نشر الاختبار بنجاح");
      } else if (isEdit === "unPublish") {
        toast.success("تم إلغاء نشر الاختبار بنجاح");
      } else {
        toast.success("تم تعديل بيانات الاختبار بنجاح");
      }
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

export const useSaveAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveAns,
    onSuccess: (ansId) => {
      queryClient.invalidateQueries(["answer", ansId]);
    },
  });
};

export const useSaveStudentResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveResult,
    onSuccess: (studentId) => {
      toast.success("تم حفظ النتيجة بنجاح");
      queryClient.invalidateQueries(["student", studentId]);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حفظ النتيجة");
    },
  });
};
