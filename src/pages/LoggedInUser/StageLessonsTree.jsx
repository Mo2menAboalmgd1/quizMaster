import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useLessonsByTeacherIdAndStageId } from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import Loader from "../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faEdit,
  faFolder,
  faLink,
  faFolderPlus,
  faTrash,
  faFolderMinus,
} from "@fortawesome/free-solid-svg-icons";
import {
  useCreateNewLesson,
  useDeleteLessonMutation,
} from "../../QueriesAndMutations/mutationsHooks";

export default function StageLessonsTree() {
  const { id: stageId } = useParams();
  const { currentUser } = useCurrentUser();

  const [showAddNewFolder, setShowAddNewFolder] = useState(false);

  const {
    data: lessons,
    isLoading: isLessonsLoading,
    error: lessonsError,
  } = useLessonsByTeacherIdAndStageId(currentUser?.id, stageId);

  const { mutate: deleteFolder } = useDeleteLessonMutation();
  function handleDeleteFolder(lessonId, teacherId) {
    deleteFolder({ lessonId, teacherId });
  }

  const { mutate: createNewFolder } = useCreateNewLesson();
  function handleAddNewFolder(data) {
    createNewFolder(data);
  }

  if (isLessonsLoading) {
    return <Loader />;
  }

  if (lessonsError) {
    return <ErrorPlaceHolder />;
  }

  const stageLessons = lessons.filter((lesson) => !lesson.parent_id);

  return (
    <div className="flex flex-col gap-2 mt-5">
      {stageLessons.length === 0 ? (
        <div>
          <NoDataPlaceHolder
            message={"لا يوجد أي محتوى تعليمي إلى الآن"}
            icon={faFolderMinus}
          />
        </div>
      ) : (
        stageLessons?.map((lesson) => {
          const folderChildren = lessons.filter(
            (child) => child.parent_id === lesson.id
          );
          if (lesson.type === "folder") {
            return (
              <ContentFile
                key={lesson.id}
                lesson={lesson}
                lessons={lessons}
                children={folderChildren}
                handleAddNewFolder={handleAddNewFolder}
                handleDeleteFolder={handleDeleteFolder}
              />
            );
          } else {
            <ContentLink key={lesson.id} lesson={lesson} />;
          }
        })
      )}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setShowAddNewFolder(true)}
          className="bg-blue-600 text-white rounded-lg py-1 px-3 flex gap-2 items-center cursor-pointer hover:bg-blue-700"
        >
          <span>add new folder</span>
          <span>
            <FontAwesomeIcon icon={faFolderPlus} />
          </span>
        </button>
        {/* <button className="bg-blue-600 text-white rounded-lg py-1 px-3 flex gap-2 items-center cursor-pointer hover:bg-blue-700">
          <span>add new link</span>
          <span>
            <FontAwesomeIcon icon={faLink} />
          </span>
        </button> */}
      </div>
      {showAddNewFolder && (
        <CreateNewFolderPopUp
          handleAddNewFolder={handleAddNewFolder}
          parentId={null}
          teacherId={currentUser?.id}
          stageId={stageId}
          setShowAddNewFolder={setShowAddNewFolder}
        />
      )}
    </div>
  );
}

function ContentFile({
  lesson,
  lessons,
  children,
  handleAddNewFolder,
  handleDeleteFolder,
}) {
  const [showChildren, setShowChildren] = useState(false);
  const [showAddNewFolder, setShowAddNewFolder] = useState(false);
  const [showAddNewLink, setShowAddNewLink] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const menuRef = useRef(null);

  const handleShowContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.pageX, y: e.pageY });
    setShowMenu(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // لو الضغط حصل بره القايمة، اقفلها
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 items-start">
      <button
        onContextMenu={handleShowContextMenu}
        onClick={() => setShowChildren((prev) => !prev)}
        className="cursor-pointer border border-gray-100 hover:bg-gray-100 p-1 px-3 rounded-lg flex gap-2 items-center"
      >
        <FontAwesomeIcon icon={faFolder} className="text-gray-600" />
        <span>{lesson.title}</span>
        {children.length > 0 && (
          <FontAwesomeIcon
            icon={showChildren ? faAngleUp : faAngleDown}
            className="text-gray-600"
          />
        )}
      </button>
      {children.length > 0 && showChildren && (
        <div className="ms-10 flex flex-col gap-2">
          {children.map((child) => {
            const subFolders = lessons.filter(
              (lesson) => lesson.parent_id === child.id
            );
            if (child.type === "folder") {
              return (
                <ContentFile
                  key={child.id}
                  lesson={child}
                  children={subFolders}
                  lessons={lessons}
                  handleAddNewFolder={handleAddNewFolder}
                  handleDeleteFolder={handleDeleteFolder}
                />
              );
            } else {
              return <ContentLink key={child.id} lesson={child} />;
            }
          })}
        </div>
      )}
      {showMenu && (
        <div
          ref={menuRef}
          className="flex flex-col gap-2 items-start absolute bg-white shadow-xl border rounded p-2 space-y-1"
          style={{ top: position.y, left: position.x, zIndex: 1000 }}
          onClick={() => setShowMenu(false)}
        >
          <button
            onClick={() => handleDeleteFolder(lesson.id, lesson.teacher_id)}
            className="flex gap-2 items-center p-1 hover:bg-gray-100 w-full cursor-pointer px-2 rounded-md"
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="text-red-600"
              size="sm"
            />
            <span>حذف المجلد</span>
          </button>
          <button className="flex gap-2 items-center p-1 hover:bg-gray-100 w-full cursor-pointer px-2 rounded-md">
            <FontAwesomeIcon
              icon={faEdit}
              className="text-blue-600"
              size="sm"
            />
            <span>تعديل اسم المجلد</span>
          </button>
          <button
            onClick={() => setShowAddNewFolder(true)}
            className="flex gap-2 items-center p-1 hover:bg-gray-100 w-full cursor-pointer px-2 rounded-md"
          >
            <FontAwesomeIcon
              icon={faFolderPlus}
              className="text-blue-600"
              size="sm"
            />
            <span>أضافة مجلد فرعي</span>
          </button>
          <button
            onClick={() => setShowAddNewLink(true)}
            className="flex gap-2 items-center p-1 hover:bg-gray-100 w-full cursor-pointer px-2 rounded-md"
          >
            <FontAwesomeIcon
              icon={faLink}
              className="text-blue-600"
              size="sm"
            />
            <span>أضافة لينك</span>
          </button>
        </div>
      )}
      {showAddNewFolder && (
        <CreateNewFolderPopUp
          handleAddNewFolder={handleAddNewFolder}
          parentId={lesson.id}
          teacherId={lesson.teacher_id}
          stageId={lesson.stage_id}
          setShowAddNewFolder={setShowAddNewFolder}
        />
      )}
      {showAddNewLink && (
        <CreateNewLinkPopUp
          handleAddNewLink={handleAddNewFolder}
          parentId={lesson.id}
          teacherId={lesson.teacher_id}
          stageId={lesson.stage_id}
          setShowAddNewLink={setShowAddNewLink}
        />
      )}
    </div>
  );
}

function ContentLink({ lesson }) {
  return (
    <a
      href={lesson.content}
      target="_blank"
      className="cursor-pointer border border-blue-100 hover:bg-gray-100 p-1 px-3 rounded-lg flex gap-2 items-center"
    >
      <FontAwesomeIcon icon={faLink} className="text-gray-600" />
      <span className="underline text-blue-600">{lesson.title}</span>
    </a>
  );
}

function CreateNewFolderPopUp({
  handleAddNewFolder,
  parentId,
  teacherId,
  stageId,
  setShowAddNewFolder,
}) {
  return (
    <div
      onClick={() => setShowAddNewFolder(false)}
      className="fixed inset-0 h-screen w-screen bg-black/50 flex items-center justify-center"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const folderName = e.target.folderName.value;
          handleAddNewFolder({
            parentId,
            teacherId,
            stageId,
            title: folderName,
            type: "folder",
          });
          setShowAddNewFolder(false);
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-4 rounded-lg flex flex-col gap-3"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="folderName">اسم المجلد:</label>
          <input
            type="text"
            name="folderName"
            id="folderName"
            placeholder="مثال: الوحدة الأولى"
            autoFocus
            className="border border-gray-300 rounded-lg h-10 w-96 px-3"
          />
        </div>
        <button className="bg-blue-600 text-white rounded-lg py-2 px-3 flex gap-2 items-center justify-center cursor-pointer hover:bg-blue-700">
          تأكيد الإضافة
        </button>
      </form>
    </div>
  );
}

function CreateNewLinkPopUp({
  handleAddNewLink,
  parentId,
  teacherId,
  stageId,
  setShowAddNewLink,
}) {
  return (
    <div
      onClick={() => setShowAddNewLink(false)}
      className="fixed inset-0 h-screen w-screen bg-black/50 flex items-center justify-center"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const linkName = e.target.linkName.value;
          const linkValue = e.target.linkValue.value;
          handleAddNewLink({
            parentId,
            teacherId,
            stageId,
            title: linkName,
            type: "link",
            content: linkValue,
          });
          setShowAddNewLink(false);
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-4 rounded-lg flex flex-col gap-3"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="linkName">الاسم</label>
          <input
            type="text"
            name="linkName"
            id="linkName"
            placeholder="مثال: الدرس الأول: الدعامة في النابات"
            autoFocus
            className="border border-gray-300 rounded-lg h-10 w-96 px-3"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="linkValue">الرابط:</label>
          <input
            type="text"
            name="linkValue"
            id="linkValue"
            placeholder="https://youtu.be/ybwfLD6rJyA?si=4HkBl2cHoRcqCmrj"
            autoFocus
            className="border border-gray-300 rounded-lg h-10 w-96 px-3"
          />
        </div>
        <button className="bg-blue-600 text-white rounded-lg py-2 px-3 flex gap-2 items-center justify-center cursor-pointer hover:bg-blue-700">
          تأكيد الإضافة
        </button>
      </form>
    </div>
  );
}

/*
<button >
  <FontAwesomeIcon icon={faTrash} className="text-red-600" size="sm" />
</button>
<button >
  <FontAwesomeIcon icon={faEdit} className="text-blue-600" size="sm" />
</button>
<button >
  <FontAwesomeIcon icon={faFolderPlus} className="text-blue-600" size="sm" />
</button>
<button >
  <FontAwesomeIcon icon={faLink} className="text-blue-600" size="sm" />
</button>
*/
