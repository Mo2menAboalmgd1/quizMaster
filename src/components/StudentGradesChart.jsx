import React, { useEffect, useState, useRef } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useExamsResultsByTeacherId } from "../QueriesAndMutations/QueryHooks";
import Loader from "../components/Loader";
import ErrorPlaceHolder from "./ErrorPlaceHolder";
import NoDataPlaceHolder from "./NoDataPlaceHolder";
import { faFileAlt, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../config/supabase";
import toast from "react-hot-toast";
import { useCurrentUser } from "../store/useStore";

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
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3">
        <p className="font-bold text-gray-800 text-sm">{data.examName}</p>
        <div className="mt-1 pt-1 border-t border-gray-100">
          <p className="text-sm">
            <span className="text-gray-600">Grade:</span>
            <span className="font-medium ml-1">{data.correct}</span>
            <span className="text-gray-500 mx-1">of</span>
            <span className="font-medium">{data.total}</span>
          </p>
          <p className="text-sm mt-1">
            <span className="text-gray-600">Percentage:</span>
            <span className="font-medium ml-1 text-green-600">
              {data.percentage}%
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default function GradesChart({ teacher, student }) {
  const [chartData, setChartData] = useState([]);
  const [isLoadingNames, setIsLoadingNames] = useState(true);
  const chartRef = useRef(null);
  const printFrameRef = useRef(null);
  const { currentUser } = useCurrentUser();

  const {
    data: exmasResults,
    isLoading: isExmasResultsLoading,
    error: exmasResultsError,
  } = useExamsResultsByTeacherId(teacher.id, student.id);

  const examsTakenByStudent = exmasResults?.filter(
    (examResult) => examResult.studentId === student.id
  );

  // Create hidden iframe for printing when component mounts
  useEffect(() => {
    if (!printFrameRef.current) {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.style.position = "absolute";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.name = "chart-print-frame";
      iframe.id = "chart-print-frame";
      document.body.appendChild(iframe);
      printFrameRef.current = iframe;
    }

    return () => {
      const iframe = printFrameRef.current;
      if (iframe && iframe.parentNode === document.body) {
        document.body.removeChild(iframe); // ✅ يتأكد إنه موجود جوه body
      }
    };
  }, []);

  useEffect(() => {
    const loadChartData = async () => {
      if (!exmasResults) {
        setIsLoadingNames(false);
        return;
      }

      if (!examsTakenByStudent || examsTakenByStudent.length === 0) {
        setChartData([]); // مفيش اختبارات
        setIsLoadingNames(false);
        return;
      }

      const data = await Promise.all(
        examsTakenByStudent.map(async (exam) => ({
          examName: await getExamName(exam.examId),
          percentage: Math.round((exam.correct / exam.total) * 100),
          correct: exam.correct,
          total: exam.total,
        }))
      );

      setChartData(data);
      setIsLoadingNames(false);
    };

    loadChartData();
  }, [exmasResults, student.id]);

  const handlePrintChart = () => {
    // Make sure we have a chart to print
    if (!chartRef.current) return;

    // Get the iframe document
    const iframe = printFrameRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Create print-specific CSS
    const styles = `
      @media print {
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .chart-container { page-break-inside: avoid; }
        .print-header { margin-bottom: 20px; text-align: center; }
        svg { max-width: 100%; height: auto; }
      }
      body { background: white; }
      .chart-container { 
        background: #f9fafb; 
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        padding: 20px;
      }
      .print-header h1 {
        font-size: 18px;
        margin-bottom: 5px;
        color: #1f2937;
      }
      .print-header p {
        font-size: 14px;
        color: #6b7280;
        margin-top: 0;
      }
    `;

    // Clone the chart element to modify for printing
    const chartElement = chartRef.current.cloneNode(true);

    // Create HTML content for the print document
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${student.name} - Exam Performance</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="print-header">
            <h1>${student.name} - Exam Performance</h1>
            <p>Teacher: ${teacher.name}</p>
          </div>
          <div class="chart-container">
            ${chartElement.outerHTML}
          </div>
        </body>
      </html>
    `;

    // Write to the iframe document
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Wait for content to be fully loaded
    setTimeout(() => {
      // Print the iframe
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Show a success message
      toast.success("Printing chart...");
    }, 500);
  };

  if (isExmasResultsLoading || isLoadingNames)
    return <Loader message="جاري التحميل" />;

  if (exmasResultsError) {
    return (
      <ErrorPlaceHolder message="حدث خطأ أثناء جلب الاختبارات الخاصة بهذا الطالب" />
    );
  }

  if (!chartData.length) {
    return (
      <NoDataPlaceHolder
        message="لم يتم العثور على اختبارات سابقة"
        icon={faFileAlt}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-300">
      <div className="flex justify-between items-center">
        {student.id !== currentUser.id && (
          <button
            onClick={handlePrintChart}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>Print Chart</span>
          </button>
        )}
      </div>

      <div
        ref={chartRef}
        className="bg-gray-50 p-4"
        // style={{ height: "300px", maxHeight: "300px" }}
      >
        <ResponsiveContainer height={250} className="mt-3">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="examName" stroke="#666" tick={{ fontSize: 12 }} />
            <YAxis
              unit="%"
              domain={[0, 100]}
              stroke="#666"
              tick={{ fontSize: 12 }}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="percentage"
              fill="#4ade80"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
