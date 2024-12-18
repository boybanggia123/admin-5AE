"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function QuanlyCategories() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("");
  const itemsPerPage = 5;
  const fetchCategories = async () => {
    // lấy dữ liệu , thêm lên đầu trang
    try {
      const res = await fetch("http://localhost:3000/categories", {
        cache: "no-store",
      });
      const categories = await res.json();
      categories.sort((a, b) => b._id.localeCompare(a._id));
      setData(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      const res = await fetch(`http://localhost:3000/deletecategory/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.message) {
        fetchCategories();
      }
    }
  };

  // Tính toán các mục hiển thị
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <h1 className="title">Quản lý danh mục</h1>
      <div className="add-title">
        <ul className="breadcrumbs">
          <li>
            <Link href={"#"}>Trang chủ</Link>
          </li>
          <li className="divider">/</li>
          <li>
            <Link href={"#"} className="active">
              Danh sách danh mục
            </Link>
          </li>
        </ul>
        <Link href={"QuanlyCategories/addCategory"} className="add">
          Thêm danh mục
        </Link>
      </div>
      <div className="container mt-3">
        <div className="card border-0">
          <div className="card-header">
            <h6>Table</h6>
          </div>
          <div className="table-wrapper">
            <table className="authors-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((category, index) => (
                  <tr key={category._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>
                      <div className="author-info">
                        <small>{category.name}</small>
                      </div>
                    </td>
                    <td>
                      <small>{category.description}</small>
                    </td>
                    <td>
                      <Link
                        href={`QuanlyCategories/editCategory/${category._id}`}
                        className="edit-link"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                      <Link
                        href={"#"}
                        className="delete-link"
                        onClick={() => deleteCategory(category._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pagination mt-3">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => paginate(page)}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`pagination-btn ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            »
          </button>
        </div>
      </div>
    </>
  );
}
