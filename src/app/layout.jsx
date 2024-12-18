'use client';

import { Inter } from "next/font/google";
import Link from "next/link";
import "../../public/css/products.css";
import "../../public/css/style.css";
import "../../public/css/formmodal.css";
import Script from "next/script";
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
const inter = Inter({ subsets: ["latin"] });
import { useRouter } from 'next/navigation';


export default function RootLayout({ children }) {
  useEffect(() => {
   
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  const router = useRouter();
  const handleLogout = () =>{
    document.cookie = "token=; path=/; max-age=-1";

    router.push('http://localhost:3001');
  }
  return (
    <html lang="en">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
        <Script src="js/script.js"></Script>
      </head>
      <body className={inter.className}>
        <section id="sidebar" className="row">
          <Link href={"#"} className="brand">
            <i className="bx bxs-smile icon"></i> FASHIONVERSE
          </Link>
          <ul className="side-menu">
            <li>
              <Link href={"/"}>
                <i className="fa-solid fa-gauge icon"></i> Dashboard
              </Link>
            </li>
            <li className="divider" data-text="main">
              Main
            </li>
            <li>
              <Link href={"/QuanlyUsers"}>
                <i className="fa-solid fa-users-line icon"></i> Quản lý Users
              </Link>
            </li>
            <li>
              <Link href={"/QuanlyProducts"}>
                <i className="fa-solid fa-shirt icon"></i> Quản lý Products
              </Link>
            </li>
            <li>
              <Link href={"/QuanlyCategories"}>
                <i className="fa-solid fa-layer-group icon"></i> Quản lý
                Categories
              </Link>
            </li>
            <li>
              <Link href={"#"}>
                <i className="fa-solid fa-comment icon"></i> Quản lý Comments
              </Link>
            </li>
            <li>
              <Link href={"/Quanlydonhang"}>
                <i className="fa-solid fa-briefcase icon"></i> Quản lý Order
              </Link>
            </li>
            <li>
              <Link href={"#"}>
                <i className="fa-solid fa-chart-area icon"></i>Biểu đồ
              </Link>
            </li>
            <li className="divider" data-text="table and forms">
              Table and forms
            </li>
            <li>
              <Link href={"#"}>
                <i className="bx bx-table icon"></i> Tables
              </Link>
            </li>
          </ul>
        </section>
        <section id="content">
          <nav>
            <i className="bx bx-menu toggle-sidebar"></i>
            <form action="#">
              <div className="form-group">
                <input type="text" placeholder="Search..." />
                <i className="bx bx-search icon"></i>
              </div>
            </form>
            <Link href={"#"} className="nav-link">
              <i className="bx bxs-bell icon"></i>
              <span className="badge">5</span>
            </Link>
            <Link href={"#"} className="nav-link">
              <i className="bx bxs-message-square-dots icon"></i>
              <span className="badge">8</span>
            </Link>
            <span className="divider"></span>
            <div className="profile">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
              <ul className="profile-link">
                <li>
                  <Link href={"#"}>
                    <i className="bx bxs-user-circle icon"></i> Profile
                  </Link>
                </li>
                <li>
                  <Link href={"#"}>
                    <i className="bx bxs-cog"></i> Settings
                  </Link>
                </li>
                <li>
                <Link href={"#"} onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}>
                      <i className="bx bxs-log-out-circle"></i> Logout
                    </Link>
                </li>
              </ul>
            </div>
          </nav>
          <main className="row">{children}</main>
        </section>
      </body>
    </html>
  );
}
