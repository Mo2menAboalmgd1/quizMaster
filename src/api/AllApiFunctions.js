import { supabase } from "../config/supabase";

export const register = async (userData) => {
  const { error, data } = await supabase.auth.signUp(userData);
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
    grade: Number(data.grade),
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
    grade: data.grade,
    email: data.email,
  });
  if (error) throw new Error(error.message);
};

export const signIn = async (userData) => {
  const { error } = await supabase.auth.signInWithPassword(userData);
  if (error) throw new Error(error.message);
};

export const getExams = async (teacherId, done) => {
  if (done) {
    const { error, data } = await supabase
      .from("exams")
      .select("*")
      .eq("teacherId", teacherId)
      .eq("done", done)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return data;
  } else {
    const { error, data } = await supabase
      .from("exams")
      .select("*")
      .eq("teacherId", teacherId);

    if (error) throw new Error(error.message);

    return data;
  }
};

export const insertQuestion = async (questionData) => {
  const { data: questionDataResponse, error: questionError } = await supabase
    .from("questions")
    .insert(questionData);

  if (questionError) throw new Error(questionError.message);

  return questionDataResponse;
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

export const editExamData = async ({ testData, examId }) => {
  const { error } = await supabase
    .from("exams")
    .update(testData)
    .eq("id", examId);

  if (error) throw new Error(error.message);

  return testData;
};

export const getQuestions = async (examId) => {
  const { error, data } = await supabase
    .from("questions")
    .select("*")
    .eq("examId", examId);

  if (error) throw new Error(error.message);

  return data;
};

export const getExam = async (examId) => {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("id", examId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getTeachers = async () => {
  const { error, data } = await supabase.from("teachers").select("*");

  if (error) throw new Error(error.message);

  return data;
};

export const deleteExam = async (examId) => {
  const { error } = await supabase.from("exams").delete().eq("id", examId);

  if (error) throw new Error(error.message);
};

export const deleteAns = async (questionId) => {
  const { error } = await supabase
    .from("studentsAnswers")
    .delete()
    .eq("questionId", questionId);

  if (error) throw new Error(error.message);
};

export const saveAns = async (ansId, answer) => {
  const { error } = await supabase.from("studentsAnswers").insert(answer);

  if (error) throw new Error(error.message);
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

export const saveAnswer = async (studentId, examId, grade, total) => {
  const { error } = await supabase
    .from("examsResults")
    .insert({ studentId, examId, grade, total });

  if (error) throw new Error(error.message);
};

export const getExamsResults = async (studentId, examId) => {
  const { data, error } = await supabase
    .from("examsResults")
    .select("*")
    .eq("studentId", studentId)
    .eq("examId", examId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};
