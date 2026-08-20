import "../styles/al-shop.css";
import { useMemo, useState } from "react";
import { Icon } from "../components/shop/Icons.jsx";
import Reveal from "../components/shop/Reveal.jsx";
import useProjects from "../hooks/useProjects";

export default function ProjectsPage() {
  const { projects: PROJECTS } = useProjects();
  const [filter, setFilter] = useState("All");
  const CATS = useMemo(() => ["All", ...new Set(PROJECTS.map((p) => p.category))], [PROJECTS]);
  const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="al-shop-scope">
      <section className="page-hero bg-ambient">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a><span className="sep">/</span><span>Projects</span></div>
          <span className="eyebrow" style={{ color: "var(--flame-400)" }}>OUR TRACK RECORD</span>
          <h1>Projects Delivered Across the UAE</h1>
          <p className="lead">From malls and high-rise towers to hospitals, schools and oil &amp; gas facilities &mdash; a selection of the fire protection, life safety and ELV projects Al Nawras has delivered.</p>
        </div>
      </section>

      <Reveal as="section" className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box"><div className="num">1000+</div><div className="lbl">Projects Completed</div></div>
            <div className="stat-box"><div className="num">20+</div><div className="lbl">Years of Operation</div></div>
            <div className="stat-box"><div className="num">10</div><div className="lbl">Sectors Served</div></div>
            <div className="stat-box"><div className="num">7</div><div className="lbl">Emirates Covered</div></div>
          </div>
        </div>
      </Reveal>

      <main className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="filter-pills">
            {CATS.map((c) => (
              <button key={c} className={`pill ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <div className="project-grid">
            {list.map((p, i) => (
              <div className="card project-card" key={i}>
                <div className="thumb">
                  <div className="cover-img" style={{ backgroundImage: `url(${p.image})` }} />
                  <div className="cover-scrim" />
                  <span className="badge">{p.category}</span>
                  <span className="status">{p.status}</span>
                  <h3>{p.title}</h3>
                </div>
                <div className="body">
                  <p>{p.scope}</p>
                  <div className="project-meta">
                    <span><Icon.map /> {p.location}</span>
                    {p.year && <span><Icon.clock /> {p.year}</span>}
                    {p.tags.length > 0 && <span>{p.tags.join(", ")}</span>}
                  </div>
                  <div className="project-ref">
                    <span>{p.client}</span>
                    <span className="ref-value">Ref: {p.ref}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Reveal as="section" className="process-section section">
        <div className="container">
          <span className="eyebrow">HOW WE WORK</span>
          <h2 style={{ marginTop: 12, fontSize: 30 }}>Our Project Delivery Process</h2>
          <div className="process-grid">
            <div className="process-step"><span className="num">01</span><h4>Site Assessment</h4><p>Our engineers survey the site and review drawings to scope the right fire, life safety or ICT solution.</p></div>
            <div className="process-step"><span className="num">02</span><h4>Design &amp; Proposal</h4><p>We prepare a compliant system design and detailed proposal aligned with Civil Defense and NFPA requirements.</p></div>
            <div className="process-step"><span className="num">03</span><h4>Supply &amp; Installation</h4><p>Certified products are supplied and installed by our trained technical teams, on schedule and to code.</p></div>
            <div className="process-step"><span className="num">04</span><h4>Testing &amp; Handover</h4><p>Full system commissioning, authority approvals and handover documentation for long-term reliability.</p></div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
