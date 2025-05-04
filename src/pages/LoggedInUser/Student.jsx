import React from "react";
import { Link } from "react-router-dom";
import { useTeachers } from "../../QueriesAndMutations/QueryHooks";
import { faChalkboardTeacher, faChevronLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/Loader";

export default function Student() {
  const {
    data: teachers,
    isLoading: isTeachersLoading,
    error: teachersError,
  } = useTeachers();


  if (isTeachersLoading) return <Loader message="جري تحميل المعلمين" />;

  if (teachersError) return <div>{teachersError.message}</div>;

  if (!teachers) return <div>لا يوجد معلمين حاليا</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <h1 className="py-4 text-center bg-gradient-to-r from-green-500 to-emerald-600 font-bold text-white text-xl">
          <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
          قائمة المعلمين
        </h1>

        <div className="p-4" dir="rtl">
          {teachers.length === 0 ? (
            <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              لا يوجد معلمين حاليًا
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teachers.map((teacher) => (
                <Link
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all flex items-center gap-3 group"
                  dir="rtl"
                  to={"/teacherProfile/" + teacher.id}
                  key={teacher.id}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-sm">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="grow">
                    <h3 className="font-medium text-gray-800 group-hover:text-green-700 transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {teacher.subject || "معلم"}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="text-gray-400 group-hover:text-green-500 transition-colors mr-2"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
