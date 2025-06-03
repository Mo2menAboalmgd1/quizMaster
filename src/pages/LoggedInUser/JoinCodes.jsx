import React from "react";
import { useCurrentUser, useDarkMode } from "../../store/useStore";
import Loader from "../../components/Loader";
import { useStagesByTeacherId } from "../../QueriesAndMutations/QueryHooks";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import Folder from "../../components/Folder";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import {
  fa1,
  faBoltLightning,
  faBullseye,
  faCheck,
  faExclamationCircle,
  faGear,
  faGlobe,
  faLightbulb,
  faLock,
  faTrash,
  faUserLock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "../../components/PageWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

// مكون دليل الأكواد
const CodesGuide = ({ isDarkMode }) => {
  return (
    <div className="max-w-4xl mx-auto mt-4 rounded-xl p-6 opacity-70 pointer-events-none select-none">
      {/* <h2 className="text-center text-gray-800 mb-4 text-xl font-semibold">
        دليل أنواع الأكواد
      </h2> */}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* الأكواد العامة */}
        <div
          className={clsx(
            "rounded-lg p-6 border hover transition-all duration-300",
            isDarkMode
              ? "bg-slate-800/70 border-slate-700"
              : "bg-gray-50 border-gray-300"
          )}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg ml-3">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <h3 className="text-lg font-bold text-blue-500">الأكواد العامة</h3>
          </div>

          <ul
            className={clsx(
              "space-y-3",
              isDarkMode ? "text-white/70" : "text-gray-900"
            )}
          >
            <li className="flex items-center text-sm">
              <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ml-3">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              بدون تاريخ انتهاء صلاحية
            </li>
            <li className="flex items-center text-sm">
              <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ml-3">
                <FontAwesomeIcon icon={faUsers} size="sm" />
              </span>
              يمكن لعدة أشخاص استخدامه
            </li>
            <li className="flex items-center text-sm">
              <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ml-3">
                <FontAwesomeIcon icon={faGear} size="sm" />
              </span>
              يمكن إيقافه وتشغيله مرة أخرى
            </li>
            <li className="flex items-center text-sm">
              <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ml-3">
                <FontAwesomeIcon icon={faTrash} size="sm" />
              </span>
              تحكم يدوي في الحذف
            </li>
          </ul>
        </div>

        {/* الأكواد الخاصة */}
        <div
          className={clsx(
            "rounded-lg p-6 border hover transition-all duration-300",
            isDarkMode
              ? "bg-slate-800/70 border-slate-700"
              : "bg-gray-50 border-gray-300"
          )}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg ml-3">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <h3 className="text-lg font-bold text-blue-500">الأكواد الخاصة</h3>
          </div>

          <ul
            className={clsx(
              "space-y-3",
              isDarkMode ? "text-white/70" : "text-gray-900"
            )}
          >
            <li className="flex items-center text-sm">
              <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ml-3">
                <FontAwesomeIcon icon={fa1} />
              </span>
              استخدام واحد فقط
            </li>
            <li className="flex items-center text-sm">
              <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ml-3">
                <FontAwesomeIcon icon={faBoltLightning} size="sm" />
              </span>
              يُحذف تلقائياً بعد الاستخدام
            </li>
            <li className="flex items-center text-sm">
              <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ml-3">
                <FontAwesomeIcon icon={faBullseye} size="sm" />
              </span>
              مخصص لشخص واحد
            </li>
            <li className="flex items-center text-sm">
              <span className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ml-3">
                <FontAwesomeIcon icon={faUserLock} size="xs" />
              </span>
              أمان أعلى ومؤقت
            </li>
          </ul>
        </div>
      </div>

      {/* نصائح سريعة */}
      <div
        className={clsx(
          "bg-gradient-to-l p-5 rounded-lg",
          isDarkMode
            ? "from-blue-600/30 to-blue-400/30 text-white"
            : "from-blue-600 to-blue-400 text-white"
        )}
      >
        <div className="flex items-center mb-3">
          <span className="text-lg ml-2">
            <FontAwesomeIcon icon={faLightbulb} />
          </span>
          <h4 className="font-semibold">نصائح سريعة</h4>
        </div>
        <div className="space-y-2 text-sm opacity-95">
          <div>
            • استخدم الأكواد العامة للفعاليات الكبيرة أو الدورات المستمرة
          </div>
          <div>• استخدم الأكواد الخاصة للدعوات الشخصية أو التسجيل المحدود</div>
          <div>• يمكنك إيقاف الكود العام مؤقتاً دون فقدانه نهائياً</div>
        </div>
      </div>
    </div>
  );
};

export default function JoinCodes() {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  if (!currentUser || isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError) {
    return <ErrorPlaceHolder message="حدث خطأ أثناء جلب الأكواد" />;
  }

  if (!stages || stages.length === 0) {
    return (
      <NoDataPlaceHolder
        message="قم بإضافة مراحل دراسية أولا"
        icon={faExclamationCircle}
      />
    );
  }

  return (
    <PageWrapper title={"اكواد الانضمام"}>
      <div className="flex gap-3 flex-wrap justify-center">
        <Folder
          path={"public"}
          text="أكواد عامة"
          key={"1"}
          inActiveIcon={faGlobe}
          activeIcon={faGlobe}
        />
        <Folder
          path={"private"}
          text="أكواد خاصة"
          key={"2"}
          inActiveIcon={faLock}
          activeIcon={faLock}
        />
      </div>

      {/* إضافة دليل الأكواد */}
      <CodesGuide isDarkMode={isDarkMode} />
    </PageWrapper>
  );
}
