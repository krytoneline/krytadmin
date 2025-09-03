"use client"; // 👈 required in Next.js 13+ app directory

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Api } from '@/services/service';
import { useRouter } from "next/router";

const LineChart = () => {
  const router = useRouter();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const getMonthlyChartData = async () => {
      Api("get", "dashboard/monthly-chart", "", router).then(
        (res) => {
          console.log("Monthly chart data:", res);
          setChartData(res.data);
        },
        (err) => {
          console.log("Error fetching chart data:", err);
        }
      );
    };

    getMonthlyChartData();
  }, []);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Profit ($)",
        data: chartData?.monthlyData?.profit || [],
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        tension: 0.4,
      },
      {
        label: "Credit Transactions",
        data: chartData?.monthlyData?.credit || [],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.4,
      },
      {
        label: "Debit Transactions",
        data: chartData?.monthlyData?.debit || [],
        borderColor: "#dc3545",
        backgroundColor: "rgba(220, 53, 69, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
      title: { 
        display: true, 
        text: `Monthly Dashboard Data ${chartData?.year || new Date().getFullYear()}`,
        font: { size: 16 }
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 } }
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 12 } }
      },
    },
    elements: {
      point: { radius: 4, hoverRadius: 6 },
      line: { borderWidth: 2 }
    }
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
