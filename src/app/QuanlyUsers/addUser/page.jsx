"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function AddUser() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      avatar: null,
      fullname: "",
      email: "",
      phone: "",
      address: "",
      role: "user",
      password: "",
      createdAt: new Date().toISOString().split("T")[0],
      dateOfBirth: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      avatar: Yup.mixed().required("Vui lòng thêm avatar"),
      fullname: Yup.string()
        .max(30, "Họ và tên không quá 30 kí tự")
        .required("Vui lòng nhập họ tên"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại phải là 10 chữ số")
        .required("Vui lòng nhập số điện thoại"),
      address: Yup.string().required("Vui lòng điền địa chỉ"),
      role: Yup.string().required("Vui lòng chọn quyền"),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
          "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số"
        )
        .required("Vui lòng nhập mật khẩu"),
      dateOfBirth: Yup.date().required("Ngày sinh là bắt buộc"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      const formData = new FormData();
      formData.append("avatar", values.avatar); // Gửi tệp avatar
      formData.append("fullname", values.fullname);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("createdAt", values.createdAt);
      formData.append("role", values.role);
      formData.append("dateOfBirth", values.dateOfBirth);
      formData.append("password", values.password);

      try {
        const res = await fetch("http://localhost:3000/adduser", {
          method: "POST",
          body: formData, // Gửi FormData thay vì JSON
        });
        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 400 && errorData.message === "Email đã tồn tại") {
            setFieldError("email", "Email đã tồn tại");
          } else {
            throw new Error(errorData.message || "Tạo tài khoản thất bại");
          }
        }
        alert("Thêm tài khoản thành công");
        router.push("/QuanlyUsers");
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <>
      <h1 className="title">Quản lý Users</h1>
      <div className="add-title">
        <ul className="breadcrumbs">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li className="divider">/</li>
          <li>
            <Link href="/addUser" className="active">
              User Add
            </Link>
          </li>
        </ul>
      </div>
      <div className="container">
        <div className="form_adduser">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group-1">
              <label>Avatar</label>
              <input
                type="file"
                name="avatar"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  formik.setFieldValue("avatar", file);
                }}
              />
              {formik.touched.avatar && formik.errors.avatar && (
                <div className="error">{formik.errors.avatar}</div>
              )}
            </div>

            <div className="form-group-1">
              <label>Họ & Tên</label>
              <input
                type="text"
                name="fullname"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Họ & Tên"
              />
              {formik.touched.fullname && formik.errors.fullname && (
                <div className="error">{formik.errors.fullname}</div>
              )}
            </div>

            <div className="form-group-1">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Điền Email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error">{formik.errors.email}</div>
              )}
            </div>

            <div className="form-group-1">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Điền SĐT"
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="error">{formik.errors.phone}</div>
              )}
            </div>

            <div className="form-group-1">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Điền Địa chỉ nhà?"
              />
              {formik.touched.address && formik.errors.address && (
                <div className="error">{formik.errors.address}</div>
              )}
            </div>

            <div className="form-group-1">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Điền mật khẩu"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error">{formik.errors.password}</div>
              )}
            </div>

            <div className="form-group-1 hidden">
              <label>Ngày tạo</label>
              <input
                type="date"
                name="createdAt"
                value={formik.values.createdAt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.createdAt && formik.errors.createdAt && (
                <div className="error">{formik.errors.createdAt}</div>
              )}
            </div>

            <div className="form-group-1">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <div className="error">{formik.errors.dateOfBirth}</div>
              )}
            </div>

            <div className="form-group-1">
              <label>Quyền</label>
              <select
                className="select-role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <div className="error">{formik.errors.role}</div>
              )}
            </div>

            <button type="submit" className="submit-btn">
              Tạo tài khoản
            </button>
            {formik.errors.general && (
              <div className="error">{formik.errors.general}</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
