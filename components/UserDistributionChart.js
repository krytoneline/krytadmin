"use client";

import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDistributionChart = () => {
  const router = useRouter();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const getUserDistribution = async () => {
      Api("get", "dashboard/user-distribution", "", router).then(
        (res) => {
          console.log("User distribution data:", res);
          setChartData(res.data);
        },
        (err) => {
          console.log("Error fetching user distribution data:", err);
        }
      );
    };

    getUserDistribution();
  }, []);

  const data = {
    labels: ["Users", "Sellers"],
    datasets: [
      {
        data: chartData ? [
          chartData.distribution.USER,
          chartData.distribution.SELLER
        ] : [],
        backgroundColor: [
          "#007bff",
          "#28a745",
        ],
        borderColor: [
          "#0056b3",
          "#1e7e34",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 },
          padding: 20,
        }
      },
      title: {
        display: true,
        text: `User Distribution (Total: ${chartData?.total || 0})`,
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return <Pie data={data} options={options} />;
};

export default UserDistributionChart;
