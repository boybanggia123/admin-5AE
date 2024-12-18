"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function AddCategory() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, "Tên danh mục không được vượt quá 50 kí tự")
        .required("Vui lòng nhập tên danh mục"),
      description: Yup.string()
        .max(200, "Mô tả không được vượt quá 200 kí tự")
        .required("Vui lòng nhập mô tả danh mục"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch("http://localhost:3000/addcategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const result = await res.json();

        if (!res.ok) {
          if (
            res.status === 400 &&
            result.error === "Tên danh mục đã tồn tại"
          ) {
            setFieldError("name", "Tên danh mục đã tồn tại");
          } else {
            throw new Error(result.message || "Thêm danh mục thất bại");
          }
        } else {
          alert("Thêm danh mục thành công");
          router.push("/QuanlyCategories");
        }
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <h1 className="title">Quản lý danh mục</h1>
      <div className="add-title">
        <ul className="breadcrumbs">
          <li>
            <Link href="/">Trang chủ</Link>
          </li>
          <li className="divider">/</li>
          <li>
            <Link href={"/QuanlyCategories"}>Danh sách danh mục</Link>
          </li>
          <li className="divider">/</li>

          <li>
            <Link href="/addCategory" className="active">
              Thêm danh mục
            </Link>
          </li>
        </ul>
      </div>
      <div className="container">
        <div className="form_adduser">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group-1">
              <label>Tên danh mục</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Tên danh mục"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error">{formik.errors.name}</div>
              )}
            </div>

            <div className="form-group-1">
              <label>Mô tả</label>
              <input
                type="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Mô tả danh mục"
                rows="4"
              ></input>
              {formik.touched.description && formik.errors.description && (
                <div className="error">{formik.errors.description}</div>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={formik.isSubmitting}
            >
              Thêm danh mục
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
