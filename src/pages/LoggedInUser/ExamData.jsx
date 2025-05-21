import React from "react";
import { Outlet } from "react-router-dom";
import Folder from "../../components/Folder";

export default function ExamData() {
  return (
    <div>
      <div className="flex gap-5 justify-center flex-wrap pb-5">
        <Folder path={""} text={"درجات الطلاب"} isEnd/>
        <Folder path={"didNotTakeExam"} text={"المتخلفين عن الامتحان"} />
      </div>
      <Outlet />
    </div>
  );
}
