"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../public/css/oder.css"
import Link from "next/link";
import MonthlyRevenueChart from "../components/MonthlyRevenueChart";
import Swal from 'sweetalert2';


const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
 
  const confirmStatusChange = (orderId, order_status) => {
    Swal.fire({
      title: "Xác nhận cập nhật",
      text: `Bạn có chắc muốn cập nhật trạng thái đơn hàng này không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có, cập nhật!",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusChange(orderId,order_status);
      }
    });
  };
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/stripe/admin/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  // useEffect để gọi fetchOrders một lần khi component mount
  useEffect(() => {
    fetchOrders();
  }, []);

 



  const handleStatusChange = async (orderId,order_status) => {
    if (!selectedOrderStatus) {
      return alert("Please select a status");
    }

   

    try {
      await axios.put(`http://localhost:3000/stripe/admin/orders/${orderId}`, {
        order_status: selectedOrderStatus,
      });

      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Trạng thái đơn hàng đã được cập nhật.",
      });

      // Gọi lại fetchOrders để cập nhật dữ liệu mới nhất
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại!",
        text: "Đã có lỗi xảy ra khi cập nhật trạng thái.",
      });
    }
  };
  
  

  const handleViewDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:3000/stripe/admin/orders/${orderId}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    
    
    <div className="container text mt-5">
      <MonthlyRevenueChart/>
     <h1 className="title">Quản lý Products</h1>
      <div className="add-title">
        <ul className="breadcrumbs">
          <li>
            <Link href={"#"}>Home</Link>
          </li>
          <li className="divider">/</li>
          <li>
            <Link href={"#"} className="active">
              Order
            </Link>
          </li>
        </ul>
         <button
        type="button"
        className="btn btn-primary mb-4"
        data-bs-toggle="modal"
        data-bs-target="#revenueModal"
      >
        Thống kê doanh thu
      </button>
      </div>
      <div className="table-responsive">
      <table className="table  custom-table">
  <thead>
    <tr className="table-light">
      <th>Order ID</th>
      <th>Email</th>
      <th>Payment Status</th>
      <th>Total</th>
      <th>Update Status</th>
      <th>View Details</th>
      <th>Order Status</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order._id}>
        <td>{order._id}</td>
        <td>{order.shipping.email || "No email available"}</td>
        <td>
  <p 
    className={`oder-status ${order.payment_status === "đã thanh toán" ? "oder-status" : ""} 
    ${order.payment_status === "đã hoàn tiền" ? "payment-status-refunded" : ""}`}
  >
    {order.payment_status}
    {order.payment_status === "đã thanh toán" && <i className="bi bi-check"></i>}
    {order.payment_status === "đã hoàn tiền" && <i className="bi bi-x"></i>}
  </p>
</td>

        <td>{order.total.toLocaleString('vi-VN')}đ</td>
                <td>
          <select
            className="form-select custom-select"
            onChange={(e) => {
              if (order.order_status === "đã hủy") {
                Swal.fire({
                  icon: "warning",
                  title: "Không thể thay đổi trạng thái",
                  text: "Đơn hàng đã bị hủy và không thể cập nhật trạng thái mới.",
                });
                return;
              }
              setSelectedOrderStatus(e.target.value);
              setSelectedOrderId(order._id);
            }}
            value={selectedOrderId === order._id ? selectedOrderStatus : order.order_status}
            disabled={order.order_status === "đã hủy"} // Disable select nếu trạng thái là đã hủy
          >
            <option value="chưa giải quyết">Chưa giải quyết</option>
            <option value="đã vận chuyển">Đã vận chuyển</option>
            <option value="đã giao hàng">Đã giao hàng</option>
            <option value="đã hủy">Đã hủy</option>
          </select>
        </td>

        
        <td>
          
          <button
            className="btn btn-primary custom-btn mt-2"
            onClick={() => confirmStatusChange(order._id, order.order_status)}
          >
            Update
          </button>
        </td>
        <td>
          <button
            className="btn btn-info custom-btn"
            data-bs-toggle="modal"
            data-bs-target="#orderDetailsModal"
            onClick={() => handleViewDetails(order._id)}
          >
            View
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* Modal for Order Details */}
      <div
        className="modal fade"
        id="orderDetailsModal"
        tabIndex="-1"
        aria-labelledby="orderDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="orderDetailsModalLabel">
                Order Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
                      {orderDetails ? (
                        <>
                          <p>
                            <strong>Order ID:</strong> {orderDetails._id}
                          </p>
                          <p>
                            <strong>User ID:</strong> {orderDetails.userId}
                          </p>
                          <p>
                            <strong>Payment Intent ID:</strong> {orderDetails.paymentIntentId}
                          </p>
                          <p>
                            <strong>Total:</strong> ${orderDetails.total}
                          </p>
                          <p>
                            <strong>Order Status:</strong> {orderDetails.order_status}
                          </p>
                          <p>
                            <strong>Updated At:</strong> {orderDetails.updatedAt}
                          </p>

                          <h5>Products:</h5>
                          <ul className="list-group">
                            {orderDetails.products.map((product) => (
                              <li key={product._id} className="list-group-item">
                                <div className="d-flex align-items-center">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    width="60"
                                    height="60"
                                    className="me-3 rounded-circle"
                                  />
                                  <div>
                                    <p className="mb-0">
                                      <strong>{product.name}</strong>
                                    </p>
                                    <p className="mb-0 text-muted">Size: {product.size}</p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <h5 className="mt-3">Shipping Info:</h5>
                          <p>
                            <strong>Name:</strong> {orderDetails.shipping.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {orderDetails.shipping.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {orderDetails.phone}
                          </p>
                          <p>
                            <strong>Address:</strong>{" "}
                            {orderDetails.shipping.address.line1}, {orderDetails.shipping.address.city}, {orderDetails.shipping.address.country}
                          </p>

                          {/* Add the discount information */}
                          <h5 className="mt-3">Discount Info:</h5>
                          <p>
                            <strong>Coupon Applied:</strong> {orderDetails.coupon ? orderDetails.coupon : "Không có giảm giá"}
                          </p>
                          <p>
                            <strong>Discount Amount:</strong> {orderDetails.discount ? `${orderDetails.discount}%` : "0%"}
                          </p>

                        </>
                      ) : (
                        <p>Loading details...</p>
                      )}
                    </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

     <MonthlyRevenueChart/>
     
    </div>
  );
};

export default OrderManagement;
