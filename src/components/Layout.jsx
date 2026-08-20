import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div>
      <TopBar />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
