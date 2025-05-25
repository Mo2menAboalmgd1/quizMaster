import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  useStagesByTeacherId,
  useStudentsAndRequestsByTeacherIdAndTable,
} from "../../QueriesAndMutations/QueryHooks";
import Folder from "../../components/Folder";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faEdit,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  useAddNewStageMutation,
  useDeleteStageMutation,
  useUpdateStageMutation,
} from "../../QueriesAndMutations/mutationsHooks";
import AlertBox from "../../components/AlertBox";
import clsx from "clsx";

export default function Stages() {
  const { currentUser } = useCurrentUser();

  const [isEdit, setIsEdit] = useState(false);
  const [isNewStage, setIsNewStage] = useState(false);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
    );
  
  console.log("students", students);

  useEffect(() => {
    if (stages?.length === 0) {
      setIsEdit(false);
    }
  }, [stages]);


  if (isStagesLoading || isStudentsLoading) {
    return <Loader message="جاري تحميل المراحل الدراسية" />;
  }
  if (stagesError || studentsError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب المراحل الدراسية يُرجى إعادة المحاولة" />
    );
  }

  return (
    <div className="flex flex-col items-center gap-5" dir="rtl">
      {stages?.length === 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsNewStage(true)}
            className="space-x-2 py-2 px-5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold cursor-pointer hover:opacity-85 transition-opacity active:opacity-100"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>إضافة مجموعة جديدة</span>
          </button>
        </div>
      )}
      {!isEdit && (
        <div>
          <div className="flex gap-3 flex-wrap justify-center">
            {stages.map((stage, index) => {
              const stageStudents = students?.filter(
                (student) => student.stage_id === stage.id
              );
              return (
                <div className="relative" key={index}>
                  <Folder path={stage.id} text={stage.name} />
                  {stageStudents?.length > 0 && (
                    <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-2 -top-1">
                      {stageStudents?.length || 0}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {stages?.length > 0 && !isEdit && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsEdit(true)}
            className="space-x-2 py-2 px-5 rounded-lg border-2 border-blue-600 text-blue-500 font-bold cursor-pointer hover:opacity-85 transition-opacity active:opacity-100"
          >
            <FontAwesomeIcon icon={faEdit} />
            <span>تعديل المجموعات</span>
          </button>
        </div>
      )}
      {isEdit && (
        <EditStages
          stages={stages}
          setIsNewStage={setIsNewStage}
          setIsEdit={setIsEdit}
        />
      )}
      {isNewStage && <AddNewStage setIsNewStage={setIsNewStage} />}
    </div>
  );
}

function AddNewStage({ setIsNewStage }) {
  const { currentUser } = useCurrentUser();
  const { mutate: addNewStageMutation } = useAddNewStageMutation();
  const handleAddNewStage = (e) => {
    e.preventDefault();
    const stage = e.target.addNewStage.value;
    addNewStageMutation(
      {
        stage,
        teacherId: currentUser?.id,
      },
      {
        onSuccess: () => {
          e.target.reset();
          e.target.addNewStage.focus();
        },
      }
    );
  };

  return (
    <div
      className="h-screen w-screen bg-black/50 fixed inset-0 z-20 flex items-center justify-center"
      onClick={() => setIsNewStage(false)}
    >
      <form
        onSubmit={handleAddNewStage}
        onClick={(e) => e.stopPropagation()}
        className="p-3 rounded-xl bg-white flex flex-col items-center w-96 gap-3"
        dir="rtl"
      >
        <div className="w-full space-y-2">
          <label htmlFor="addNewStage" className="block">
            اسم المجموعة
          </label>
          <input
            type="text"
            id="addNewStage"
            className="w-full p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="الصف الأول الإعدادي أو مستوى متوسط"
          />
        </div>
        <button className="space-x-2 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold cursor-pointer hover:opacity-85 transition-opacity active:opacity-100 w-full">
          <span>إضافة</span>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
    </div>
  );
}

function EditStages({ stages, setIsNewStage, setIsEdit }) {
  const [isEditStage, setIsEditStage] = useState(false);
  return (
    <div>
      <h1 className="text-center font-bold text-2xl mb-5">تعديل المجموعات</h1>
      <div className="flex gap-3 flex-wrap justify-center items-start mb-5">
        {stages.map((stage, index) => {
          return (
            <StageInEditStages
              stage={stage}
              key={index}
              setIsEditStage={setIsEditStage}
              isEditStage={isEditStage}
            />
          );
        })}
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setIsNewStage(true)}
          className="space-x-2 py-2 px-5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold cursor-pointer hover:opacity-85 transition-opacity active:opacity-100"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>إضافة مجموعة جديدة</span>
        </button>
        <button
          onClick={() => setIsEdit(false)}
          className="space-x-2 py-2 px-5 rounded-lg border-2 border-red-500 text-red-600 font-bold cursor-pointer hover:opacity-85 transition-opacity active:opacity-100"
        >
          <span>إغلاق صفحة التعديل</span>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
}

function StageInEditStages({ stage, setIsEditStage, isEditStage }) {
  const { currentUser } = useCurrentUser();
  const isEditThisStage = isEditStage === stage.id;
  const [isDeleteStage, setIsDeleteStage] = useState(false);

  const { mutate: deleteStageMutation } = useDeleteStageMutation();
  const { mutate: updateStageMutation } = useUpdateStageMutation();

  const handleEditStageName = (e) => {
    e.preventDefault();
    const newStageName = e.target.newStageName.value;
    newStageName;
    if (!newStageName.trim()) return alert("من فضلك أدخل اسم المجموعة");
    updateStageMutation(
      {
        stageId: stage.id,
        teacherId: currentUser.id,
        stageName: newStageName,
      },
      {
        onSuccess: () => {
          setIsEditStage(false);
        },
      }
    );
    // update stage name in database
  };
  return (
    <div className="relative border border-gray-300 rounded-lg p-3 bg-white grow max-w-60">
      <div className="flex gap-2">
        <button
          onClick={() => setIsDeleteStage(true)}
          className="text-red-600 cursor-pointer"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          onClick={() => setIsEditStage(isEditThisStage ? null : stage.id)}
          className={clsx(
            "cursor-pointer",
            isEditThisStage ? "text-red-600" : "text-blue-600"
          )}
        >
          <FontAwesomeIcon icon={isEditThisStage ? faClose : faEdit} />
        </button>
      </div>
      {!isEditThisStage && <h3>{stage.name}</h3>}
      {isEditThisStage && (
        <form className="space-y-2" onSubmit={handleEditStageName}>
          <input
            type="text"
            name="newStageName"
            defaultValue={stage.name}
            className="border border-gray-300 px-3 py-1 rounded-lg focus:ring focus:ring-blue-500 outline-none w-full"
          />
          <button className="w-full py-1 px-3 bg-blue-500 text-white rounded-lg">
            تأكيد
          </button>
        </form>
      )}
      {isDeleteStage && (
        <AlertBox
          title="حذف المجموعة"
          type="red"
          message="سيؤدي حذف المجموعة إلى حذف كل شئ متعلق بها مثل الطلاب المشتركين والامتحانات الخاصة بها وهذه الخطوة لا يمكن التراجع عنها"
          firstOptionText="تأكيد الحذف"
          firstOptionDescription="سيتم حذف المجموعة وجميع البيانات المتعلقة بها"
          firstOptionFunction={() => {
            deleteStageMutation({
              stageId: stage.id,
              teacherId: currentUser.id,
            });
            setIsDeleteStage(false);
          }}
          setOpen={setIsDeleteStage}
        />
      )}
    </div>
  );
}
