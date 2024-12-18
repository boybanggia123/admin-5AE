"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2';

export default function EditProduct({ params }) {
  const router = useRouter();
  const id = params.id;

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [isProductLoaded, setIsProductLoaded] = useState(false);
 
  const [oldImage, setOldImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);  // State lưu ảnh phụ
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  

 
  // Lấy danh mục sản phẩm
  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch("http://localhost:3000/categories");
      const data = await res.json();
      setCategories(data);
    };
    getCategories();

    // Lấy thông tin sản phẩm cần sửa
    const getProduct = async () => {
      const res = await fetch(`http://localhost:3000/productdetail/${id}`);
      const data = await res.json();
      setProduct(data);
      setIsProductLoaded(true);
    };

    if (id) {
      getProduct();
    }
  }, [id]);
  
  // khai báo màu sản phẩm 
  const translateColorToHex = (color) => {
    switch (color) {
      case "Đen":
        return "#000000";
      case "Xanh dương":
        return "#0000FF";
      case "Xám":
        return "#808080";
      case "Đỏ":
        return "#FF0000";
      case "Nâu":
        return "#8B4513";
      case "Xanh lá":
        return "#008000";
      case "Hồng":
        return "#FFC0CB";
      case "Trắng":
        return "#FFFFFF";
      default:
        return "#ccc"; // Màu mặc định nếu không tìm thấy
    }
  };
  

  

  useEffect(() => {
    if (product && product.image) {
      setOldImage(product.image); // Đảm bảo set ảnh cũ từ product
    }
  }, [product]); // Cập nhật lại oldImage khi product thay đổi

  

  

console.log("Old Image:", oldImage);


    const formik = useFormik({
      initialValues: {
        image: null,
        additionalImages: [],
        name: "",
        description: "",
        price: "",
        discountedPrice: "",
        size: [],
        quantity: 0,
        status: "out of stock",
        hot: false,
        categoryId: "",
        color: [],
      },
      validationSchema: Yup.object({
        image: Yup.mixed().required("Vui lòng thêm hình ảnh"),
        additionalImages: Yup.array().of(Yup.mixed()).optional(),
        name: Yup.string().max(100, "Tên sản phẩm không quá 100 ký tự").required("Vui lòng nhập tên sản phẩm"),
        description: Yup.string().required("Vui lòng nhập mô tả sản phẩm"),
        price: Yup.number().required("Giá sản phẩm là bắt buộc"),
        discountedPrice: Yup.number().optional(),
        size: Yup.array().min(1, "Vui lòng chọn ít nhất một kích thước"),
        quantity: Yup.number().required("Vui lòng nhập số lượng sản phẩm"),
        status: Yup.string().required("Vui lòng chọn trạng thái sản phẩm"),
        hot: Yup.boolean(),
        categoryId: Yup.string().required("Vui lòng chọn danh mục sản phẩm"),
        color: Yup.array().of(Yup.string().required("Vui lòng nhập màu sắc")),
      }),
      onSubmit: async (values, { setSubmitting, setFieldError }) => {
        const imageToSend = formik.values.image || oldImage;

        const formData = new FormData();
        formData.append("images", imageToSend);
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("discountedPrice", values.discountedPrice);
        formData.append("size", JSON.stringify(values.size));
        formData.append("quantity", values.quantity);
        formData.append("status", values.status);
        formData.append("hot", values.hot);
        formData.append("categoryId", values.categoryId);
        formData.append("color", JSON.stringify(values.color));

        // Gộp ảnh cũ và ảnh mới
        const allAdditionalImages = [
          ...(product?.additionalImages || []), // Ảnh cũ
          ...additionalImages, // Ảnh mới
        ];
        
        // Đảm bảo các giá trị trong mảng là file hoặc URL, tránh thêm `undefined`
        const filteredImages = allAdditionalImages.filter(Boolean);
        
        filteredImages.forEach((image) => {
          formData.append("additionalImages", image);
        });

        try {
          const res = await fetch(
            `http://localhost:3000/uploads/updateproduct/${id}`,
            {
              method: "PUT",
              body: formData,
            }
          );

          if (!res.ok) {
            const errorData = await res.json();
            if (res.status === 400 && errorData.message === "Sản phẩm đã tồn tại") {
              setFieldError("name", "Sản phẩm đã tồn tại");
            } else {
              throw new Error(errorData.message || "Cập nhật sản phẩm thất bại");
            }
          }

          alert("Cập nhật sản phẩm thành công");
          router.push("/QuanlyProducts");
        } catch (error) {
          setFieldError("general", error.message);
        } finally {
          setSubmitting(false);
        }
      },
    });


  
 
  

  useEffect(() => {
    if (isProductLoaded && product) {
      formik.setValues({
        image: product.image || null,
        additionalImages: product.additionalImages || [],
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        discountedPrice: product.discountedPrice || "",
        size: product.size || [],
        quantity: product.quantity || 0,
        status: product.status || "out of stock",
        hot: product.hot || false,
        categoryId: product.categoryId || "",
        color: product.color || [],
      });
    }
  }, [isProductLoaded, product]);

  const handleAdditionalImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
  
    setAdditionalImages((prevImages) => [...prevImages, ...files]);
    setAdditionalImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  
  const handleRemoveAdditionalImage = (index, isOldImage) => {
    // Ngừng form submission trong khi xóa ảnh
    event.preventDefault();
  
    // Hiển thị modal xác nhận với sweetalert2
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa ảnh này?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Nếu người dùng chọn "Đồng ý", thực hiện xóa ảnh và cập nhật trạng thái sau
        if (isOldImage) {
          // Xóa ảnh cũ trong `product`
          const updatedOldImages = product.additionalImages.filter((_, i) => i !== index);
          setProduct((prev) => ({
            ...prev,
            additionalImages: updatedOldImages,
          }));
        } else {
          // Xóa ảnh mới trong `additionalImages`
          const updatedNewImages = additionalImages.filter((_, i) => i !== index);
          const updatedNewPreviews = additionalImagePreviews.filter((_, i) => i !== index);
          setAdditionalImages(updatedNewImages);
          setAdditionalImagePreviews(updatedNewPreviews);
        }
    
        // Hiển thị thông báo thành công
        Swal.fire('Đã xóa!', 'Ảnh đã bị xóa thành công.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Nếu người dùng chọn "Hủy", không làm gì cả
        Swal.fire('Đã hủy', 'Ảnh không bị xóa.', 'error');
      }
    });
  };
  

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file); // Set file mới vào formik
      setImagePreview(URL.createObjectURL(file)); // Tạo preview ảnh mới
    }
  };
  

  if (!isProductLoaded) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <>
      <h1 className="title">Quản lý Sản phẩm</h1>
      <div className="add-title">
        <ul className="breadcrumbs">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li className="divider">/</li>
          <li>
            <Link href="/addProduct" className="active">
              Sửa sản phẩm
            </Link>
          </li>
        </ul>
      </div>
      <div className="container-add mt-3">
        <div className="form_addproduct-add">
          <form onSubmit={formik.handleSubmit}>
            {/* Các trường input tương tự như trang AddProduct */}
            <div className="form-groupadd-1">
            <label>Hình ảnh</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
            />
            {formik.touched.image && formik.errors.image && (
              <div className="error">{formik.errors.image}</div>
            )}

           {/* Hiển thị ảnh cũ nếu có */}
            {oldImage && (
              <div>
                <p>Ảnh cũ:</p>
                <img
                  src={oldImage}
                  alt="Old Product"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
            )}

            {/* Hiển thị ảnh mới nếu người dùng chọn ảnh mới */}
            {imagePreview && (
              <div>
                <p>Ảnh mới:</p>
                <img
                  src={imagePreview}
                  alt="New Product"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
            )}

            {/* Nếu không có ảnh mới được chọn, hiển thị ảnh cũ */}
            {!imagePreview && !formik.values.image && !oldImage && (
              <p>No image available</p>
            )}

          </div>
          
          <div className="form-groupadd-1">
      <label>Ảnh phụ</label>
      <input
        type="file"
        multiple
        name="additionalImages"
        onChange={handleAdditionalImageChange}
      />
      {formik.touched.additionalImages && formik.errors.additionalImages && (
        <div className="error">{formik.errors.additionalImages}</div>
      )}

      {/* Hiển thị preview ảnh phụ mới */}
      <div className="additional-images-preview">
        {additionalImagePreviews.map((preview, index) => (
          <div key={index} className="additional-image-item">
            <img
              src={preview}
              alt={`Additional Preview ${index + 1}`}
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                margin: "5px",
                position: "relative",
              }}
            />
            <button
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handleRemoveAdditionalImage(index, false)}
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Hiển thị ảnh phụ cũ nếu có */}
              {product.additionalImages && product.additionalImages.length > 0 && (
          <div>
            <p>Ảnh phụ cũ:</p>
            {product.additionalImages.map((image, index) => (
              <div key={index} className="additional-image-item">
                <img
                  src={image}
                  alt={`Old Additional Image ${index + 1}`}
                  style={{ maxWidth: "100px", maxHeight: "100px", margin: "5px" }}
                />
                <button
                  onClick={() => handleRemoveAdditionalImage(index, true)}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
    </div>



            <div className="form-groupadd-1">
              <label>Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Tên sản phẩm"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error">{formik.errors.name}</div>
              )}
            </div>

            <div className="form-groupadd-1">
              <label>Mô tả</label>
              <input
                type="text"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Mô tả sản phẩm"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="error">{formik.errors.description}</div>
              )}
            </div>

            <div className="form-groupadd-1">
              <label>Giá sản phẩm</label>
              <input
                type="number"
                name="price"
                value={formik.values.price.toLocaleString('vi-VN')}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Giá sản phẩm"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="error">{formik.errors.price}</div>
              )}
            </div>

            <div className="form-groupadd-1">
              <label>Giá giảm giá</label>
              <input
                type="number"
                name="discountedPrice"
                value={formik.values.discountedPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Giá giảm giá (tùy chọn)"
              />
              {formik.touched.discountedPrice &&
                formik.errors.discountedPrice && (
                  <div className="error">{formik.errors.discountedPrice}</div>
                )}
            </div>

            <div className="form-groupadd-1">
              <label>Kích thước</label>
              <input
                type="text"
                name="size"
                value={formik.values.size.join(", ")}
                onChange={(e) => {
                  formik.setFieldValue("size", e.target.value.split(","));
                }}
                onBlur={formik.handleBlur}
                placeholder="Các kích thước (Cách nhau bằng dấu phẩy)"
              />
              {formik.touched.size && formik.errors.size && (
                <div className="error">{formik.errors.size}</div>
              )}
            </div>

            <div className="form-groupadd-1">
                      <label>Màu sản phẩm</label>
                      <div className="color-palette">
                        {["Đen", "Xanh dương", "Xám", "Đỏ", "Nâu", "Xanh lá", "Hồng", "Trắng"].map((color, index) => (
                          <div
                            key={index}
                            className="color-option"
                            style={{
                              backgroundColor: translateColorToHex(color), // Gán mã màu tương ứng
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              margin: "5px",
                              cursor: "pointer",
                              border: formik.values.color.includes(color) ? "3px solid #000" : "1px solid #ccc",
                            }}
                            onClick={() => {
                              if (formik.values.color.includes(color)) {
                                // Nếu màu đã được chọn, xóa khỏi danh sách
                                formik.setFieldValue(
                                  "color",
                                  formik.values.color.filter((c) => c !== color)
                                );
                              } else {
                                // Nếu chưa chọn, thêm màu vào danh sách
                                formik.setFieldValue("color", [...formik.values.color, color]);
                              }
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* Hiển thị danh sách màu đã chọn */}
                      <div className="selected-colors">
                        {formik.values.color.map((color, index) => (
                          <div key={index} className="color-item" style={{ display: "flex", alignItems: "center" }}>
                            <span
                              style={{
                                backgroundColor: translateColorToHex(color),
                                display: "inline-block",
                                width: "20px",
                                height: "20px",
                                marginRight: "5px",
                                borderRadius: "50%",
                              }}
                            ></span>
                            {color}
                            <button
                              type="button"
                              className="remove-color-btn"
                              style={{ marginLeft: "10px", cursor: "pointer", border: "none", background: "transparent", color: "red" }}
                              onClick={() =>
                                formik.setFieldValue(
                                  "color",
                                  formik.values.color.filter((c) => c !== color)
                                )
                              }
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Hiển thị lỗi nếu có */}
                      {formik.touched.color && formik.errors.color && (
                        <div className="error">{formik.errors.color}</div>
                      )}
                    </div>



            <div className="form-groupadd-1">
              <label>Số lượng</label>
              <input
                type="number"
                name="quantity"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Số lượng sản phẩm"
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <div className="error">{formik.errors.quantity}</div>
              )}
            </div>

            <div className="form-groupadd-1">
              <label>Trạng thái</label>
              <select
                className="select-status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="out of stock">Hết hàng</option>
                <option value="in stock">Còn hàng</option>
              </select>
            </div>

            <div className="form-groupadd-1">
              <label>Danh mục</label>
              <select
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <div className="error">{formik.errors.categoryId}</div>
              )}
            </div>

            <div className="form-groupadd-1">
              <label>Sản phẩm nổi bật</label>
              <input
              className="checkboxpro"
                type="checkbox"
                name="hot"
                checked={formik.values.hot}
                onChange={formik.handleChange}
              />
            </div>

            

            <button type="submit" disabled={formik.isSubmitting}>
              Cập nhật sản phẩm
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
