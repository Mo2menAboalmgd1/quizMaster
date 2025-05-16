import { supabase } from "../config/supabase";

export const register = async (userData) => {
  const { error, data } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });
  if (error) throw new Error(error.message);
  return { ...userData, id: data.user.id };
};

export const makeProfile = async (data, isStudent) => {
  await supabase.from("profiles").insert({
    id: data.id,
    type: isStudent ? "student" : "teacher",
  });
};

export const handleCreateStudent = async (data) => {
  const { error } = await supabase.from("students").insert({
    id: data.id,
    type: "student",
    name: data.name,
    userName: data.userName,
    gender: data.gender,
    phoneNumber: data.phoneNumber,
    email: data.email,
  });
  if (error) throw new Error(error.message);
};
export const handleCreateTeacher = async (data) => {
  const { error } = await supabase.from("teachers").insert({
    id: data.id,
    type: "teacher",
    name: data.name,
    userName: data.userName,
    gender: data.gender,
    subject: data.subject,
    phoneNumber: data.phoneNumber,
    stages: data.stages,
    email: data.email,
  });
  if (error) throw new Error(error.message);
};

export const signIn = async (userData) => {
  const { error } = await supabase.auth.signInWithPassword(userData);
  if (error) throw new Error(error.message);
};

export const sendNotification = async (notificationData) => {
  const { error } = await supabase.from("notifications").insert({
    userId: notificationData.userId,
    text: notificationData.text,
  });

  if (error) throw new Error(error.message);
};

export const getLastActions = async (userId) => {
  const { error, data } = await supabase
    .from("lastActions")
    .select("*")
    .eq("userId", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const saveAction = async (actionData) => {
  const { error } = await supabase.from("lastActions").insert(actionData);

  if (error) throw new Error(error.message);
};

export const getNotifications = async (userId) => {
  const { error, data } = await supabase
    .from("notifications")
    .select("*")
    .eq("userId", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const readNotification = async (notificationId) => {
  const { error } = await supabase
    .from("notifications")
    .update({ isRead: true })
    .eq("id", notificationId);

  if (error) throw new Error(error.message);
};

export const deleteNotification = async (notificationId) => {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) throw new Error(error.message);
};

export const joinTeacher = async ({ teacherId, stage, studentId }) => {
  const { error } = await supabase
    .from("teachers_requests")
    .insert({ teacherId, stage, studentId });

  if (error) throw new Error(error.message);

  return teacherId;
};

export const joinTeacherWithJoinCode = async ({
  value,
  teacherId,
  stage,
  studentId,
}) => {
  // get all codes
  const { error: getCodeError, data: code } = await supabase
    .from("join_codes")
    .select("*")
    .eq("value", value)
    .maybeSingle();

  if (getCodeError) throw new Error(getCodeError.message);
  if (!code) throw new Error("كود الانضمام غير موجود");

  const isPublic = code.isPublic;
  const isUsed = code.isUsed;

  if (isUsed) {
    throw new Error(
      isPublic ? "تم إيقاف هذا الكود" : "كود الانضمام مستخدم من قبل"
    );
  }

  // check stage if only code.stage exists
  if (code.stage && code.stage !== stage) {
    throw new Error("كود الانضمام غير متوافق مع المرحلة");
  }

  // add student
  const { error: addStudentError } = await supabase
    .from("teachers_students")
    .insert({
      teacherId,
      studentId,
      stage: stage || code.stage,
    });

  if (addStudentError) throw new Error(addStudentError.message);

  // if private code: delete it after use
  if (!isPublic) {
    const { error: updateCodeError } = await supabase
      .from("join_codes")
      .delete()
      .eq("id", code.id);

    if (updateCodeError) throw new Error(updateCodeError.message);
  }

  return teacherId;
};

export const removeRequest = async ({ teacherId, teacherName, studentId }) => {
  const { error } = await supabase
    .from("teachers_requests")
    .delete()
    .eq("teacherId", teacherId)
    .eq("studentId", studentId);

  if (error) throw new Error(error.message);

  // لازم ترجعهم عشان onSuccess تلاقيهم
  return { teacherId, teacherName, studentId };
};

export const acceptRequest = async ({
  teacherId,
  teacherName,
  stage,
  studentId,
}) => {
  // 1️⃣
  const { error: teacherError } = await supabase
    .from("teachers_requests")
    .delete()
    .eq("teacherId", teacherId)
    .eq("studentId", studentId);

  if (teacherError) throw new Error(teacherError.message);

  // 2️⃣
  const { error: studentFetchError } = await supabase
    .from("teachers_students")
    .insert({ teacherId, studentId, stage });

  if (studentFetchError) throw new Error(studentFetchError.message);

  // ✅ رجع البيانات للاستخدام في onSuccess
  return { teacherId, teacherName, studentId };
};

export const getColumn = async (userId, table, column) => {
  const { error, data } = await supabase
    .from(table)
    .select(column)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data[column];
};

export const getRows = async (teachersIds, table) => {
  const { error, data } = await supabase
    .from(table)
    .select("*")
    .in("id", teachersIds);

  if (error) throw new Error(error.message);

  return data;
};

export const getStudent = async (studentId) => {
  const { error, data } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

export const getUser = async (userId, table) => {
  const { error, data } = await supabase
    .from(table)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

export const getProfile = async (userId) => {
  const { error, data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

export const getExams = async (teacherId, done) => {
  if (done) {
    const { error, data } = await supabase
      .from("exams")
      .select("*")
      .eq("teacherId", teacherId)
      .eq("done", done)
      .eq("isDeleted", false)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return data;
  } else {
    const { error, data } = await supabase
      .from("exams")
      .select("*")
      .eq("teacherId", teacherId)
      .eq("isDeleted", false)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return data;
  }
};

// export const getStudentsAndRequests = async (teacherId) => {
//   const { error, data } = await supabase
//     .from("teachers")
//     .select("students, requests")
//     .eq("id", teacherId)
//     .maybeSingle();

//   if (error) throw new Error(error.message);

//   return data; // رجع بس الأراي مش الأوبجكت كله
// };

export const getStudentsAndRequests = async (teacherId, table) => {
  const { error, data } = await supabase
    .from(table)
    .select("*")
    .eq("teacherId", teacherId);

  if (error) throw new Error(error.message);

  return data;
};

export const getJoinCodes = async (teacherId) => {
  const { error, data } = await supabase
    .from("join_codes")
    .select("*")
    .eq("teacherId", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const generateJoinCode = async (joinCodeObject) => {
  const { error } = await supabase.from("join_codes").insert(joinCodeObject);

  if (error) throw new Error(error.message);

  return joinCodeObject.teacherId;
};

export const getTeachersByStudentId = async (studentId, table) => {
  const { error, data } = await supabase
    .from(table)
    .select("*")
    .eq("studentId", studentId);

  if (error) throw new Error(error.message);

  return data;
};

export const insertQuestion = async (questionData) => {
  console.log(questionData);
  const { data: questionDataResponse, error: questionError } = await supabase
    .from("questions")
    .insert(questionData);

  if (questionError) throw new Error(questionError.message);

  return questionDataResponse;
};

export const uploadQuestionImages = async (images, teacherId) => {
  const uploadedUrls = [];

  for (const image of images) {
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}-${image.name}`;
    const imgPath = `${teacherId}/questions/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from("questionsmedia")
      .upload(imgPath, image);

    if (uploadError) {
      console.error("❌ فشل رفع الصورة:", image.name, uploadError.message);
      throw new Error(`فشل رفع الصورة: ${image.name}`);
    }

    const { data: urlData } = supabase.storage
      .from("questionsmedia")
      .getPublicUrl(imgPath);

    uploadedUrls.push(urlData.publicUrl);
  }

  return uploadedUrls;
};

export const editQeustion = async ({
  editedQuestion,
  editedAnswers,
  questionId,
}) => {
  const answers = editedAnswers.map((ans) => ans.text);
  const correct = editedAnswers.find((ans) => ans.isCorrect).text;
  const text = editedQuestion;
  const newAnswerObj = { answers, correct, text };

  const { error: questionError } = await supabase
    .from("questions")
    .update(newAnswerObj)
    .eq("id", questionId);

  if (questionError) throw new Error(questionError.message);
};

export const deleteQuestion = async (questionId) => {
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  if (error) throw new Error(error.message);
};

export const createNewExam = async (testData) => {
  const { data, error } = await supabase
    .from("exams")
    .insert(testData)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const editExamData = async (allData) => {
  const { error } = await supabase
    .from("exams")
    .update({
      teacherId: allData.teacherId,
      title: allData.title,
      stage: allData.stage,
      subject: allData.subject,
      done: allData.done,
    })
    .eq("id", allData.examId);

  if (error) throw new Error(error.message);

  return allData;
};

export const getQuestions = async (examId) => {
  const { error, data } = await supabase
    .from("questions")
    .select("*")
    .eq("examId", examId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const getExam = async (examId) => {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("id", examId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

export const getTeachers = async () => {
  const { error, data } = await supabase.from("teachers").select("*");

  if (error) throw new Error(error.message);

  return data;
};

export const deleteExam = async (exam) => {
  if (exam.isDeleteWithResults) {
    // delete exam and results
    const { error } = await supabase.from("exams").delete().eq("id", exam.id);
    if (error) throw new Error(error.message);
  } else {
    // delete exam only
    const { error } = await supabase
      .from("exams")
      .update({ isDeleted: true })
      .eq("id", exam.id);

    if (error) throw new Error(error.message);

    const { error: deleteAnswersError } = await supabase
      .from("studentsAnswers")
      .delete()
      .eq("examId", exam.id);

    if (deleteAnswersError) throw new Error(deleteAnswersError.message);
  }

  return exam;
};

export const saveAns = async (answer) => {
  const { error: deleteAnswersError } = await supabase
    .from("studentsAnswers")
    .delete()
    .eq("studentId", answer.studentId)
    .eq("questionId", answer.questionId);

  if (deleteAnswersError) throw new Error(deleteAnswersError.message);

  const { error } = await supabase.from("studentsAnswers").insert(answer);

  if (error) throw new Error(error.message);

  return answer.questionId;
};

export const getStudentAnswers = async (studentId, examId) => {
  const { error, data } = await supabase
    .from("studentsAnswers")
    .select("*")
    .eq("studentId", studentId)
    .eq("examId", examId);

  if (error) throw new Error(error.message);

  return data;
};

export const saveResult = async (result) => {
  const { error } = await supabase.from("examsResults").insert(result);
  // studentId: currentUser.id,
  // teacherId: examData.teacherId,
  // examId,
  // grade: correctAnswers,
  // total: questions.length,
  // correct: correctAnswers,
  // wrong: wrongAnswers,
  // notAnswered,

  if (error) throw new Error(error.message);

  return result.studentId;
};

export const getExamResult = async (studentId, examId) => {
  // console.log("Querying examsResults with:", { studentId, examId });
  const { data, error } = await supabase
    .from("examsResults")
    .select("*")
    .eq("studentId", studentId)
    .eq("examId", examId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

export const getExamsResults = async (teacherId, studentId) => {
  const { data, error } = await supabase
    .from("examsResults")
    .select("*")
    .eq("teacherId", teacherId)
    .eq("studentId", studentId);

  if (error) throw new Error(error.message);
  return data;
};
