import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptRequest,
  addNewLesson,
  addNewStage,
  checkTask,
  createNewExam,
  createNewLesson,
  deleteExam,
  deleteLesson,
  deleteNotification,
  deleteQuestion,
  deleteStage,
  deleteTask,
  editExamData,
  editProfile,
  editQeustion,
  generateJoinCode,
  getColumn,
  handleCreateStudent,
  handleCreateTeacher,
  insertPost,
  insertQuestion,
  insertTask,
  joinTeacher,
  joinTeacherWithJoinCode,
  makeProfile,
  reactToPost,
  readNotification,
  register,
  removeRequest,
  saveAction,
  saveAns,
  saveResult,
  sendNotification,
  signIn,
  signOut,
  unJoinTeacher,
  updateStageName,
  uploadAnswer,
  UploadImages,
} from "../api/AllApiFunctions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

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

export const useSignOut = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signOut,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      navigate("/");
    },
  });
};

export const useSignIn = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signIn,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
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

export const useUnJoinMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unJoinTeacher,
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess: ({ user, currentUser }) => {
      toast.dismiss();
      if (currentUser?.type === "teacher") {
        toast.success("تم إزالة الطالب بنجاح");
        sendNotification({
          userId: user.id,
          text: `تم طردك من قبل ${
            currentUser.gender === "male" ? "الأستاذ" : "الأستاذة"
          } ${currentUser.name}`,
        });
        queryClient.invalidateQueries(["students", currentUser.id]);
      } else {
        toast.success("لقد غادرت هذه المجموعة");
        saveAction({
          userId: user.id,
          action: `لقد غادرت مجموعة ${
            currentUser.gender === "male" ? "الأستاذ" : "الأستاذة"
          } ${user.name}`,
        });
        queryClient.invalidateQueries(["students", user.id]);
      }
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
    onSuccess: ({
      teacherId,
      teacherGender,
      teacherName,
      stage,
      value,
      studentId,
    }) => {
      // {teacherId, teacherName:teacher.name, teacherGender: teacher.gender, stage,  value}
      if (value === "directJoin") {
        toast.success("تمت إضافة الطالب بنجاح");
        sendNotification({
          userId: studentId,
          text: `تم ضمك إلى (${stage.name}) بواسطة ${
            teacherGender === "male" ? "الأستاذ" : "الأستاذة"
          } ${teacherName}`,
        });
      } else {
        toast.success("لقد انضممت لهذه المجموعة بنجاح");
      }
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
        userId: data.studentId,
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
        userId: data.studentId,
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

export const useReactToPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => reactToPost(data),
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ، أعد المحاولة");
    },
    onSuccess: (data) => {
      toast.dismiss();
      queryClient.invalidateQueries(["posts"], data.teacherId);
    },
  });
};

export const useCreateNewPostMutation = () => {
  return useMutation({
    mutationFn: async ({ action, update }) => {
      // upload question images and get their urls back
      let uploadedQuestionImageUrls = [];
      if (update.images?.length > 0) {
        uploadedQuestionImageUrls = await UploadImages(
          update.images,
          update.teacherId,
          "postsimages"
        );
        if (uploadedQuestionImageUrls.length === 0) {
          throw new Error("فشل رفع صور السؤال، لم يتم حفظ السؤال.");
        }
      }

      // upload post
      await insertPost({
        text: update.text,
        images: uploadedQuestionImageUrls,
        stage_id: update.stageId,
        teacherId: update.teacherId,
      });

      return action;
    },
    onSuccess: (action) => {
      saveAction({
        userId: action.teacherId,
        action: `تم نشر منشور جديد - ${action.stage}`,
      });
    },
  });
};

export const useAddNewTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: insertTask,
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ، أعد المحاولة");
    },
    onSuccess: (userId) => {
      toast.dismiss();
      toast.success("تم إضافة المهمة بنجاح");
      queryClient.invalidateQueries(["tasks", userId]);
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ، أعد المحاولة");
    },
    onSuccess: (userId) => {
      toast.dismiss();
      toast.success("تم حذف المهمة");
      queryClient.invalidateQueries(["tasks", userId]);
    },
  });
};

export const useCheckTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkTask,

    // ✅ التحديث اللحظي قبل إرسال الطلب
    onMutate: async ({ taskId, studentId, isChecked }) => {
      await queryClient.cancelQueries(["doneTasks", studentId]);

      const previousDoneTasks = queryClient.getQueryData([
        "doneTasks",
        studentId,
      ]);

      // ✅ التحديث المحلي (optimistic)
      queryClient.setQueryData(["doneTasks", studentId], (old = []) => {
        if (isChecked) {
          return [...old, { task_id: taskId }];
        } else {
          return old.filter((task) => task.task_id !== taskId);
        }
      });

      // 🛑 في حالة الخطأ، نحتاج rollback
      return { previousDoneTasks };
    },

    // ❌ التراجع لو حصل خطأ
    onError: (err, variables, context) => {
      toast.dismiss();
      toast.error("حدث خطأ، أعد المحاولة");

      if (context?.previousDoneTasks) {
        queryClient.setQueryData(
          ["doneTasks", variables.studentId],
          context.previousDoneTasks
        );
      }
    },

    // ✅ إعادة التحميل بعد النجاح
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries(["doneTasks", variables.studentId]);
    },
  });
};

export const useInsertQuestionMutation = (
  setQuestionText,
  setAllAnswers,
  setCorrectIndex,
  setQuestionImages,
  setAddingNewQuestionLoading
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, images, answers, exam }) => {
      // upload question images and get their urls back
      let uploadedQuestionImageUrls = [];
      if (images?.length > 0) {
        uploadedQuestionImageUrls = await UploadImages(
          images,
          exam.teacherId,
          "questionsmedia"
        );
        if (uploadedQuestionImageUrls.length === 0) {
          throw new Error("فشل رفع صور السؤال، لم يتم حفظ السؤال.");
        }
      }

      // upload question
      const questionId = await insertQuestion({
        examId: exam.id,
        text,
        images: uploadedQuestionImageUrls,
      });

      // const questionId = questionData;

      questionId;

      // upload answers
      for (const ans of answers) {
        let uploadedAnswerImage = null;

        if (ans.image instanceof File) {
          const uploaded = await UploadImages(
            [ans.image],
            exam.teacherId,
            "questionsmedia"
          );

          if (uploaded.length === 0) {
            throw new Error(`فشل رفع صورة إجابة: ${ans.ans}`);
          }

          uploadedAnswerImage = uploaded[0];
        }

        await uploadAnswer(
          ans.ans,
          uploadedAnswerImage,
          ans.isCorrect,
          exam.id,
          questionId
        );
      }

      return { examId: exam.id, questionId };
    },

    onSuccess: ({ examId }) => {
      setQuestionText("");
      setAllAnswers([]);
      setCorrectIndex(null);
      setQuestionImages([]);
      setAddingNewQuestionLoading(false);
      queryClient.invalidateQueries(["questions", examId]);
    },

    onError: async ({ questionId }) => {
      toast.dismiss();
      toast.error("حدث خطأ اثناء رفع السؤال");
      setAddingNewQuestionLoading(false);
      await supabase.from("questions").delete().eq("id", questionId);
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
    onSuccess: (examId) => {
      setExamId(examId);
      toast.dismiss();
      toast.success("تم إنشاء الاختبار بنجاح");
      queryClient.invalidateQueries(["exam", examId]);
    },
  });
};

export const useAddNewStageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addNewStage,
    onSuccess: (teacherId) => {
      queryClient.invalidateQueries(["stages", teacherId]);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
  });
};

export const useUpdateStageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStageName,
    onSuccess: (teacherId) => {
      queryClient.invalidateQueries(["stages", teacherId]);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
  });
};

export const useDeleteStageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStage,
    onSuccess: (teacherId) => {
      queryClient.invalidateQueries(["stages", teacherId]);
    },
  });
};

export const useEditExamDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editExamData,
    onSuccess: (action) => {
      toast.dismiss();

      if (action.isEdit === "publish") {
        toast.success("تم نشر الاختبار بنجاح");
        saveAction({
          userId: action.teacherId,
          action: `تم نشر اختبار ${action.title} - ${action.stage}`,
        });
      }

      if (action.isEdit === "unPublish") {
        toast.success("تم إلغاء نشر الاختبار بنجاح");
        saveAction({
          userId: action.teacherId,
          action: `تم إلغاء نشر اختبار ${action.title} - ${action.stage}`,
        });
      }

      if (action.isEdit === "edit") {
        toast.success("تم تعديل الاختبار بنجاح");
        saveAction({
          userId: action.teacherId,
          action: `تم تعديل اختبار ${action.title} - ${action.stage}`,
        });
      }

      if (action.isEdit === "showCorrection") {
        toast.success("تم إظهار الاجابات الصحيحة للاختبار بنجاح");
        saveAction({
          userId: action.teacherId,
          action: `تم إظهار الاجابات الصحيحة لإختبار ${action.title} - ${action.stage}`,
        });
      }

      if (action.isEdit === "hideCorrection") {
        toast.success("تم إخفاء الاجابات الصحيحة للاختبار بنجاح");
        saveAction({
          userId: action.teacherId,
          action: `تم إخفاء الاجابات الصحيحة لإختبار ${action.title} - ${action.stage}`,
        });
      }

      queryClient.invalidateQueries(["exam", action.examId]);
    },
  });
};

export const useEditUserdataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editProfile,
    onSuccess: async ({ update, action }) => {
      toast.success("تم تعديل البيانات بنجاح");
      saveAction({
        userId: action.userId,
        action: `قمت بتعديل بياناتك الشخصية`,
      });
      queryClient.invalidateQueries(["userData", action.userId, update.table]);
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
      toast.dismiss();
      toast.success("تم حفظ النتيجة");
      queryClient.invalidateQueries(["student", studentId]);
    },
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ أثناء حفظ النتيجة");
    },
  });
};

export const useAddNewLessonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addNewLesson,
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(
        `تم إنشاء ${data.type === "folder" ? "مجلد" : "لينك لـ"} ${data.title}`
      );
      queryClient.invalidateQueries(["lessons", data.teacherId]);
    },
    onError: () => {
      toast.dismiss();
      toast.error("حدث خطأ أعد المحاولة");
    },
  });
};

export const useDeleteLessonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLesson,
    onError: () => {
      toast.error("حدث خطأ، أعد المحاولة");
    },
    onSuccess: (teacherId) => {
      queryClient.invalidateQueries(["lessons"], teacherId);
    },
  });
};

export const useCreateNewLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewLesson,
    onError: () => {
      toast.error("حدث خطأ، أعد المحاولة");
    },
    onSuccess: (teacherId) => {
      queryClient.invalidateQueries(["lessons"], teacherId);
    },
  });
};
