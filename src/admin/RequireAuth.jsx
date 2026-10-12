import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

// Being logged in isn't enough on its own — since customers can now create
// their own accounts on the public site through the SAME Supabase project,
// we check the `profiles.is_admin` flag (set up by
// supabase/customers_and_auth.sql). This isn't just a UI gate: the same
// flag is enforced directly in the database's Row Level Security policies,
// so even a customer calling the Supabase API directly (bypassing this
// page entirely) can't write to products/projects/team/certifications.
export default function RequireAuth({ children }) {
  const { session, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(undefined); // undefined = checking

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(data?.is_admin === true);
      });
    return () => { cancelled = true; };
  }, [session]);

  if (loading || (session && isAdmin === undefined)) return null;
  if (!session) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
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