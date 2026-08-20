import { NavLink, Outlet } from "react-router-dom";
import "./admin.css";
import { useAuth } from "./AuthContext";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/systems", label: "Systems & Solutions" },
  { to: "/admin/home", label: "Home Page Pictures" },
];

export default function AdminLayout() {
  const { signOut, session } = useAuth();

  return (
    <div className="admin-scope">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="brand">
            Al Nawras CMS
            <span>{session?.user?.email}</span>
          </div>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => "admin-nav-link" + (isActive ? " active" : "")}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="bottom">
            <a className="view-site" href="/" target="_blank" rel="noreferrer">View live site ↗</a>
            <button className="signout-btn" onClick={signOut}>Sign out</button>
          </div>
        </aside>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
