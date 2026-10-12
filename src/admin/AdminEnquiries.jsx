import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { dbError } from "./dbError";

const STATUSES = [
  ["new", "New"],
  ["replied", "Replied"],
  ["closed", "Closed"],
];

function fmt(d) {
  return d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
}

function waLink(phone, name) {
  const digits = String(phone || "").replace(/\D/g, "").replace(/^0/, "971");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Hi ${name || ""}, thank you for contacting Al Nawras Safety & Security Systems.`)}`;
}

export default function AdminEnquiries() {
  const [rows, setRows] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("new");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) setError(dbError(error));
    else {
      setRows(data || []);
      setError("");
      const ids = [...new Set((data || []).map((r) => r.customer_id).filter(Boolean))];
      if (ids.length) {
        const { data: cs } = await supabase.from("customers").select("id, full_name, email").in("id", ids);
        setCustomers(Object.fromEntries((cs || []).map((c) => [c.id, c])));
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  const counts = useMemo(() => {
    const c = { all: rows.length };
    for (const [k] of STATUSES) c[k] = rows.filter((r) => r.status === k).length;
    return c;
  }, [rows]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!q || [r.full_name, r.company, r.email, r.phone, r.help_with, r.message].some((f) => (f || "").toLowerCase().includes(q)))
    );
  }, [rows, filter, search]);

  async function update(id, patch) {
    const { error } = await supabase.from("contact_messages").update(patch).eq("id", id);
    if (error) { setError(dbError(error)); return false; }
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    return true;
  }

  async function remove(id) {
    if (!confirm("Delete this enquiry permanently?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { setError(dbError(error)); return; }
    setRows((rs) => rs.filter((r) => r.id !== id));
    setOpen(null);
  }

  function toggle(r) {
    if (open === r.id) { setOpen(null); return; }
    setOpen(r.id);
    setNotes(r.notes || "");
  }

  function exportCsv() {
    const head = ["Received", "Status", "Name", "Company", "Email", "Phone", "Interested in", "Message", "Registered customer", "Notes"];
    const lines = [head, ...list.map((r) => [
      fmt(r.created_at), r.status, r.full_name, r.company || "", r.email, r.phone || "", r.help_with || "",
      r.message, r.customer_id ? "Yes" : "No", r.notes || "",
    ])];
    const csv = lines.map((l) => l.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "al-nawras-enquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Enquiries</h1>
        <div className="admin-notice">Supabase isn't connected yet — see <code>supabase/README.md</code>.</div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Enquiries</h1>
      <p className="admin-sub">Every message sent from the website's Contact page. Mark them as replied or closed to keep track.</p>

      <div className="admin-toolbar">
        <div className="admin-pill-group">
          {[["new", "New"], ["replied", "Replied"], ["closed", "Closed"], ["all", "All"]].map(([k, l]) => (
            <button key={k} className={`admin-pill ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
              {l} ({counts[k] ?? 0})
            </button>
          ))}
        </div>
        <input className="admin-input" style={{ maxWidth: 280 }} placeholder="Search name, email, message…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="spacer" />
        <button className="admin-btn" onClick={load}>Refresh</button>
        <button className="admin-btn admin-btn-primary" onClick={exportCsv} disabled={list.length === 0}>Export CSV</button>
      </div>

      {error && <div className="admin-error" style={{ marginBottom: 14 }}>{error}</div>}

      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : list.length === 0 ? (
          error ? null : <div className="admin-empty">{rows.length === 0 ? "No enquiries yet. Messages from the Contact page will appear here." : "Nothing here."}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Received</th><th>Name</th><th>Contact</th><th>Message</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((r) => {
                const cust = r.customer_id ? customers[r.customer_id] : null;
                const wa = waLink(r.phone, r.full_name);
                return [
                  <tr key={r.id} className="admin-enq-row" onClick={() => toggle(r)} style={{ cursor: "pointer", fontWeight: r.status === "new" ? 600 : 400 }}>
                    <td style={{ whiteSpace: "nowrap" }}>{fmt(r.created_at)}</td>
                    <td>
                      {r.full_name}
                      {r.company && <div className="admin-hint" style={{ margin: 0 }}>{r.company}</div>}
                      {r.customer_id && <span className="admin-text-badge" style={{ background: "var(--a-navy)" }} title={cust?.email || ""}>Customer</span>}
                    </td>
                    <td>
                      <div>{r.email}</div>
                      {r.phone && <div className="admin-hint" style={{ margin: 0 }}>{r.phone}</div>}
                    </td>
                    <td style={{ maxWidth: 360 }}>
                      {r.help_with && <div className="admin-enq-topic">{r.help_with}</div>}
                      <div className="admin-enq-msg" dir={r.language === "ar" ? "rtl" : "ltr"}>{r.message}</div>
                    </td>
                    <td>
                      <select className="admin-select" value={r.status} onClick={(e) => e.stopPropagation()} onChange={(e) => update(r.id, { status: e.target.value })} style={{ minWidth: 110 }}>
                        {STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      </select>
                    </td>
                    <td style={{ color: "var(--a-slate)" }}>{open === r.id ? "▲" : "▼"}</td>
                  </tr>,
                  open === r.id && (
                    <tr key={r.id + "-d"}>
                      <td colSpan={6} style={{ background: "var(--a-paper)" }}>
                        {r.help_with && <div className="admin-hint" style={{ margin: "0 0 6px" }}>Interested in: <b>{r.help_with}</b></div>}
                        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, marginBottom: 14 }} dir={r.language === "ar" ? "rtl" : "ltr"}>{r.message}</div>
                        <div className="admin-row-actions" style={{ flexWrap: "wrap", marginBottom: 14 }}>
                          <a className="admin-btn admin-btn-sm admin-btn-primary" href={`mailto:${r.email}?subject=${encodeURIComponent("Re: your enquiry to Al Nawras")}`} onClick={() => r.status === "new" && update(r.id, { status: "replied" })}>Reply by email</a>
                          {wa && <a className="admin-btn admin-btn-sm" href={wa} target="_blank" rel="noreferrer" onClick={() => r.status === "new" && update(r.id, { status: "replied" })}>WhatsApp</a>}
                          {r.phone && <a className="admin-btn admin-btn-sm" href={`tel:${String(r.phone).replace(/[^\d+]/g, "")}`}>Call</a>}
                          <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => remove(r.id)}>Delete</button>
                        </div>
                        <div className="admin-field" style={{ marginBottom: 6 }}>
                          <label>Internal notes (only visible in the CMS)</label>
                          <textarea className="admin-textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Sent quotation Q-1042 on 14 Oct" />
                        </div>
                        <button className="admin-btn admin-btn-sm" disabled={notes === (r.notes || "")} onClick={() => update(r.id, { notes })}>Save notes</button>
                        {cust && <span className="admin-hint" style={{ marginLeft: 12 }}>Registered customer: {cust.full_name || cust.email}</span>}
                      </td>
                    </tr>
                  ),
                ];
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
