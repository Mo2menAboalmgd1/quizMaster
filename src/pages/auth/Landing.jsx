import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWater, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-white font-[Noto_Sans_Arabic]"
      dir="rtl"
    >
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon
                  icon={faWater}
                  className="text-white text-lg"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                بحور
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
              >
                أراء المستخدمين
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
              >
                كيف يعمل
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
              >
                الميزات
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/auth?mode=login"
                className="px-5 py-2.5 text-gray-700 hover:text-blue-500 transition-colors font-medium"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/auth?mode=signup"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                إنشاء حساب
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon
                icon={isMenuOpen ? faTimes : faBars}
                className="text-xl text-gray-700"
              />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
                >
                  الميزات
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
                >
                  كيف يعمل
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
                >
                  آراء المستخدمين
                </a>
                <div className="flex flex-col gap-2 mt-4">
                  <button className="px-5 py-2.5 text-gray-700 border border-gray-200 rounded-xl font-medium">
                    تسجيل الدخول
                  </button>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium">
                    إنشاء حساب
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              منصة تعليمية متكاملة
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              منصة{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                بحور
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              توفر منصة بحور بيئة تعليمية شاملة تجمع بين نشر الامتحانات السريعة،
              المهام، المنشورات التعليمية، وإدارة المجموعات، وتقييم الطلاب،
              وتنظيم كل ما يخص العملية التعليمية.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <span className="flex items-center justify-center gap-2">
                  التسجيل كمعلم
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-300 hover:text-blue-500 transition-all duration-300">
                التسجيل كطالب
              </button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-lg p-6 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon
                        icon={faWater}
                        className="text-white text-2xl"
                      />
                    </div>
                    <p className="text-gray-500 text-lg">
                      واجهة استخدام سهلة وفعالة
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ميزات متكاملة{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                لتجربة تعليمية فريدة
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تم تصميم منصة بحور لتلبية احتياجات المعلمين والطلاب وأولياء الأمور
              وتسهيل العملية التعليمية.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "⏱️",
                title: "امتحانات سريعة بوقت",
                description:
                  "إنشاء اختبارات قصيرة ومحددة بوقت لتقييم سريع وفوري.",
              },
              {
                icon: "✍️",
                title: "امتحانات تقليدية",
                description: "إنشاء وإدارة الامتحانات التقليدية بشكل فعال.",
              },
              {
                icon: "📢",
                title: "نشر منشورات",
                description: "نشر إعلانات ومستجدات من قبل المعلمين للطلاب.",
              },
              {
                icon: "📚",
                title: "إدارة الواجبات والمهام",
                description:
                  "إرسال الواجبات والمهام للطلاب ومتابعة تسليمها وتقييمها.",
              },
              {
                icon: "🤝",
                title: "إدارة المجموعات",
                description:
                  "تنظيم الطلاب في مجموعات فرعية وإدارة الأنشطة الجماعية.",
              },
              {
                icon: "💯",
                title: "تقييم الطلاب",
                description:
                  "تقييم شامل لأداء الطلاب من خلال الامتحانات والواجبات.",
              },
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full w-full">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              كيف{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                تعمل المنصة
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              عملية سهلة وبسيطة تتيح لك البدء في الاستفادة من جميع المميزات
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "1",
                title: "إنشاء حساب",
                description: "سجل كمعلم أو طالب وابدأ رحلتك التعليمية معنا.",
              },
              {
                number: "2",
                title: "تكوين مجموعات",
                description: "أنشئ مجموعات دراسية وادعُ الطلاب للانضمام.",
              },
              {
                number: "3",
                title: "نشر المحتوى",
                description: "شارك المنشورات، الامتحانات، والواجبات مع طلابك.",
              },
              {
                number: "4",
                title: "تتبع التقدم",
                description: "تابع أداء الطلاب وقم بتقييمهم بشكل دوري.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {step.number}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ماذا يقول{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                المستخدمون
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              آراء المعلمين والطلاب وأولياء الأمور الذين يستخدمون منصتنا
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "ليلى خالد",
                role: "معلمة لغة عربية",
                content:
                  "منصة بحور سهلت عليّ إدارة الفصول الدراسية والتواصل مع الطلاب وأولياء الأمور. شكراً لكم!",
                avatar: "ل",
              },
              {
                name: "خالد سامي",
                role: "طالب",
                content:
                  "أحببت فكرة الامتحانات السريعة والنتائج الفورية. هذا يساعدني على تحسين مستواي باستمرار.",
                avatar: "خ",
              },
              {
                name: "أمين سالم",
                role: "ولي أمر",
                content:
                  "أنا سعيد بتقارير الأداء التي تصلني بانتظام. هذا يساعدني على متابعة تقدم ابني بشكل أفضل.",
                avatar: "أ",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="mr-4">
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            انضم إلينا مجاناً اليوم!
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            كن جزءاً من مجتمع بحور التعليمي وابدأ رحلتك نحو التميز.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-500 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              التسجيل كمعلم
            </button>
            <button className="px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300">
              التسجيل كطالب
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faWater}
                    className="text-white text-lg"
                  />
                </div>
                <span className="text-xl font-bold">بحور</span>
              </div>
              <p className="text-gray-400">
                منصة تعليمية متكاملة لإدارة العملية التعليمية بكفاءة.
              </p>
            </div>

            <div className="text-center">
              <h5 className="font-semibold mb-4">روابط سريعة</h5>
              <div className="space-y-2">
                <a
                  href="#features"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  الميزات
                </a>
                <a
                  href="#how-it-works"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  كيف يعمل
                </a>
                <a
                  href="#testimonials"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  أراء المستخدمين
                </a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="font-semibold mb-4">تواصل معنا</h5>
              <p className="text-gray-400 mb-4">contact@bohor.com</p>
              <div className="flex justify-center md:justify-start gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">📘</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">🐦</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">💼</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} بحور. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
