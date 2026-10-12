import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { dbError } from "./dbError";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(dbError(error));
    else setCustomers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.full_name, c.email, c.phone, c.company].some((f) => (f || "").toLowerCase().includes(q))
    );
  }, [customers, search]);

  function exportCsv() {
    const rows = [
      ["Full Name", "Email", "Phone", "Company", "Registered", "Last sign-in"],
      ...filtered.map((c) => [
        c.full_name || "",
        c.email || "",
        c.phone || "",
        c.company || "",
        c.created_at ? new Date(c.created_at).toLocaleString() : "",
        c.last_sign_in_at ? new Date(c.last_sign_in_at).toLocaleString() : "",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "al-nawras-customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Customers</h1>
        <div className="admin-notice">
          Supabase isn't connected yet. Connect it to see registered customers here — see{" "}
          <code>supabase/README.md</code>.
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Customers</h1>
      <p className="admin-sub">Everyone who has registered on the website (Register / Sign In) — these are the customers who log in. New sign-ups appear here automatically.</p>

      <div className="admin-toolbar">
        <input
          className="admin-input"
          style={{ maxWidth: 320 }}
          placeholder="Search by name, email, phone, company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="spacer" />
        <span style={{ fontSize: 12.5, color: "var(--a-slate)" }}>
          {filtered.length} of {customers.length} customer{customers.length === 1 ? "" : "s"}
        </span>
        <button className="admin-btn" onClick={load}>Refresh</button>
        <button className="admin-btn admin-btn-primary" onClick={exportCsv} disabled={filtered.length === 0}>
          Export CSV
        </button>
      </div>

      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            {customers.length === 0
              ? "No customers have registered yet."
              : "No customers match your search."}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Registered</th>
                <th>Last sign-in</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.full_name || "—"}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.phone || "—"}</td>
                  <td>{c.company || "—"}</td>
                  <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
                  <td>{c.last_sign_in_at ? new Date(c.last_sign_in_at).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
