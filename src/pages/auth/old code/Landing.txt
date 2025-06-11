import React from "react";
import { Link } from "react-router-dom";
import landingImage from "../../../public/landingImage.png";
// Supabase import is not used in this landing page component,
// but it's good practice to keep it if it might be used for dynamic content later
// or if other parts of the app rely on it being initialized here.
// For a purely static landing page, it's not strictly necessary.
// import { supabase } from "./config/supabase";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100 scroll-smooth">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-2 rounded-lg">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  Quiz Master
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                الميزات
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                كيف يعمل
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-emerald-600 font-medium"
              >
                آراء المستخدمين
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                to="/auth?mode=login"
                className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 border-emerald-600 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/auth?mode=signup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transition-colors"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            منصة الاختبارات الأكثر تقدماً للمعلمين والطلاب
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            منصة Quiz Master تسهل على المعلمين إنشاء الاختبارات، متابعة تقدم
            الطلاب، والتواصل مع أولياء الأمور لتحسين العملية التعليمية.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              to="/auth?mode=signup&type=teacher"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transition-colors"
            >
              التسجيل كمعلم
            </Link>
            <Link
              to="/auth?mode=signup&type=student"
              className="inline-flex items-center px-6 py-3 border text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 border-emerald-600 transition-colors"
            >
              التسجيل كطالب
            </Link>
          </div>
        </div>
        <div className="mt-16 max-w-5xl w-full">
          <div className="relative rounded-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0"></div>
            <img
              src={landingImage}
              alt="Screenshot of Quiz Master Dashboard"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              ميزات تحول تجربة التعليم
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              تم تصميم منصة Quiz Master لتلبية احتياجات المعلمين والطلاب وأولياء
              الأمور، مما يجعل عملية التعليم أكثر كفاءة وفعالية.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 shadow-md transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center mb-5">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                إنشاء اختبارات متقدمة
              </h3>
              <p className="text-gray-600">
                إنشاء اختبارات متنوعة بأسئلة اختيار من متعدد، صح/خطأ، أسئلة
                مقالية وتخصيصها حسب المراحل الدراسية المختلفة.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 shadow-md transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center mb-5">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                تحليلات متقدمة للأداء
              </h3>
              <p className="text-gray-600">
                رؤية تقدم الطلاب عبر رسوم بيانية سهلة القراءة ومؤشرات الأداء
                الرئيسية لتحديد نقاط القوة والضعف.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 shadow-md transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center mb-5">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                تواصل مع أولياء الأمور
              </h3>
              <p className="text-gray-600">
                مشاركة تلقائية لنتائج الاختبارات وتقدم الطلاب مع أولياء الأمور
                لتعزيز التواصل بين المدرسة والمنزل.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 shadow-md transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center mb-5">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                تصحيح فوري للاختبارات
              </h3>
              <p className="text-gray-600">
                تصحيح تلقائي للاختبارات وإظهار النتائج فوراً للطلاب مع تفسير
                الإجابات الصحيحة.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 shadow-md transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center mb-5">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                جدولة الاختبارات
              </h3>
              <p className="text-gray-600">
                تعيين الاختبارات لفترات محددة وجدولتها تلقائياً للطلاب مع إرسال
                إشعارات تذكيرية.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 shadow-md transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center mb-5">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                نظام آمن للاختبارات
              </h3>
              <p className="text-gray-600">
                تأمين الاختبارات ضد الغش مع ميزات مراقبة الوقت ومنع تبديل
                النوافذ أثناء الاختبار.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 bg-gradient-to-br from-green-50 to-emerald-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              كيف تعمل منصة Quiz Master
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              عملية سهلة وبسيطة تتيح لك البدء في استخدام المنصة والاستفادة من
              جميع مميزاتها.
            </p>
          </div>

          <div className="mt-16 relative">
            {/* Timeline connector */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-200 transform -translate-x-1/2"></div>

            {/* Step 1 */}
            <div className="relative md:flex items-center mb-12">
              <div className="md:w-1/2 pr-8 md:text-right hidden md:block"></div>
              <div className="mx-auto md:mx-0 md:absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center font-bold border-4 border-white shadow-md z-10 max-md:hidden">
                1
              </div>
              <div className="md:w-1/2 md:pl-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  أنشئ حساباً كمعلم
                </h3>
                <p className="text-gray-600">
                  قم بالتسجيل كمعلم وأدخل معلوماتك الأساسية والمواد التي تدرسها
                  والمراحل الدراسية.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative md:flex items-center mb-12">
              <div className="md:w-1/2 pr-8 md:text-right bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  أضف المراحل الدراسية والطلاب
                </h3>
                <p className="text-gray-600">
                  قم بإنشاء الفصول الدراسية وإضافة الطلاب إليها أو قبول طلبات
                  الانضمام من الطلاب.
                </p>
              </div>
              <div className="mx-auto md:mx-0 md:absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center font-bold border-4 border-white shadow-md mt-4 md:mt-0 z-10 max-md:hidden">
                2
              </div>
              <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
            </div>

            {/* Step 3 */}
            <div className="relative md:flex items-center mb-12">
              <div className="md:w-1/2 pr-8 md:text-right hidden md:block"></div>
              <div className="mx-auto md:mx-0 md:absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center font-bold border-4 border-white shadow-md z-10 max-md:hidden">
                3
              </div>
              <div className="md:w-1/2 md:pl-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  إنشاء الاختبارات
                </h3>
                <p className="text-gray-600">
                  قم بإنشاء اختبارات متنوعة باستخدام أدوات سهلة الاستخدام
                  وتخصيصها للمراحل الدراسية المختلفة.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative md:flex items-center">
              <div className="md:w-1/2 pr-8 md:text-right bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  متابعة التقدم وتحليل النتائج
                </h3>
                <p className="text-gray-600">
                  اطلع على نتائج الطلاب، تتبع تقدمهم، وشارك التقارير مع أولياء
                  الأمور لتحسين العملية التعليمية.
                </p>
              </div>
              <div className="mx-auto md:mx-0 md:absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center font-bold border-4 border-white shadow-md mt-4 md:mt-0 z-10 max-md:hidden">
                4
              </div>
              <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              ما يقوله مستخدمونا
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              آراء المعلمين والطلاب وأولياء الأمور الذين يستخدمون منصتنا يومياً.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center font-bold">
                  أ
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    أحمد محمد
                  </h4>
                  <p className="text-gray-600">معلم فيزياء</p>
                </div>
              </div>
              <p className="text-gray-700">
                "لقد وفرت لي منصة Quiz Master وقتاً كبيراً في تصحيح الاختبارات.
                الآن أستطيع التركيز على تحليل أداء الطلاب وتحسين طرق التدريس
                بدلاً من قضاء ساعات في التصحيح."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center font-bold">
                  س
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    سارة علي
                  </h4>
                  <p className="text-gray-600">طالبة</p>
                </div>
              </div>
              <p className="text-gray-700">
                "أحب أن أرى نتائج الاختبارات فوراً مع شرح للإجابات الصحيحة. هذا
                يساعدني على فهم أخطائي وتحسين مستواي باستمرار دون الانتظار
                لأسبوع للحصول على النتائج."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white flex items-center justify-center font-bold">
                  م
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    محمد حسن
                  </h4>
                  <p className="text-gray-600">ولي أمر</p>
                </div>
              </div>
              <p className="text-gray-700">
                "كولي أمر، أقدر كثيراً التقارير التي أتلقاها حول أداء ابنتي.
                أصبح من السهل علي متابعة تقدمها والمشاركة بفعالية في عملية
                تعليمها بفضل منصة Quiz Master."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            ابدأ اليوم مجاناً
          </h2>
          <p className="mt-4 text-xl text-green-100">
            انضم إلى آلاف المعلمين والطلاب الذين يستخدمون منصة Quiz Master
            لتحسين تجربة التعليم.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              to="/auth?mode=signup&type=teacher"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-emerald-600 bg-white hover:bg-gray-50 transition-colors"
            >
              التسجيل كمعلم
            </Link>
            <Link
              to="/auth?mode=signup&type=student"
              className="inline-flex items-center px-6 py-3 border text-base font-medium rounded-md text-white bg-emerald-800 bg-opacity-30 hover:bg-opacity-40 border-white transition-colors"
            >
              التسجيل كطالب
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">
                  Quiz Master
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                منصة متكاملة لإنشاء وإدارة الاختبارات التعليمية.
              </p>
            </div>

            <div>
              <h5 className="text-lg font-semibold text-white mb-4">
                روابط سريعة
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-emerald-400"
                  >
                    الميزات
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-emerald-400"
                  >
                    كيف يعمل
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-emerald-400"
                  >
                    آراء المستخدمين
                  </a>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-gray-400 hover:text-emerald-400"
                  >
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="text-gray-400 hover:text-emerald-400"
                  >
                    شروط الخدمة
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-semibold text-white mb-4">
                تواصل معنا
              </h5>
              <p className="text-gray-400 mb-2">contact@quizmaster.com</p>
              <div className="flex justify-center md:justify-start space-x-4 space-x-reverse">
                <a href="#" className="text-gray-400 hover:text-emerald-400">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Quiz Master. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
