import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useExamsResultsByTeacherId } from "../QueriesAndMutations/QueryHooks";
import Loader from "../components/Loader";
import ErrorPlaceHolder from "./ErrorPlaceHolder";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../config/supabase";
import toast from "react-hot-toast";

const getExamName = async (examId) => {
  const { data: exam, error } = await supabase
    .from("exams")
    .select("title")
    .eq("id", examId)
    .single();

  if (error) {
    toast.error(error.message);
    return null;
  }

  return exam.title;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 rounded bg-white shadow border text-sm text-gray-800">
        <p className="font-bold">{data.examName}</p>
        <p>
          الدرجة: {data.grade} من {data.total}
        </p>
      </div>
    );
  }

  return null;
};

export default function ExamCurveChart({ teacher, student }) {
  const [chartData, setChartData] = useState([]);
  const [isLoadingNames, setIsLoadingNames] = useState(true);

  const {
    data: exmasResults,
    isLoading: isExmasResultsLoading,
    error: exmasResultsError,
  } = useExamsResultsByTeacherId(teacher.id, student);

  useEffect(() => {
    const loadChartData = async () => {
      if (!exmasResults) {
        setIsLoadingNames(false);
        return;
      }

      if (!student.examsTaken || student.examsTaken.length === 0) {
        setChartData([]); // مفيش امتحانات
        setIsLoadingNames(false);
        return;
      }

      const examsTakenByStudent = exmasResults.filter((examResult) =>
        student.examsTaken.includes(examResult.examId)
      );

      if (examsTakenByStudent.length === 0) {
        setChartData([]);
        setIsLoadingNames(false);
        return;
      }

      const data = await Promise.all(
        examsTakenByStudent.map(async (exam) => ({
          examName: await getExamName(exam.examId),
          percentage: Math.round((exam.grade / exam.total) * 100),
          grade: exam.grade,
          total: exam.total,
        }))
      );

      setChartData(data);
      setIsLoadingNames(false);
    };

    loadChartData();
  }, [exmasResults, student.examsTaken]);

  if (isExmasResultsLoading || isLoadingNames)
    return <Loader message="جاري التحميل" />;

  if (exmasResultsError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب الامتحانات الخاصة بهذا الطالب" />
    );
  }

  if (!chartData.length) {
    return (
      <NoDataPlaceHolder
        message="لم يتم العثور على امتحانات سابقة"
        icon={faFileAlt}
      />
    );
  }

  return (
    <div
      style={{ width: "100%", height: 300 }}
      className="p-3 border border-gray-200 rounded-lg bg-white flex items-center justify-center"
    >
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="examName" />
          <YAxis unit="%" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
