"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Users() {
  const [data, setData] = useState([]);
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3000/users", {
      cache: "no-store",
    });
    const newData = await res.json();
    setData(newData);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUsers = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
      const res = await fetch(`http://localhost:3000/deleteuser/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.message) {
        fetchUsers();
      }
    }
  };

  return (
    <>
      <h1 className="title">Quản lý Users</h1>
      <div className="add-title">
        <ul className="breadcrumbs">
          <li>
            <Link href={"#"}>Home</Link>
          </li>
          <li className="divider">/</li>
          <li>
            <Link href={"#"} className="active">
              User List
            </Link>
          </li>
        </ul>
        <Link href={"/QuanlyUsers/addUser"} className="add">
          Thêm tài khoản
        </Link>
      </div>
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h6>Table</h6>
          </div>
          <div className="table-wrapper">
            <table className="authors-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên & Email</th>
                  <th>SĐT & Địa chỉ</th>
                  <th>Mật khẩu</th>
                  <th>Quyền</th>
                  <th>Ngày đăng ký</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="author-info">
                        <img
                          src={`http://localhost:3000/img/${user.avatar}`}
                          alt="John Michael"
                          className="avatar"
                        />
                        <div>
                          <h6>{user.fullname}</h6>
                          <small className="email">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="sdt">(+84) {user.phone}</p>
                      <small className="address">{user.address}</small>
                    </td>
                    <td className="password">
                      <small>*********</small>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin" ? "admin" : "user"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <small className="date">{user.createdAt}</small>
                    </td>
                    <td>
                      <Link
                        href={`QuanlyUsers/editUser/${user._id}`}
                        className="edit-link"
                      >
                        <i className="fa-solid fa-user-pen"></i>
                      </Link>
                      <Link href={"#"} className="delete-link">
                        <i
                          className="fa-solid fa-trash"
                          onClick={() => deleteUsers(user._id)}
                        ></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
