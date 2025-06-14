import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import { useCurrentUser, useDarkMode } from "../../store/useStore";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserCheck,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import PageWrapper from "../../components/PageWrapper";

export default function SearchTeachers() {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();
  const userId = currentUser?.id;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 🕒 Debounce manually
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // 🔄 جلب المدرسين اللي الطالب مشترك معاهم
  const { data: myTeachers, isLoading: isLoadingMyTeachers } = useQuery({
    queryKey: ["myTeachers", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers_students")
        .select("teacherId")
        .eq("studentId", userId);

      if (error) throw new Error(error.message);
      return data.map((d) => d.teacherId);
    },
    enabled: !!userId,
  });

  // 🔎 البحث في المدرسين
  const { data: results = [], isLoading: isSearching } = useQuery({
    queryKey: ["searchTeachers", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];

      const { data, error } = await supabase
        .from("teachers")
        .select("id, name, userName, subject, avatar")
        .or(
          `name.ilike.%${debouncedQuery}%,userName.ilike.%${debouncedQuery}%`
        );

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!debouncedQuery,
  });

  return (
    <PageWrapper title={"البحث عن معلمين"}>
      <h2
        className={clsx(
          "mb-3 font-bold",
          isDarkMode ? "text-white" : "text-gray-700"
        )}
      >
        ابحث بالاسم أو اسم المستخدم
      </h2>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <input
          type="text"
          placeholder="أحمد حسن أو ahmed224"
          className={clsx(
            "w-full h-12 border rounded-lg py-2 px-4 ps-11 pl-10 outline-none",
            isDarkMode
              ? "bg-slate-900 border-blue-500/50 focus:border-blue-500"
              : "bg-gray-100 text-gray-800 border-gray-200 focus:border-blue-500"
          )}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {/* {!query && (
        <p className="text-xs text-gray-400 -mt-3 px-1">
          مثال: أحمد حسن أو ahmed224
        </p>
      )} */}

      {(isSearching || isLoadingMyTeachers) && (
        <div className="flex items-center justify-center py-8 text-blue-500">
          <p>جارٍ البحث...</p>
        </div>
      )}

      {!isSearching &&
        !isLoadingMyTeachers &&
        results.length === 0 &&
        debouncedQuery && (
          <div
            className={clsx(
              "rounded-xl p-6 text-center",
              isDarkMode ? "bg-blue-500/10" : "bg-gray-50"
            )}
          >
            <p className="font-medium">لا يوجد نتائج مطابقة</p>
            <p className="text-gray-400 text-sm mt-1">
              حاول استخدام كلمات بحث مختلفة
            </p>
          </div>
        )}

      <div className="flex gap-5 justify-center flex-wrap">
        {results.map((teacher) => {
          const alreadyJoined = myTeachers?.includes(teacher.id);
          teacher;

          return (
            <Link
              key={teacher.id}
              to={`/studentTeachers/${teacher.id}`}
              className={clsx(
                "p-4 rounded-xl transition-all duration-200 flex justify-between items-center group max-w-60"
              )}
            >
              <div className="flex flex-col juce items-center gap-2">
                {teacher.avatar ? (
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-36 h-36 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={clsx(
                      " text-blue-600 rounded-full h-36 w-36 flex items-center justify-center shrink-0 text-3xl",
                      isDarkMode ? "bg-blue-500/10" : "bg-blue-100",
                      alreadyJoined &&
                        (isDarkMode
                          ? "bg-green-500/10 text-green-500"
                          : "bg-green-100 text-green-600")
                    )}
                  >
                    <FontAwesomeIcon
                      icon={alreadyJoined ? faUserCheck : faUserPlus}
                    />
                  </div>
                )}
                <div className="text-center space-y-1 mt-2">
                  <p>
                    <span>{teacher.name}</span>
                    <span> - {teacher.subject}</span>
                  </p>
                  <p className="text-sm text-gray-500">@{teacher.userName}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Show this when no search is active */}
      {!debouncedQuery && !isSearching && (
        <div
          className={clsx(
            "rounded-lg flex flex-col items-center justify-center h-28",
            isDarkMode
              ? "bg-blue-500/10 border border-blue-500/50"
              : "bg-gray-100 border border-gray-200"
          )}
        >
          <p className="font-medium">ابدأ البحث للعثور على المعلمين</p>
          <p className="text-sm text-gray-500 mt-2">
            يمكنك البحث بالاسم أو اسم المستخدم
          </p>
        </div>
      )}
    </PageWrapper>
  );
}
