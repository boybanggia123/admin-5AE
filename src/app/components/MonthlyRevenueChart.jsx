import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";

const MonthlyRevenueChart = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [filteredMonth, setFilteredMonth] = useState(""); // Tháng được chọn để lọc


 
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/stripe/admin/orders");
        const orders = response.data;

        // Xử lý nhóm dữ liệu theo tháng
        const revenueData = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt);
          const month = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`; // YYYY-MM
          acc[month] = (acc[month] || 0) + order.total;
          return acc;
        }, {});

        // Chuyển đổi sang mảng
        const revenueArray = Object.entries(revenueData).map(([month, revenue]) => ({
          month,
          revenue,
        }));

        setMonthlyRevenue(revenueArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`); // Màu với độ trong suốt
    }
    return colors;
  };

  // Lọc dữ liệu theo tháng
  const filteredData =
    filteredMonth === ""
      ? monthlyRevenue
      : monthlyRevenue.filter((data) => data.month === filteredMonth);

  const chartData = {
    labels: filteredData.map((data) => data.month),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: filteredData.map((data) => data.revenue),
        backgroundColor: generateColors(filteredData.length), // Tạo màu động
        borderColor: generateColors(filteredData.length).map((color) =>
          color.replace("0.8", "1")
        ), // Viền màu đậm
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#000", // Màu chữ trong phần chú thích
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `Doanh thu: ${tooltipItem.raw.toLocaleString()} VNĐ`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#444", // Màu chữ trục X
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} VNĐ`,
          color: "#444", // Màu chữ trục Y
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div
      className="modal fade"
      id="revenueModal"
      tabIndex="-1"
      aria-labelledby="revenueModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="revenueModalLabel">
              Thống kê doanh thu hàng tháng
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* Dropdown lọc tháng */}
            <div className="mb-3">
              <label htmlFor="monthFilter" className="form-label">
                Chọn tháng:
              </label>
              <select
                id="monthFilter"
                className="form-select "
                value={filteredMonth}
                onChange={(e) => setFilteredMonth(e.target.value)}
              >
                <option value="">Tất cả</option>
                {monthlyRevenue.map((data) => (
                  <option key={data.month} value={data.month}>
                    {data.month}
                  </option>
                ))}
              </select>
            </div>

            {/* Biểu đồ */}
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRevenueChart;
