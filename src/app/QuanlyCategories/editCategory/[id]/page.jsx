"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function EditCategory({ params }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, "Tên danh mục không được vượt quá 50 ký tự")
        .required("Vui lòng nhập tên danh mục"),
      description: Yup.string()
        .max(200, "Mô tả không được vượt quá 200 ký tự")
        .required("Vui lòng nhập mô tả danh mục"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch(`http://localhost:3000/updatecategory/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Cập nhật danh mục thất bại");
        }

        alert("Cập nhật danh mục thành công!");
        router.push("/QuanlyCategories");
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`http://localhost:3000/categorydetail/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Không tìm thấy danh mục");
        }

        formik.setValues({
          name: data.name || "",
          description: data.description || "",
        });
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

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
            <Link href="" className="active">
              Sửa danh mục
            </Link>
          </li>
        </ul>
      </div>
      <div className="container">
        <div className="form_adduser">
          <form onSubmit={formik.handleSubmit}>
            {errorMessage && <div className="errors">{errorMessage}</div>}
            <div className="form-group-1">
              <label htmlFor="name">Tên danh mục</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tên danh mục"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="errors">{formik.errors.name}</div>
              )}
            </div>

            <div className="form-group-1">
              <label htmlFor="description">Mô tả</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Mô tả danh mục"
                rows="4"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></input>
              {formik.touched.description && formik.errors.description && (
                <div className="errors">{formik.errors.description}</div>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={formik.isSubmitting}
            >
              Cập nhật danh mục
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
