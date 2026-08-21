import { Link } from "react-router-dom";
import { supabaseConfigured } from "../lib/supabase";

export default function AdminDashboard() {
  return (
    <>
      <h1 className="admin-h1">Dashboard</h1>
      <p className="admin-sub">Manage the content that appears on the live website.</p>

      {!supabaseConfigured && (
        <div className="admin-notice">
          Supabase isn't connected — you're viewing the CMS shell, but changes won't save. See{" "}
          <code>supabase/README.md</code> for the 10-minute setup.
        </div>
      )}

      <div className="admin-grid-links">
        <Link className="admin-link-card" to="/admin/products">
          <h3>Products</h3>
          <p>Add, edit or remove products in the catalog — pricing, specs and images.</p>
        </Link>
        <Link className="admin-link-card" to="/admin/projects">
          <h3>Projects</h3>
          <p>Manage the project portfolio shown on the Projects page.</p>
        </Link>
        <Link className="admin-link-card" to="/admin/systems">
          <h3>Systems &amp; Solutions</h3>
          <p>Manage the equipment gallery images on each systems page.</p>
        </Link>
        <Link className="admin-link-card" to="/admin/home">
          <h3>Home Page Pictures</h3>
          <p>Replace the 6 hero carousel images on the homepage.</p>
        </Link>
        <Link className="admin-link-card" to="/admin/team">
          <h3>Our Team</h3>
          <p>Manage the team members shown on the "Our Team" page.</p>
        </Link>
        <Link className="admin-link-card" to="/admin/certifications">
          <h3>Certifications</h3>
          <p>Manage licenses &amp; certifications shown on the homepage and About page.</p>
        </Link>
      </div>
    </>
  );
}
