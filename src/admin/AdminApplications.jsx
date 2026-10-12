import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { dbError } from "./dbError";

const STATUSES = [
  ["new", "New"],
  ["shortlisted", "Shortlisted"],
  ["interview", "Interview"],
  ["hired", "Hired"],
  ["rejected", "Rejected"],
];

function fmt(d) {
  return d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
}

export default function AdminApplications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("new");
  const [job, setJob] = useState("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false });
    if (error) setError(dbError(error));
    else { setRows(data || []); setError(""); }
    setLoading(false);
  }

  useEffect(() => {
    if (supabaseConfigured) load();
    else setLoading(false);
  }, []);

  const jobs = useMemo(() => [...new Set(rows.map((r) => r.job_title))].sort(), [rows]);
  const counts = useMemo(() => {
    const base = rows.filter((r) => job === "all" || r.job_title === job);
    const c = { all: base.length };
    for (const [k] of STATUSES) c[k] = base.filter((r) => r.status === k).length;
    return c;
  }, [rows, job]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (job === "all" || r.job_title === job) &&
        (!q || [r.full_name, r.email, r.phone, r.job_title, r.experience, r.cover_note].some((f) => (f || "").toLowerCase().includes(q)))
    );
  }, [rows, filter, job, search]);

  async function update(id, patch) {
    const { error } = await supabase.from("job_applications").update(patch).eq("id", id);
    if (error) { setError(dbError(error)); return; }
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function openCv(r) {
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(r.cv_path, 60 * 10, { download: r.cv_name || true });
    if (error) { setError(dbError(error)); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function remove(r) {
    if (!confirm(`Delete ${r.full_name}'s application and CV permanently?`)) return;
    if (r.cv_path) await supabase.storage.from("cvs").remove([r.cv_path]);
    const { error } = await supabase.from("job_applications").delete().eq("id", r.id);
    if (error) { setError(dbError(error)); return; }
    setRows((rs) => rs.filter((x) => x.id !== r.id));
    setOpen(null);
  }

  function toggle(r) {
    if (open === r.id) { setOpen(null); return; }
    setOpen(r.id);
    setNotes(r.notes || "");
  }

  function exportCsv() {
    const head = ["Received", "Status", "Job", "Department", "Location", "Name", "Email", "Phone", "Experience", "Cover note", "CV file", "Notes"];
    const lines = [head, ...list.map((r) => [
      fmt(r.created_at), r.status, r.job_title, r.dept || "", r.location || "", r.full_name, r.email, r.phone,
      r.experience || "", r.cover_note || "", r.cv_name || "", r.notes || "",
    ])];
    const csv = lines.map((l) => l.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "al-nawras-job-applications.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!supabaseConfigured) {
    return (
      <>
        <h1 className="admin-h1">Job Applications</h1>
        <div className="admin-notice">Supabase isn't connected yet — see <code>supabase/README.md</code>.</div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-h1">Job Applications</h1>
      <p className="admin-sub">Applications sent from the website's Careers page, with the applicant's CV. Move them through the hiring stages below.</p>

      <div className="admin-toolbar">
        <div className="admin-pill-group">
          {[...STATUSES, ["all", "All"]].map(([k, l]) => (
            <button key={k} className={`admin-pill ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
              {l} ({counts[k] ?? 0})
            </button>
          ))}
        </div>
      </div>
      <div className="admin-toolbar">
        <select className="admin-select" style={{ maxWidth: 280 }} value={job} onChange={(e) => setJob(e.target.value)}>
          <option value="all">All jobs</option>
          {jobs.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>
        <input className="admin-input" style={{ maxWidth: 260 }} placeholder="Search name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="spacer" />
        <button className="admin-btn" onClick={load}>Refresh</button>
        <button className="admin-btn admin-btn-primary" onClick={exportCsv} disabled={list.length === 0}>Export CSV</button>
      </div>

      {error && <div className="admin-error" style={{ marginBottom: 14 }}>{error}</div>}

      <div className="admin-card" style={{ padding: 0 }}>
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : list.length === 0 ? (
          error ? null : <div className="admin-empty">{rows.length === 0 ? "No applications yet. Applications from the Careers page will appear here." : "Nothing here."}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Received</th><th>Applicant</th><th>Job</th><th>CV</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((r) => [
                <tr key={r.id} onClick={() => toggle(r)} style={{ cursor: "pointer", fontWeight: r.status === "new" ? 600 : 400 }}>
                  <td style={{ whiteSpace: "nowrap" }}>{fmt(r.created_at)}</td>
                  <td>
                    {r.full_name}
                    <div className="admin-hint" style={{ margin: 0 }}>{r.email} · {r.phone}</div>
                  </td>
                  <td>
                    {r.job_title}
                    <div className="admin-hint" style={{ margin: 0 }}>{[r.dept, r.location].filter(Boolean).join(" · ")}</div>
                  </td>
                  <td>
                    {r.cv_path ? (
                      <button className="admin-btn admin-btn-sm" onClick={(e) => { e.stopPropagation(); openCv(r); }}>Download CV</button>
                    ) : "—"}
                  </td>
                  <td>
                    <select className="admin-select" value={r.status} onClick={(e) => e.stopPropagation()} onChange={(e) => update(r.id, { status: e.target.value })} style={{ minWidth: 120 }}>
                      {STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </td>
                  <td style={{ color: "var(--a-slate)" }}>{open === r.id ? "▲" : "▼"}</td>
                </tr>,
                open === r.id && (
                  <tr key={r.id + "-d"}>
                    <td colSpan={6} style={{ background: "var(--a-paper)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "6px 16px", marginBottom: 14, fontSize: 13.5 }}>
                        <span className="admin-hint" style={{ margin: 0 }}>Experience</span><span>{r.experience || "—"}</span>
                        <span className="admin-hint" style={{ margin: 0 }}>Cover note</span>
                        <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }} dir={r.language === "ar" ? "rtl" : "ltr"}>{r.cover_note || "—"}</span>
                        <span className="admin-hint" style={{ margin: 0 }}>CV file</span><span>{r.cv_name || "—"}</span>
                      </div>
                      <div className="admin-row-actions" style={{ flexWrap: "wrap", marginBottom: 14 }}>
                        <a className="admin-btn admin-btn-sm admin-btn-primary" href={`mailto:${r.email}?subject=${encodeURIComponent(`Your application: ${r.job_title} — Al Nawras`)}`}>Email applicant</a>
                        <a className="admin-btn admin-btn-sm" href={`tel:${String(r.phone).replace(/[^\d+]/g, "")}`}>Call</a>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => remove(r)}>Delete</button>
                      </div>
                      <div className="admin-field" style={{ marginBottom: 6 }}>
                        <label>Internal notes (only visible in the CMS)</label>
                        <textarea className="admin-textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Phone screen done, strong on Morley panels" />
                      </div>
                      <button className="admin-btn admin-btn-sm" disabled={notes === (r.notes || "")} onClick={() => update(r.id, { notes })}>Save notes</button>
                    </td>
                  </tr>
                ),
              ])}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
