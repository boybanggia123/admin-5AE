import Link from "next/link";
export default function Header() {
  return (
    <>
      <section id="sidebar">
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
            <Link href={"#"}>
              <i className="fa-solid fa-users-line icon"></i> Quản lý Users
            </Link>
          </li>
          <li>
            <Link href={"#"}>
              <i className="fa-solid fa-shirt icon"></i> Quản lý Products
            </Link>
          </li>
          <li>
            <Link href={"#"}>
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
            <Link href={"#"}>
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
    </>
  );
}
