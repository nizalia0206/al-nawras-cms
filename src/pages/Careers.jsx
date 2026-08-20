import "../styles/al-shop.css";
import { useState, useMemo } from "react";
import { Icon } from "../components/shop/Icons.jsx";
import Reveal from "../components/shop/Reveal.jsx";

const JOBS = [
  { title: "Fire Alarm Systems Engineer", dept: "Engineering", type: "Full-time", location: "Sharjah" },
  { title: "ICT Network Engineer", dept: "ICT", type: "Full-time", location: "Dubai" },
  { title: "Fire Protection Project Manager", dept: "Project Management", type: "Full-time", location: "Sharjah" },
  { title: "Site Supervisor \u2014 Fire Pumps", dept: "Engineering", type: "Full-time", location: "Sharjah" },
  { title: "Sales Engineer \u2014 Fire & Safety", dept: "Sales", type: "Full-time", location: "Dubai" },
  { title: "Junior CAD Draftsman", dept: "Engineering", type: "Full-time", location: "Sharjah" },
];

const VALUES = [
  { icon: "shield", title: "Safety First", body: "Every project we deliver protects lives \u2014 that responsibility shapes how we hire, train and work." },
  { icon: "check", title: "Technical Excellence", body: "We invest in certified training so our engineers stay current with global fire and ICT standards." },
  { icon: "arrowRight", title: "Growth-Driven", body: "Clear career paths from technician to project lead, with mentorship from senior engineers." },
  { icon: "cart", title: "Team-Oriented", body: "Collaborative project teams spanning engineering, procurement and site execution." },
];

const BENEFITS = [
  ["Health Insurance", "Comprehensive medical coverage for you and your family."],
  ["Annual Leave & Flights", "Generous leave allowance plus annual flight tickets home."],
  ["Certified Training", "Manufacturer certification programs with Honeywell, H3C and more."],
  ["Performance Bonus", "Project-based incentives tied to delivery and client satisfaction."],
  ["Career Progression", "Structured paths toward senior engineering and management roles."],
  ["Modern Equipment", "Work with the latest tools and testing equipment on every site."],
];

export default function Careers() {
  const depts = useMemo(() => ["All", ...new Set(JOBS.map((j) => j.dept))], []);
  const [dept, setDept] = useState("All");
  const [modalJob, setModalJob] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const list = dept === "All" ? JOBS : JOBS.filter((j) => j.dept === dept);

  function closeModal() {
    setModalJob(null);
    setSubmitted(false);
  }
  function handleApply(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="al-shop-scope">
      <section className="page-hero bg-ambient">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a><span className="sep">/</span><span>Careers</span></div>
          <span className="eyebrow" style={{ color: "var(--flame-400)" }}>JOIN OUR TEAM</span>
          <h1>Build Your Career at Al Nawras</h1>
          <p className="lead">We&rsquo;re growing our team of fire protection engineers, ICT specialists and project managers. Help us secure lives and buildings across the UAE.</p>
        </div>
      </section>

      <Reveal as="section" className="section" style={{ paddingBottom: 20 }}>
        <div className="container">
          <span className="eyebrow">WHY AL NAWRAS</span>
          <h2 style={{ marginTop: 12, fontSize: 28 }}>What We Value</h2>
          <div className="values-grid">
            {VALUES.map((v) => {
              const IconComp = Icon[v.icon];
              return (
                <div className="value-card" key={v.title}>
                  <div className="icon-wrap"><IconComp /></div>
                  <h4>{v.title}</h4>
                  <p>{v.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section benefits-section">
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--flame-400)" }}>BENEFITS</span>
          <h2 style={{ marginTop: 12, fontSize: 28, color: "white" }}>What You&rsquo;ll Get</h2>
          <div className="benefits-grid">
            {BENEFITS.map(([title, body]) => (
              <div className="benefit-item" key={title}>
                <div className="ic"><Icon.check /></div>
                <div><h5>{title}</h5><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <main className="section">
        <div className="container">
          <span className="eyebrow">OPEN ROLES</span>
          <h2 style={{ marginTop: 12, fontSize: 28 }}>Current Openings</h2>
          <div className="jobs-toolbar">
            {depts.map((d) => (
              <button key={d} className={`pill ${dept === d ? "active" : ""}`} onClick={() => setDept(d)}>{d}</button>
            ))}
          </div>
          <div className="job-list">
            {list.map((j) => (
              <div className="job-card" key={j.title}>
                <div className="info">
                  <h4>{j.title}</h4>
                  <div className="job-meta">
                    <span><Icon.briefcase /> {j.dept}</span>
                    <span><Icon.clock /> {j.type}</span>
                    <span><Icon.map /> {j.location}</span>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setModalJob(j)}>Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className={`apply-modal ${modalJob ? "open" : ""}`}>
        <div className="scrim" onClick={closeModal} />
        <div className="sheet">
          <button className="close-x" aria-label="Close" onClick={closeModal}><Icon.close /></button>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div className="icon-circle" style={{ margin: "0 auto 20px" }}><Icon.check /></div>
              <h3 style={{ marginBottom: 8 }}>Application Submitted</h3>
              <p style={{ color: "var(--slate-500)", fontSize: 14 }}>Thank you for applying to {modalJob?.title}. Our HR team will be in touch if there&rsquo;s a match.</p>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: 6 }}>Apply Now</h3>
              <p style={{ color: "var(--slate-500)", fontSize: 13.5, marginBottom: 22 }}>{modalJob?.title} &mdash; {modalJob?.location}</p>
              <form onSubmit={handleApply}>
                <div className="field"><label>Full Name *</label><input type="text" required /></div>
                <div className="field"><label>Email *</label><input type="email" required /></div>
                <div className="field"><label>Phone *</label><input type="tel" required /></div>
                <div className="field"><label>Years of Experience</label><input type="text" placeholder="e.g. 5 years" /></div>
                <div className="field"><label>Cover Note</label><textarea placeholder="Tell us why you're a great fit&hellip;" /></div>
                <button type="submit" className="btn btn-primary btn-block">Submit Application</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
