import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  useColumnByUserId,
  useExamsByTeacherId,
  useStudentsAndRequestsByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import { faArrowLeft, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExamItemInTeacherProfile from "../../components/ExamItemInTeacherProfile";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useCurrentUser } from "../../store/useStore";
import { useJoinTeacherMutation } from "../../QueriesAndMutations/mutationsHooks";

export default function TeacherProfile() {
  const { id: teacherId } = useParams();
  const { currentUser } = useCurrentUser(); // Assuming you have a useCurrentUser hook to get the current use
  const [isJoin, setIsJoin] = React.useState(false);

  const {
    data: exams,
    isLoading: isExamsLoading,
    error: examsError,
  } = useExamsByTeacherId(teacherId, true);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(teacherId, "teachers", "stages");

  const {
    data: studentsAndRequests,
    isLoading: isStudentsAndRequestsLoading,
    error: studentsAndRequestsError,
  } = useStudentsAndRequestsByTeacherId(teacherId);

  console.log(studentsAndRequests);
  console.log(currentUser.id);

  const { mutateAsync: joinTeacher } = useJoinTeacherMutation(
    teacherId,
    setIsJoin
  );

  const handleJoinRequest = async () => {
    const requestData = [
      ...(studentsAndRequests.requests || []),
      {
        studentId: currentUser.id,
        stage: document.getElementById("stage").value,
      },
    ];
    console.log(requestData);
    toast.loading("جاري إرسال طلب انضمامك إلى المعلم");
    await joinTeacher({ teacherId, requestData });
  };

  console.log(studentsAndRequests);

  if (isStudentsAndRequestsLoading || isStagesLoading)
    return <Loader message="جري التحميل" />;

  if (studentsAndRequestsError) {
    toast.error(studentsAndRequestsError.message);
  }

  const isStudent = studentsAndRequests.students?.some(
    (student) => student.id === currentUser.id
  );
  const isRequested = studentsAndRequests.requests?.some(
    (req) => req.studentId === currentUser.id
  );

  if (!isStudent && !isRequested) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="mt-4 text-lg font-medium text-red-600">
          ليس لديك صلاحية قراءة الامتحانات الخاصة بهذا المعلم
        </p>
        <button
          onClick={() => setIsJoin(!isJoin)}
          className="p-2 px-4 mt-5 cursor-pointer rounded-lg bg-gradient-to-tl from-blue-600 to-blue-500 text-white font-bold"
        >
          أرسل طلب انضمام
        </button>
        {isJoin && (
          <div
            onClick={() => setIsJoin(false)}
            className="fixed left-1/2 top-1/2 -translate-1/2 h-screen w-screen bg-black/30 z-20 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="border-gray-300 rounded-xl border bg-white p-3 py-6"
            >
              <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-l from-green-400 to-emerald-600 text-2xl w-96">
                طلب انضمام
              </h3>
              <div dir="rtl" className="flex flex-col items-start mt-5 w-full">
                <p>اختر المرحلة الدراسية:</p>
                <select
                  className="h-10 w-full mt-2 px-3 outline-none border border-gray-300 rounded-lg"
                  name="stage"
                  id="stage"
                >
                  {stages?.map((stage, index) => (
                    <option key={index} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleJoinRequest}
                className="px-3 py-2 mt-3 bg-gradient-to-l from-blue-400 to-blue-600 text-white rounded-lg cursor-pointer"
              >
                انضمام
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isStudent && isRequested) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="mt-4 text-lg font-medium text-red-600">
          سيصلك إشعار في حال قبول أو رفض انضمامك إلى المعلم
        </p>
      </div>
    );
  }

  console.log(exams);

  if (isExamsLoading) return <Loader message="جري تحميل الامتحانات" />;

  if (examsError) {
    toast.error(examsError.message);
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-red-600">
          حدث خطأ أثناء تحميل الامتحانات الرجاء إعادة المحاولة
        </p>
        <p className="text-gray-500 text-sm mt-2">{examsError.message}</p>
      </div>
    );
  }

  if (!exams || exams.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6">
        <FontAwesomeIcon
          icon={faFileAlt}
          className="text-gray-400 text-5xl mb-4"
        />
        <p className="text-gray-600 font-medium">
          لا يوجد امتحانات متاحة حاليًا
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="py-4 text-center bg-gradient-to-r from-green-500 to-emerald-600 font-bold text-white text-xl relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faFileAlt} className="text-white" />
          </div>
          قائمة الامتحانات
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faFileAlt} className="text-white" />
          </div>
        </h1>

        <div className="p-4">
          {exams.length === 0 ? (
            <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              لا يوجد امتحانات متاحة حاليًا
            </div>
          ) : (
            <div className="space-y-3">
              {exams.map((exam) => (
                <ExamItemInTeacherProfile exam={exam} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>العودة إلى قائمة المعلمين</span>
        </Link>
      </div>
    </div>
  );
}
