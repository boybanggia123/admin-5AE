"use client";
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";

export default function QuanlyProducts() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [originalData, setOriginalData] = useState([]); 
  const [sortType, setSortType] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products", {
        cache: "no-store",
      });
      const fetchedData = await res.json();
      fetchedData.sort((a, b) => new Date(b.dayadd) - new Date(a.dayadd)); // Sắp xếp theo ngày mới nhất
      setData(fetchedData); // Lưu dữ liệu hiển thị
      setOriginalData(fetchedData); // Lưu dữ liệu gốc
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch("http://localhost:3000/categories");
      const data = await res.json();
      setCategories(data);
    };
    getCategories();
  }, []);

  useEffect(() => {
    fetchProducts(); // Gọi hàm fetch khi component được mount
  }, []);

  useEffect(() => {
    // Kiểm tra xem đã có giá trị bộ lọc lưu trong localStorage chưa
    const savedSortType = localStorage.getItem("sortType");
    if (savedSortType) {
      setSortType(savedSortType);
      handleSort(savedSortType); // Áp dụng bộ lọc đã lưu
    }
  }, []);

  const deleteProduct = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      const res = await fetch(
        `http://localhost:3000/uploads/deleteproduct/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      if (result.message) {
        fetchProducts();
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Chưa có danh mục";
  };


  const handleSort = (sortType) => {
  let sortedData = [...originalData];  // Sao chép dữ liệu ban đầu để tránh sửa trực tiếp vào dữ liệu gốc
  
  switch (sortType) {
    case "newest":
      // Sắp xếp sản phẩm mới nhất lên đầu mỗi khi chọn "Mới nhất"
      sortedData.sort((a, b) => new Date(b.dayadd) - new Date(a.dayadd));
      break;
    case "oldest":
      sortedData.sort((a, b) => new Date(a.dayadd) - new Date(b.dayadd));
      break;
    case "priceDesc":
      sortedData.sort((a, b) => b.price - a.price);
      break;
    case "priceAsc":
      sortedData.sort((a, b) => a.price - b.price);
      break;
    default:
      break;
  }

  setData(sortedData); // Cập nhật lại dữ liệu sau khi sắp xếp
  setSortType(sortType); // Cập nhật trạng thái của sortType
  localStorage.setItem("sortType", sortType); // Lưu bộ lọc vào localStorage
};
  return (
    <>
      <h1 className="title">Quản lý Products</h1>
      <div className="add-title">
        <ul className="breadcrumbs">
          <li>
            <Link href={"#"}>Home</Link>
          </li>
          <li className="divider">/</li>
          <li>
            <Link href={"#"} className="active">
              Products
            </Link>
          </li>
        </ul>
        <Link href="/QuanlyProducts/addProduct" className="add">
          Thêm sản phẩm
        </Link>
      </div>
      <div className="container mt-3">
        <div className="card">
          <div className="card-header">
            <h6>Table</h6>
            <select
              value={sortType}
              onChange={(e) => handleSort(e.target.value)}
              className="form-select"
              style={{ width: "200px", marginLeft: "auto" }}
            >
               <option value="" hidden>
                Sắp xếp sản phẩm
              </option>
               
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="priceDesc">Giá cao đến thấp</option>
              <option value="priceAsc">Giá thấp đến cao</option>
            </select>
          </div>
          <div className="table-wrapper">
            <table className="authors-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Danh mục</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="author-info">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="avatarProduct"
                          />
                        </div>
                      </td>
                      <td>
                        <small>{product.name}</small>
                      </td>
                      <td>
                        <p>{product.price.toLocaleString('vi-VN')}đ</p>
                      </td>
                      <td>
                        <p>{product.quantity}</p>
                      </td>
                      <td>
                        <small>{getCategoryName(product.categoryId)}</small>
                      </td>
                      <td>
                        <small>{product.description}</small>
                      </td>
                      <td>
                        <Link
                          href={`QuanlyProducts/editProduct/${product._id}`}
                          className="edit-link"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                        <Link
                          href={"#"}
                          className="delete-link"
                          onClick={() => deleteProduct(product._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">Đang tải dữ liệu...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
