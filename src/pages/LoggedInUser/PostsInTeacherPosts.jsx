import React from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import {
  usePostsByTeacherId,
  useReactionsByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { PostInTeachersProfile } from "../../components/PostInTeachersProfile";

export default function PostsInTeacherPosts() {
  const { stage } = useParams();
  const { currentUser } = useCurrentUser();
  const newStage = stage === "جميع الصفوف" ? "" : stage;

  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = usePostsByTeacherId(currentUser?.id);

  const {
    data: postReactions,
    isLoading: isPostReactionsLoading,
    error: postReactionsError,
  } = useReactionsByTeacherId(currentUser?.id);

  console.log(postReactions);

  if (isPostsLoading || isPostReactionsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (postsError || postReactionsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب المنشورات أعد المحاولة"} />
    );
  }

  const stagePosts = posts.filter((post) => {
    return post.stage === newStage;
  });

  return (
    <div className="w-full flex flex-col items-center gap-5 max-w-2xl mt-8 mx-auto">
      {stagePosts.map((post, index) => (
        <PostInTeachersProfile
          key={index}
          post={post}
          reactions={postReactions}
        />
      ))}
    </div>
  );
}