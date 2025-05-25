import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useCreateNewPostMutation } from "../QueriesAndMutations/mutationsHooks";
import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import { useCurrentUser } from "../store/useStore";

const MAX_IMAGE_SIZE_MB = 3;

export default function CreatePostForm({
  stages,
  setFileDisplayed,
  selectedStage,
  setSelectedStage,
}) {
  const { currentUser } = useCurrentUser();

  const [postImages, setPostImages] = useState([]);
  const [postText, setPostText] = useState("");
  const [isAddingNewPost, setIsAddingNewPost] = useState(false);

  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();
  useEffect(() => {
    setSelectedStage(stages?.[0]?.id);
  }, [stages]);

  const { mutate: createNewPost } = useCreateNewPostMutation(); // Track loading state

  const handlePublishPost = (e) => {
    e.preventDefault();

    if (!postText && postImages.length === 0) {
      toast.error("لا يمكن نشر المنشور فارغًا");
      return;
    }

    setIsAddingNewPost(true);
    createNewPost(
      {
        text: postText,
        images: postImages,
        stageId: selectedStage || null,
        teacherId: currentUser?.id,
      },
      {
        onSuccess: () => {
          toast.success("تم نشر المنشور بنجاح!");
          setPostText(""); // Clear the textarea
          setPostImages([]); // Clear the images
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
          }
          setIsAddingNewPost(false);
          queryClient.invalidateQueries(["posts", currentUser?.id]);
        },
        onError: (error) => {
          console.error("Failed to create post:", error);
          toast.error("فشل نشر المنشور. يرجى المحاولة مرة أخرى.");
          setIsAddingNewPost(false);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handlePublishPost}
      className="space-y-5 p-6 rounded-3xl shadow-xl bg-white w-full max-w-2xl border border-gray-200 mx-auto"
    >
      {/* select stage */}
      <label
        htmlFor="stage"
        className="block text-lg font-semibold text-gray-700 mb-3"
      >
        اختر المرحلة الدراسية التي سترى المنشور:
      </label>
      <div className="relative">
        <select
          name="stage"
          id="stage"
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-blue-500 shadow-sm transition-all duration-200 ease-in-out"
        >
          {stages?.map((stage, index) => (
            <option key={index} value={stage.id}>
              {stage.name}
            </option>
          ))}
          <option value="">جميع الصفوف</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* bost body and images */}
      <div>
        <div className="flex gap-4">
          <textarea
            name="postBody"
            className="w-full min-h-32 max-h-56 field-sizing-content resize-none border border-gray-300 rounded-2xl p-4 focus:border-blue-500 focus:ring-0 outline-none shadow-sm text-gray-800"
            placeholder="اكتب شيئاً..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
          <div className="flex gap-2 shrink-0">
            <label
              htmlFor="questionImage"
              className="h-10 w-10 border border-dashed border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faUpload} />
            </label>
            <input
              type="file"
              name="questionImage"
              id="questionImage"
              className="hidden"
              accept="image/*"
              ref={fileInputRef}
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);

                // Filter out files that are too large
                const validFiles = files.filter((file) => {
                  if (file.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
                    toast.error(
                      `❌ الصورة "${file.name}" أكبر من ${MAX_IMAGE_SIZE_MB}MB ولن تُرفع`
                    );
                    return false;
                  }
                  return true;
                });

                setPostImages((prev) => {
                  const newFiles = validFiles.filter(
                    (file) =>
                      !prev.some(
                        (existing) =>
                          existing.name === file.name &&
                          existing.size === file.size &&
                          existing.type === file.type
                      )
                  );

                  const total = prev.length + newFiles.length;

                  // Check if the total exceeds 4
                  if (total > 4) {
                    toast.error("لا يمكن رفع أكثر من 4 صور");
                    return prev; // Don't add anything new
                  }

                  return [...prev, ...newFiles];
                });
              }}
            />
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {postImages.map((image, index) => (
            <div key={index} className="relative group mt-2">
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => {
                  setPostImages((prev) => prev.filter((_, i) => i !== index));
                }}
                className="absolute top-1 right-1 bg-white border rounded-full w-6 h-6 text-xs flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md hover:bg-gray-100"
                title="حذف الصورة"
              >
                <FontAwesomeIcon icon={faClose} className="text-red-500" />
              </button>

              {/* Image */}
              <img
                onClick={() => {
                  setFileDisplayed(URL.createObjectURL(image));
                }}
                src={URL.createObjectURL(image)}
                alt={image.name}
                className="h-24 w-24 rounded-xl object-cover cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-200"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className="h-12 rounded-xl bg-blue-500 text-white w-full cursor-pointer hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed"
        disabled={isAddingNewPost}
      >
        {isAddingNewPost ? "جاري النشر..." : "نشر"}
      </button>
    </form>
  );
}
