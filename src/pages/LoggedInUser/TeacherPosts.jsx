import React, { useState } from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  useColumnByUserId,
  usePostsByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import Loader from "../../components/Loader";
import Folder from "../../components/Folder";
import { Outlet } from "react-router-dom";
import CreatePostForm from "../../components/CreatePostForm";
import DisplayFile from "../../components/DisplayFile";

export default function TeacherPosts() {
  const { currentUser } = useCurrentUser();

  const [fileDisplayed, setFileDisplayed] = useState(null);
  const [selectedStage, setSelectedStage] = useState("");

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useColumnByUserId(currentUser?.id, "teachers", "stages");

  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = usePostsByTeacherId(currentUser?.id);

  if (isStagesLoading || isPostsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError || postsError) {
    return (
      <ErrorPlaceHolder
        message={"حدث خطأ أثناء جلب المراحل الدراسية، أعد المحاولة"}
      />
    );
  }

  const publicPosts = posts?.filter((post) => !post.stage);

  return (
    <div className="space-y-5" dir="rtl">
      <CreatePostForm
        stages={stages}
        setFileDisplayed={setFileDisplayed}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
      />
      <div className="flex gap-5 flex-wrap justify-center">
        <div className="relative" onClick={() => setSelectedStage("")}>
          <Folder path={"جميع الصفوف"} text={`منشورات عامة`} />
          {publicPosts.length > 0 && (
            <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-3 -top-2">
              {publicPosts?.length || 0}
            </span>
          )}
        </div>
        {stages.map((stage, index) => {
          const stagePosts = posts?.filter((post) => post.stage === stage);
          return (
            <div
              className="relative"
              key={index}
              onClick={() => setSelectedStage(stage)}
            >
              <Folder key={index} path={stage} text={`منشورات ${stage}`} />
              {stagePosts.length > 0 && (
                <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-3 -top-2">
                  {stagePosts?.length || 0}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {fileDisplayed && (
        <DisplayFile file={fileDisplayed} setFileDisplayed={setFileDisplayed} />
      )}
      <Outlet />
    </div>
  );
}
