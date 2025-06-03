import React from "react";
import Folder from "../../components/Folder";
import { Outlet } from "react-router-dom";
// import { useCurrentUser } from "../../store/useStore";
import PageWrapper from "../../components/PageWrapper";

export default function Exams() {
  // const { currentUser } = useCurrentUser();

  const statesFolders = [
    {
      id: 1,
      path: "unPublished",
      text: "الاختبارات الغير منشورة",
      isPublished: false,
    },
    {
      id: 2,
      path: "published",
      text: "الاختبارات المنشورة",
      isPublished: true,
    },
  ];

  return (
    <PageWrapper title={"الاختبارات"}>
      <div className="flex items-center justify-center flex-wrap gap-5 p-5 pt-0">
        {statesFolders.map((folder) => {
          return (
            <Folder
              key={folder.id}
              path={folder.path}
              text={folder.text}
              isSmall
            />
          );
        })}
      </div>
      <Outlet />
    </PageWrapper>
  );
}
