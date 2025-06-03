import React, { useEffect, useState } from "react";
import { useCurrentUser, useDarkMode, useSession } from "./store/useStore";
import { supabase } from "./config/supabase";
import Auth from "./pages/auth/Auth";
import Student from "./pages/LoggedInUser/Student";
import Teacher from "./pages/LoggedInUser/Teacher";
import {
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  NavLink,
} from "react-router-dom";
import CreateTest from "./pages/LoggedInUser/CreateTest";
import StudentTeacher from "./pages/LoggedInUser/StudentTeacher";
import Exam from "./pages/LoggedInUser/Exam";
import ResumeCreateTest from "./pages/LoggedInUser/ResumeCreateTest";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faChalkboardTeacher,
  faFileAlt,
  faHome,
  faLock,
  faMoon,
  faNewspaper,
  faPlusCircle,
  faSun,
  // faSignOut,
  faTasks,
  faUserEdit,
  faUserPlus,
  faUsers,
  faWater,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "./components/Loader";
import Requests from "./pages/LoggedInUser/Requests";
import {
  useExamsByTeacherId,
  useJoinCodes,
  useNotificationsByUserId,
  usePostsByTeacherId,
  useProfileByUserId,
  useStudentsAndRequestsByTeacherIdAndTable,
  useTasksByUserId,
  useTeachersFromTeachersStudents,
  useUserDataByUserId,
} from "./QueriesAndMutations/QueryHooks";
import Notifications from "./pages/LoggedInUser/Notifications";
import Stages from "./pages/LoggedInUser/Stages";
import Stage from "./pages/LoggedInUser/Stage";
import UserProfile from "./pages/LoggedInUser/UserProfile";
import ErrorPlaceHolder from "./components/ErrorPlaceHolder";
import Landing from "./pages/auth/Landing"; // Import the new Landing component
import JoinCodes from "./pages/LoggedInUser/JoinCodes";
import JoinCodesGroup from "./pages/LoggedInUser/JoinCodesGroup";
import Exams from "./pages/LoggedInUser/Exams";
import PublishedAndUnPublishedExams from "./pages/LoggedInUser/PublishedAndUnPublishedExams";
import TeacherPosts from "./pages/LoggedInUser/TeacherPosts";
import StudentPosts from "./pages/LoggedInUser/StudentPosts";
import PostsInTeacherPosts from "./pages/LoggedInUser/PostsInTeacherPosts";
import ExamData from "./pages/LoggedInUser/ExamData";
import StudentsGrades from "./pages/LoggedInUser/StudentsGrades";
import DidNotTakeExam from "./pages/LoggedInUser/DidNotTakeExam";
import StudentTeachers from "./pages/LoggedInUser/StudentTeachers";
import TeacherExams from "./pages/LoggedInUser/TeacherExams";
import SearchTeachers from "./pages/LoggedInUser/SearchTeachers";
import ChooseTestType from "./pages/LoggedInUser/ChooseTestType";
import StageExamsTypes from "./pages/LoggedInUser/StageExamsTypes";
import TypeStageExams from "./pages/LoggedInUser/TypeStageExams";
import TeacherTasks from "./pages/LoggedInUser/TeacherTasks";
import StudentTasks from "./pages/LoggedInUser/StudentTasks";
import TeacherPostsInStudentTeacher from "./pages/LoggedInUser/TeacherPostsInStudentTeacher";
import clsx from "clsx";
import PageWrapper from "./components/PageWrapper";

export default function App() {
  const { getSession, session } = useSession();
  const { getCurrentUser, currentUser } = useCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, getMode } = useDarkMode();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  // const {
  //   data: userData,
  //   isLoading: userDataLoading,
  //   isError: userDataError,
  // } = useUserDataByUserId(currentUser?.id, "teachers");

  const { data: notifications } = useNotificationsByUserId(currentUser?.id);

  const unReadNotifications = notifications?.filter(
    (notification) => !notification.isRead
  );

  const { data: exams } = useExamsByTeacherId(currentUser?.id, "all");

  const { data: requests } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_requests"
  );

  const { data: students } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  const { data: studentTeachers } = useTeachersFromTeachersStudents(
    currentUser?.id
  );

  const { data: tasks } = useTasksByUserId(currentUser?.id);

  const { data: postsInTeacherPosts } = usePostsByTeacherId(currentUser?.id);

  const { data: joinCodes } = useJoinCodes(currentUser?.id);

  const navLinks = [
    {
      path: "/",
      icon: <FontAwesomeIcon icon={faHome} />,
      text: "الرئيسية",
      user: "both",
      number: null,
    },
    {
      path: "/posts",
      icon: <FontAwesomeIcon icon={faNewspaper} />,
      text: "المنشورات",
      user: "both",
      number: postsInTeacherPosts?.length || null,
    },
    {
      path: "/tasks",
      icon: <FontAwesomeIcon icon={faTasks} />,
      text: "المهام",
      user: "both",
      number: currentUser?.type === "teacher" ? tasks?.length || null : null,
    },
    {
      path: "/studentTeachers",
      icon: <FontAwesomeIcon icon={faChalkboardTeacher} />,
      text: "معلميني",
      user: "student",
      number: studentTeachers?.length || null,
    },
    {
      path: "/exams",
      icon: <FontAwesomeIcon icon={faFileAlt} />,
      text: "الاختبارات",
      user: "teacher",
      number: exams?.length || null,
    },
    {
      path: "/createTest",
      icon: <FontAwesomeIcon icon={faPlusCircle} />,
      text: "إنشاء اختبار",
      user: "teacher",
      number: null,
    },
    {
      path: "/requests",
      icon: <FontAwesomeIcon icon={faUserPlus} />,
      text: "طلبات الانضمام",
      user: "teacher",
      number: requests?.length || null,
    },
    {
      path: "/stages",
      icon: <FontAwesomeIcon icon={faUsers} />,
      text: "المجموعات",
      user: "teacher",
      number: students?.length || null,
    },
    {
      path: "/joinCodes",
      icon: <FontAwesomeIcon icon={faLock} />,
      text: "اكواد الانضمام",
      user: "teacher",
      number: joinCodes?.length || null,
    },
  ];

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
    // getMode(true);
  }, [location.pathname]);

  console.log("isDarkMood", isDarkMode);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        getSession(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [getSession]);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: profileError,
  } = useProfileByUserId(session?.user?.id);

  const userTable = profile?.type === "student" ? "students" : "teachers";

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: userDataError,
  } = useUserDataByUserId(session?.user?.id, userTable);

  useEffect(() => {
    if (userData) {
      getCurrentUser(userData);
    }
  }, [userData]);

  if (isProfileLoading || isUserDataLoading) {
    return <Loader message="جاري التحقق من الجلسة..." />;
  }

  if (profileError || userDataError) {
    return <ErrorPlaceHolder message={"حدث خطأ ما، أعد المحاولة"} />;
  }

  // If no session, show the Landing page with routes for auth
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: "#10B981",
                color: "white",
              },
            },
            error: {
              style: {
                background: "#EF4444",
                color: "white",
              },
            },
          }}
        />
      </div>
    );
  }

  if (!currentUser) return <Loader message="جري تحميل الاختبارات" />;

  return (
    <div
      className={clsx(
        "h-screen w-screen grid grid-cols-[350px_1fr] max-xl:grid-cols-[64px_1fr] max-md:grid-cols-1 max-md:grid-rows-[72px_1fr] max-sm:grid-rows-1 font-[Noto_Sans_Arabic] max-md:overflow-hidden",
        isDarkMode
          ? "bg-gradient-to-bl from-slate-900 to-slate-950 text-white"
          : "bg-white text-black"
      )}
      dir="rtl"
    >
      <button
        onClick={() => getMode(isDarkMode ? false : true)}
        className="fixed left-3 top-3 z-50"
      >
        <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} />
      </button>
      <header
        className={clsx(
          "border-e-2 overflow-hidden p-3 space-y-4 flex md:flex-col justify-between h-full max-md:px-10 max-md:space-y-0 max-md:border-b max-md:border-e-0 max-sm:hidden",
          isDarkMode
            ? "bg-slate-900 border-blue-500/40"
            : "bg-gray-50 border-gray-300"
        )}
      >
        {/* website name */}
        <div className="max-md:flex max-md:w-full">
          <div className="flex gap-2 items-center justify-center bg-blue-500/20 text-blue-500 py-3 text-lg rounded-2xl max-md:px-3">
            <FontAwesomeIcon icon={faWater} />
            <h1 className="font-bold max-xl:hidden">بحور</h1>
          </div>

          {/* nav links */}
          <nav className="space-y-2 mt-4 max-md:flex max-md:mt-0 max-md:shrink-0 max-md:space-y-0 max-md:grow max-md:justify-center max-md:gap-1">
            {navLinks.map((link, index) => {
              if (currentUser.type === link.user || link.user === "both") {
                return (
                  <div className="relative" key={index}>
                    <NavLink
                      to={link.path}
                      title={link.text}
                      className={({ isActive }) =>
                        `px-2 max-md:p-1 flex items-center rounded-full ${
                          isActive
                            ? isDarkMode
                              ? "bg-blue-500/20 text-blue-500"
                              : "bg-gray-200 text-gray-900"
                            : isDarkMode
                            ? "text-gray-700 hover:bg-blue-500/10 transition-colors"
                            : "text-gray-700 hover:bg-gray-100 transition-colors"
                        } ${isDarkMode && "text-white"}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`h-10 w-10 flex items-center justify-center ${
                              isActive
                                ? isDarkMode
                                  ? "text-blue-400"
                                  : "text-blue-500"
                                : isDarkMode
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            {link.icon}
                          </div>
                          <p
                            className={clsx(
                              "max-xl:hidden",
                              isActive
                                ? isDarkMode
                                  ? "text-blue-400"
                                  : "text-black"
                                : isDarkMode
                                ? "text-white"
                                : "text-black"
                            )}
                          >
                            {link.text}
                          </p>
                        </>
                      )}
                    </NavLink>
                    {link.number && (
                      <span className="h-6 rounded-full px-2 bg-blue-500 text-white flex items-center justify-center text-sm absolute end-2 top-1/2 -translate-y-1/2 max-xl:hidden">
                        {link.number}
                      </span>
                    )}
                  </div>
                );
              }
            })}
          </nav>
        </div>

        <Link
          to={"/userProfile/" + currentUser.id}
          className={clsx(
            "flex gap-2 items-center  p-3 rounded-full max-md:p-0 max-xl:p-0 max-xl:hover:ring-2 transition-all",
            isDarkMode
              ? "hover:bg-blue-500/10 max-xl:hover:ring-blue-400"
              : "hover:bg-gray-200 max-xl:hover:ring-blue-500"
          )}
        >
          <img
            src={currentUser?.avatar}
            alt="user profile image"
            className="h-12 w-12 rounded-full object-cover max-xl:h-10 max-xl:w-10"
          />
          <div className="max-xl:hidden">
            <p className="font-bold">{currentUser?.name}</p>
            {currentUser.type === "teacher" && (
              <span className="font-medium hidden md:block text-sm text-blue-500">
                {currentUser?.subject}
              </span>
            )}
          </div>
        </Link>
      </header>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="sm:hidden fixed bottom-3 start-0 h-10 w-13 bg-blue-500 text-white rounded-e-full cursor-pointer z-50"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      {/* Main content */}
      <main className="flex-grow relative h-screen overflow-hidden">
        <div className="h-full">
          <Routes>
            <Route
              path="/"
              element={
                currentUser.type === "student" ? <Student /> : <Teacher />
              }
            />
            {currentUser.type === "student" ? (
              <Route path="/posts" element={<StudentPosts />} />
            ) : (
              <Route path="/posts" element={<TeacherPosts />} />
              //   <Route path=":stageId" element={<PostsInTeacherPosts />} />
              // </Route>
            )}
            <Route path="/searchTeachers" element={<SearchTeachers />} />
            <Route path="/studentTeachers" element={<StudentTeachers />} />
            <Route path="/studentTeachers/:id" element={<StudentTeacher />}>
              <Route index element={<TeacherExams />} />
              <Route path=":posts" element={<TeacherPostsInStudentTeacher />} />
            </Route>
            <Route path="/requests" element={<Requests />} />
            <Route path="/stages" element={<Stages />} />
            <Route path="/stages/:stageId" element={<Stage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/createTest" element={<ChooseTestType />} />
            <Route path="/createTest/:type" element={<CreateTest />} />
            <Route
              path="/resumeCreateTest/:id"
              element={<ResumeCreateTest />}
            />
            <Route path="/joinCodes" element={<JoinCodes />} />
            <Route path="/joinCodes/:group" element={<JoinCodesGroup />} />
            <Route path="/userProfile/:id" element={<UserProfile />} />
            <Route path="/exams" element={<Exams />}>
              <Route
                path=":PublishedOrNot"
                element={<PublishedAndUnPublishedExams />}
              >
                <Route path=":stageId" element={<StageExamsTypes />}>
                  <Route path=":type" element={<TypeStageExams />} />
                </Route>
              </Route>
            </Route>
            <Route path="/exam/:id" element={<Exam />} />
            <Route path="/examData/:id" element={<ExamData />}>
              <Route index element={<StudentsGrades />} />
              <Route
                path="/examData/:id/didNotTakeExam"
                element={<DidNotTakeExam />}
              />
            </Route>
            <Route
              path="/tasks"
              element={
                currentUser?.type === "teacher" ? (
                  <TeacherTasks />
                ) : (
                  <StudentTasks />
                )
              }
            />
          </Routes>
        </div>
      </main>

      {/* Overlay */}
      <div
        className={clsx(
          "sm:hidden fixed top-0 bottom-0 h-full w-full bg-black/20 backdrop-blur-sm z-50 transition-all",
          isSidebarOpen ? "start-0" : "-start-full"
        )}
        onClick={() => setIsSidebarOpen(false)}
      >
        <aside
          onClick={(e) => e.stopPropagation()}
          className="border-e border-gray-300 overflow-hidden p-3 space-y-4 bg-gray-50 flex md:flex-col max-sm:flex-col justify-between h-full max-sm:fixed max-sm:top-0 max-sm:bottom-0 max-sm:start-0 max-sm:z-40 max-sm:w-2/3 sm:hidden"
        >
          {/* website name */}
          <div className="">
            <div className="flex gap-2 items-center justify-center bg-blue-100 text-blue-600 py-3 text-lg rounded-2xl">
              <FontAwesomeIcon icon={faWater} />
              <h1 className="font-bold">بحور</h1>
            </div>

            {/* nav links */}
            <nav className="space-y-2 mt-4">
              {navLinks.map((link, index) => {
                if (currentUser.type === link.user || link.user === "both") {
                  return (
                    <div className="relative" key={index}>
                      <NavLink
                        to={link.path}
                        title={link.text}
                        className={({ isActive }) =>
                          `px-2 max-md:p-1 max-sm:px-2 max-sm:py-0.5 flex items-center rounded-full ${
                            isActive
                              ? "bg-gray-200 text-gray-900"
                              : "text-gray-700 hover:bg-gray-100 transition-colors"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div
                              className={`h-10 w-10 flex items-center justify-center ${
                                isActive && "text-blue-500"
                              }`}
                            >
                              {link.icon}
                            </div>
                            <p className="max-xl:hidden max-sm:block">
                              {link.text}
                            </p>
                          </>
                        )}
                      </NavLink>
                      {link.number && (
                        <span className="h-6 rounded-full px-2 bg-blue-500 text-white flex items-center justify-center text-sm absolute end-2 top-1/2 -translate-y-1/2 max-xl:hidden max-sm:flex">
                          {link.number}
                        </span>
                      )}
                    </div>
                  );
                }
              })}
            </nav>
          </div>

          <Link
            to={"/userProfile/" + currentUser.id}
            className="flex gap-2 items-center hover:bg-gray-200 p-3 rounded-full max-md:p-0 max-sm:p-3"
          >
            <img
              src={currentUser?.avatar}
              alt="user profile image"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="max-xl:hidden max-sm:block">
              <p className="font-bold">{currentUser?.name}</p>
              {currentUser.type === "teacher" && (
                <span className="font-medium hidden md:block text-sm text-blue-500 max-sm:inline">
                  {currentUser?.subject}
                </span>
              )}
            </div>
          </Link>
        </aside>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#10B981",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "white",
            },
          },
        }}
      />
    </div>
  );
}
