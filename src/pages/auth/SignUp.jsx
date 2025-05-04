import React, { useState } from "react";
import { useRegister } from "../../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";

export default function SignUp() {
  const [isStudent, setIsStudent] = useState(true);

  const { mutateAsync } = useRegister(isStudent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const userData = {
      email: formdata.get("email"),
      password: formdata.get("password"),
      name: formdata.get("name"),
      userName: formdata.get("userName"),
      gender: formdata.get("gender"),
      subject: formdata.get("subject"),
      phoneNumber: formdata.get("phoneNumber"),
      grade: formdata.get("grade"),
    };
    if (
      !userData.name ||
      !userData.userName ||
      !userData.email ||
      !userData.password ||
      !userData.gender ||
      !userData.phoneNumber ||
      !userData.grade
    ) {
      toast.error("الرجاء ملئ جميع الحقول");
      return;
    }
    toast.loading("جاري إنشاء الحساب...");
    await mutateAsync(userData);
    toast.dismiss();
    toast.success(
      "تم إنشاء الحساب بنجاح .. تحقق من بريدك الالكتروني لتأكيد تسجيل الحساب",
      { duration: 5000 }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg overflow-hidden"
    >
      <div className="space-y-4 p-1" dir="rtl">
        <div className="flex justify-center gap-6 mb-2">
          <div className="flex items-center gap-2">
            <input
              onChange={() => setIsStudent(true)}
              defaultChecked
              type="radio"
              name="type"
              id="student"
              className="text-blue-500 focus:ring-blue-400"
            />
            <label htmlFor="student" className="text-gray-700 font-medium">
              طالب
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              onChange={() => setIsStudent(false)}
              type="radio"
              name="type"
              id="teacher"
              className="text-blue-500 focus:ring-blue-400"
            />
            <label htmlFor="teacher" className="text-gray-700 font-medium">
              مُعلم
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-gray-700 font-medium">
            {isStudent ? "الاسم ثلاثي:" : "الاسم ثنائي:"}
          </label>
          <input
            dir="rtl"
            type="text"
            id="name"
            name="name"
            placeholder={isStudent ? "محمد أحمد إبراهيم" : "محمد أحمد"}
            className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="userName" className="block text-gray-700 font-medium">
            اسم المستخدم:
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            placeholder="mohammed223"
            className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="flex justify-center gap-6 my-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              className="text-blue-500 focus:ring-blue-400"
            />
            <label htmlFor="male" className="text-gray-700 font-medium">
              ذكر
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              className="text-blue-500 focus:ring-blue-400"
            />
            <label htmlFor="female" className="text-gray-700 font-medium">
              أنثى
            </label>
          </div>
        </div>

        {!isStudent && (
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="block text-gray-700 font-medium"
            >
              المادة الدراسية:
            </label>
            <input
              dir="rtl"
              type="text"
              id="subject"
              name="subject"
              placeholder="العلوم"
              className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
            />
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 font-medium"
          >
            رقم الهاتف:
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="01067605444"
            className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="grade" className="block text-gray-700 font-medium">
            المرحلة الدراسية:
          </label>
          <select
            dir="rtl"
            name="grade"
            id="grade"
            className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
          >
            {isStudent ? (
              <>
                <optgroup label="المرحلة الإعدادية">
                  <option value="7">الصف الأول الاعدادي</option>
                  <option value="8">الصف الثاني الاعدادي</option>
                  <option value="9">الصف الثالث الاعدادي</option>
                </optgroup>
                <optgroup label="المرحلة الثانوية">
                  <option value="10">الصف الأول الثانوي</option>
                  <option value="11">الصف الثاني الثانوي</option>
                  <option value="12">الصف الثالث الثانوي</option>
                </optgroup>
              </>
            ) : (
              <>
                <option value="prep">المرحلة الإعدادية</option>
                <option value="sec">المرحلة الثانوية</option>
              </>
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            البريد الإلكتروني:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
            className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            كلمة المرور:
          </label>
          <input
            type="text"
            id="password"
            name="password"
            placeholder="Strong_Password_123"
            className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          إنشاء
        </button>
      </div>
    </form>
  );
}
