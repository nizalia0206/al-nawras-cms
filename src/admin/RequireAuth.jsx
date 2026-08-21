import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Being logged in isn't enough on its own — since customers can now create
// their own accounts on the public site through the SAME Supabase project,
// we also require the `is_admin` flag on the user's app_metadata. That flag
// can only be set by someone with the service_role key (i.e. you, via the
// Supabase dashboard or SQL editor — never by the user themselves), so a
// regular customer signing up can never grant themselves admin access.
// See supabase/README.md → "Making a user an admin".
export default function RequireAuth({ children }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace />;
  if (session.user?.app_metadata?.is_admin !== true) {
    return (
      <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center", fontFamily: "sans-serif", padding: "0 24px" }}>
        <h2 style={{ marginBottom: 12 }}>Not an admin account</h2>
        <p style={{ color: "#666", lineHeight: 1.6 }}>
          You're signed in, but this account isn't marked as an administrator. If this should be
          an admin account, see <code>supabase/README.md</code> for how to grant admin access.
        </p>
      </div>
    );
  }
  return children;
}
