import React from "react";
import { useCurrentUser } from "../store/useStore";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateNewExamMutation,
  useEditExamDataMutation,
} from "../QueriesAndMutations/mutationsHooks";
import { useQuestionsByExamId } from "../QueriesAndMutations/QueryHooks";
import toast from "react-hot-toast";
import { faBook, faChevronDown, faEdit, faGraduationCap, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CreateExamForm({
  examData,
  examId,
  setExamId,
  isCreate,
}) {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  console.log(examData);

  const { mutate: newExamMutation } = useCreateNewExamMutation(
    setExamId,
    queryClient
  );

  const { mutate: editExamMutation } = useEditExamDataMutation(
    examId,
    queryClient
  );

  const handleCreateNewExam = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const testData = {
      subject: currentUser.subject,
      title: formData.get("examName"),
      grade: Number(formData.get("examGrade")),
      teacherId: currentUser.id,
    };
    if (!testData.title || !testData.grade) return;
    newExamMutation(testData);
  };

  const handleEditExam = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const testData = {
      title: formData.get("examName"),
      grade: Number(formData.get("examGrade")),
      teacherId: currentUser.id,
    };
    editExamMutation({ testData, examId: examData.id });
  };

  const { data } = useQuestionsByExamId(examId);
  const { mutateAsync: publishExamMutation } = useEditExamDataMutation(
    examId,
    queryClient
  );

  const handlePublishExam = async () => {
    console.log(data);
    if (!data || data.length < 1) {
      return toast.error("لا يوجد أسئلة في الاختبار");
    }

    const testData = {
      done: true,
    };

    await publishExamMutation({ testData, examId: examData.id });
    toast.success("تم نشر الاختبار بنجاح");
  };

  return (
    <form
      onSubmit={
        isCreate
          ? examData
            ? handleEditExam
            : handleCreateNewExam
          : handleEditExam
      }
      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg flex flex-col gap-4 items-center p-6 relative shadow-sm w-full"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

      <p className="py-2 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center font-bold text-lg rounded-lg shadow-sm">
        {isCreate ? "إنشاء" : "تعديل"} اختبار {currentUser.subject}
      </p>

      <div className="w-full space-y-4">
        <div className="relative">
          <input
            className="text-center h-12 border border-gray-300 bg-white w-full rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm"
            name="examName"
            type="text"
            placeholder="اسم الاختبار"
            defaultValue={examData ? examData.title : ""}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faBook} className="text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <select
            name="examGrade"
            id="examGrade"
            defaultValue={examData ? examData.grade : ""}
            className="text-center h-12 border border-gray-300 bg-white w-full rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm appearance-none"
          >
            <optgroup label="المرحلة الإعدادية">
              <option value="7">الصف الأول الاعدادي</option>
              <option value="8">الصف الثاني الاعدادي</option>
              <option value="9">الصف الثالث الاعدادي</option>
            </optgroup>
            <optgroup label="المرحلة الثانوية">
              <option value="10">الصف الأول الثانوي</option>
              <option value="11">الصف الثاني الثانوي</option>
              <option value="12">الصف الثالث الثانوي</option>
            </optgroup>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faGraduationCap} className="text-gray-400" />
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-full mt-2">
        <button className="py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center font-bold rounded-lg shadow-sm w-full transition-all flex items-center justify-center gap-2">
          <FontAwesomeIcon
            icon={isCreate ? (examData ? faEdit : faPlus) : faEdit}
          />
          {isCreate ? (examData ? "تعديل" : "إنشاء") : "تعديل"}
        </button>

        {examData && (
          <button
            onClick={handlePublishExam}
            type="button"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faUpload} />
            نشر الاختبار
          </button>
        )}
      </div>
    </form>
  );
}
