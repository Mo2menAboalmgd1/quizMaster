import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptRequest,
  createNewExam,
  deleteExam,
  deleteNotification,
  deleteQuestion,
  editExamData,
  editQeustion,
  generateJoinCode,
  getColumn,
  handleCreateStudent,
  handleCreateTeacher,
  insertQuestion,
  joinTeacher,
  joinTeacherWithJoinCode,
  makeProfile,
  readNotification,
  register,
  removeRequest,
  saveAction,
  saveAns,
  saveResult,
  sendNotification,
  signIn,
  uploadQuestionImages,
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

export const useJoinTeacherWithJoinCodeMutation = (setIsJoin) => {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();
  return useMutation({
    mutationFn: joinTeacherWithJoinCode,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (teacherId) => {
      toast.success("لقد انضممت لهذه المجموعة بنجاح");
      setIsJoin(false);
      queryClient.invalidateQueries(["students", teacherId]);
    },
  });
};

export const useGenerateJoinCodeMutation = () => {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();
  return useMutation({
    mutationFn: generateJoinCode,
    onError: () => {
      toast.error("حدث خطأ أثناء إنشاء كود جديد، أعد المحاولة");
    },
    onSuccess: (teacherId) => {
      toast.success("تم إنشاء كود جديد بنجاح");
      queryClient.invalidateQueries(["joinCodes", teacherId]);
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
    mutationFn: async ({ questionText, images, allAnswers, teacherId }) => {
      // 1. رفع صور السؤال
      let uploadedQuestionImageUrls = [];
      if (images?.length > 0) {
        uploadedQuestionImageUrls = await uploadQuestionImages(
          images,
          teacherId
        );
        if (uploadedQuestionImageUrls.length === 0) {
          throw new Error("فشل رفع صور السؤال، لم يتم حفظ السؤال.");
        }
      }

      // 2. رفع صور الإجابات
      const uploadedAnswers = [];
      for (const ans of allAnswers) {
        let uploadedAnswerImage = null;

        if (ans.image instanceof File) {
          const uploaded = await uploadQuestionImages([ans.image], teacherId);

          if (uploaded.length === 0) {
            throw new Error(`فشل رفع صورة إجابة: ${ans.ans}`);
          }

          uploadedAnswerImage = uploaded[0];
        }

        uploadedAnswers.push({
          text: ans.ans,
          image: uploadedAnswerImage,
          isCorrect: ans.isCorrect, // ضروري لو هتستخدمه لاحقًا
        });
      }

      const correctAnswerObject = uploadedAnswers.find(
        (ans, i) => allAnswers[i].isCorrect
      );

      await insertQuestion({
        examId: examData.id,
        text: questionText,
        images: uploadedQuestionImageUrls,
        answers: uploadedAnswers,
        correct: correctAnswerObject, // ← بدل النص، بنحط الأوبجكت
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
    onSuccess: (allData) => {
      if (allData.isEdit === "publish") {
        saveAction({
          userId: allData.teacherId,
          action: `تم نشر اختبار ${allData.title} - ${allData.actionStage}`,
        });
      }

      if (allData.isEdit === "unPublish") {
        saveAction({
          userId: allData.teacherId,
          action: `تم إلغاء نشر اختبار ${allData.title} - ${allData.actionStage}`,
        });
      }

      if (allData.isEdit === "edit") {
        saveAction({
          userId: allData.teacherId,
          action: `تم تعديل اختبار ${allData.actionTitle} - ${allData.actionStage}`,
        });
      }

      queryClient.invalidateQueries(["exam", allData.examId]);
    },
  });
};

export const useDeleteExamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExam,
    onSuccess: (exam) => {
      toast.success("تم حذف الاختبار بنجاح");
      saveAction({
        userId: exam.teacherId,
        action: `تم حذف اختبار ${exam.title} - ${exam.actionStage}`,
      });
      queryClient.invalidateQueries(["exams", exam.teacherId]);
    },
  });
};

export const useSaveAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveAns,
    onSuccess: (qustionId) => {
      queryClient.invalidateQueries(["answer", qustionId]);
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
