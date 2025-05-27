import React, { useEffect, useState } from "react";
import { useCurrentUser, useSession } from "./store/useStore";
import { supabase } from "./config/supabase";
import Auth from "./pages/auth/Auth";
import Student from "./pages/LoggedInUser/Student";
import Teacher from "./pages/LoggedInUser/Teacher";
import {
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
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
  faBars,
  faBell,
  faChalkboardTeacher,
  faPlus,
  faSignOut,
  faTasks,
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
  // useUserDataByUserId,
} from "./QueriesAndMutations/QueryHooks";
import Notifications from "./pages/LoggedInUser/Notifications";
import Stages from "./pages/LoggedInUser/Stages";
import Stage from "./pages/LoggedInUser/Stage";
import UserProfile from "./pages/LoggedInUser/UserProfile";
import ErrorPlaceHolder from "./components/ErrorPlaceHolder";
import Landing from "./pages/auth/Landing"; // Import the new Landing component
import JoinCodes from "./pages/LoggedInUser/JoinCodes";
import JoinCodesGroup from "./pages/LoggedInUser/JoinCodesGroup";
import {
  BookSVG,
  CloseSideBarSVG,
  FileSVG,
  HomeSVG,
  JoinCodesSVG,
  PostsSVG,
  RequestsSVG,
  StagesSVG,
} from "../public/SVGs";
import Exams from "./pages/LoggedInUser/Exams";
import PublishedAndUnPublishedExams from "./pages/LoggedInUser/PublishedAndUnPublishedExams";
import StageExams from "./pages/LoggedInUser/StageExamsTypes";
import Posts from "./pages/LoggedInUser/TeacherPosts";
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

export default function App() {
  const { getSession, session } = useSession();
  const { getCurrentUser, currentUser } = useCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      icon: <HomeSVG />,
      text: "الرئيسية",
      user: "both",
      number: null,
    },
    {
      path: "/posts",
      icon: <PostsSVG />,
      text: "المنشورات",
      user: "both",
      number: postsInTeacherPosts?.length || null,
    },
    {
      path: "/tasks",
      icon: <FontAwesomeIcon icon={faTasks} className="pr-1" />,
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
      icon: <FileSVG />,
      text: "الامتحانات",
      user: "teacher",
      number: exams?.length || null,
    },
    {
      path: "/createTest",
      icon: <FontAwesomeIcon icon={faPlus} />,
      text: "إنشاء امتحان",
      user: "teacher",
      number: null,
    },
    {
      path: "/requests",
      icon: <RequestsSVG />,
      text: "طلبات الانضمام",
      user: "teacher",
      number: requests?.length || null,
    },
    {
      path: "/stages",
      icon: <StagesSVG />,
      text: "الطلاب",
      user: "teacher",
      number: students?.length || null,
    },
    {
      path: "/joinCodes",
      icon: <JoinCodesSVG />,
      text: "اكواد الانضمام",
      user: "teacher",
      number: joinCodes?.length || null,
    },
  ];

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

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

  let userTable = profile?.type === "student" ? "students" : "teachers";

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

  if (!currentUser) return <Loader message="جري تحميل الامتحانات" />;

  return (
    <div className="min-h-screen flex flex-col font-[Noto_Sans_Arabic]">
      {/* Header */}
      <header className="bg-gray-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <Link to="/" className="ml-4 flex items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-2 rounded-lg">
                    <BookSVG />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    Quiz Master
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-5" dir="rtl">
                  <Link
                    to={"/userProfile/" + currentUser.id}
                    className="text-gray-700 font-medium hidden md:block"
                  >
                    {currentUser?.name}
                  </Link>
                  {currentUser.type === "teacher" && (
                    <span className="text-gray-700 font-medium hidden md:block">
                      {currentUser?.subject}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <Link
                  to={"/notifications"}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md shadow-sm text-orange-600 border-2 border-orange-600 focus:outline-none transition-all duration-150 h-10 w-10 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faBell} />
                </Link>
                {unReadNotifications?.length > 0 && (
                  <span className="h-6 rounded-full px-2 bg-red-500 flex items-center justify-center text-white text-sm absolute -left-2.5 -top-1">
                    {unReadNotifications?.length || 0}
                  </span>
                )}
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/");
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none transition-all duration-150 h-10 w-10 cursor-pointer"
              >
                <FontAwesomeIcon icon={faSignOut} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gray-50 shadow-lg z-20 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-auto md:h-auto md:shadow-none`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center md:hidden">
            <div className="font-semibold text-gray-800">القائمة</div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <CloseSideBarSVG />
            </button>
          </div>

          <div className="py-4 flex flex-col md:flex-row md:justify-center md:items-center md:space-x-2 md:rtl:space-x-reverse md:px-4 max-md:p-3 max-md:space-y-2">
            {navLinks.map((link, index) => {
              if (currentUser.type === link.user || link.user === "both") {
                return (
                  <div className="relative" key={index}>
                    <NavLink
                      to={link.path}
                      title={link.text}
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-md flex items-center gap-1 transition-colors md:py-1 
                      text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 h-10 border border-indigo-300/20 max-md:border-none
                        ${isActive ? "bg-indigo-100 text-indigo-700" : ""}`
                      }
                    >
                      {link.icon}
                      <p dir="rtl" className="max-lg:hidden max-md:block">
                        {link.text}
                      </p>
                    </NavLink>
                    {link.number && (
                      <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-2 -top-1.5 max-lg:hidden">
                        {link.number}
                      </span>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Route path="/posts" element={<TeacherPosts />}>
                <Route path=":stageId" element={<PostsInTeacherPosts />} />
              </Route>
            )}
            <Route path="/searchTeachers" element={<SearchTeachers />} />
            <Route path="/studentTeachers" element={<StudentTeachers />} />
            <Route path="/studentTeachers/:id" element={<StudentTeacher />}>
              <Route index element={<TeacherExams />} />
              <Route path=":posts" element={<StudentPosts />} />
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
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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
