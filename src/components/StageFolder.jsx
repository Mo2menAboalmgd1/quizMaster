import { faFolder, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../store/useStore";
import { useColumnByUserId } from "../QueriesAndMutations/QueryHooks";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import Loader from "./Loader";

export default function StageFolder({ stage }) {
  const { currentUser } = useCurrentUser();

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useColumnByUserId(currentUser?.id, "teachers", "students");

  if (isStudentsLoading) return <Loader message="جاري تحميل الطلاب" />;
  if (studentsError) return <p>Error: {studentsError.message}</p>;

  const stageStudents = students?.filter((student) => student.stage === stage);

  console.log(stageStudents);

  return (
    <Link className="relative" to={`/stages/${stage}`}>
      <p className="px-2 rounded-full bg-red-600 text-white w-fit text-sm absolute -left-2 -top-2">
        {stageStudents.length}
      </p>
      <div className="p-4 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 w-fit flex items-center gap-3 group">
        <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
          <FontAwesomeIcon icon={faFolder} className="text-xl" />
        </div>
        <p className="font-medium text-gray-700 group-hover:text-gray-900">
          {stage}
        </p>
      </div>
    </Link>
  );
}
