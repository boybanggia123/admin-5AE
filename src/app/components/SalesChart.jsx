"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const orderStatusColors = {
  "đã vận chuyển": "rgba(54, 162, 235, 0.8)", // Xanh lam nhạt
  "đã giao hàng": "rgba(75, 192, 192, 0.8)", // Xanh lục nhạt
  "đã hủy": "rgba(255, 99, 132, 0.8)", // Đỏ nhạt
  "chưa giải quyết": "rgba(201, 203, 207, 0.8)", // Xám nhạt
};

const SalesLineChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/stripe/admin/orders"
        ); // API của bạn
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const processedData = salesData.reduce((acc, item) => {
    const date = new Date(item.createdAt);
    const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
    const orderStatus = item.order_status?.toLowerCase() || "chưa xác định";

    if (!acc[month]) {
      acc[month] = {};
    }
    if (!acc[month][orderStatus]) {
      acc[month][orderStatus] = 0;
    }
    acc[month][orderStatus] += item.total;

    return acc;
  }, {});

  const labels = Object.keys(processedData); // Các tháng
  const orderStatuses = Object.keys(orderStatusColors); // Các trạng thái

  const datasets = orderStatuses.map((orderStatus) => ({
    label: orderStatus,
    data: labels.map((month) => processedData[month]?.[orderStatus] || 0),
    borderColor: orderStatusColors[orderStatus],
    backgroundColor: orderStatusColors[orderStatus],
    tension: 0.4, // Làm mềm các đường
    fill: false,
  }));

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ trạng thái",
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesLineChart;
