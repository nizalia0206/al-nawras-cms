import { Link } from "react-router-dom";
import { projects } from "../data/content";

export default function Projects() {
  return (
    <section id="projects" className="bg-paper py-[90px] md:py-[110px]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div className="max-w-[680px]">
            <div className="sec-eyebrow">Projects</div>
            <h2 className="font-display font-semibold uppercase text-[28px] md:text-[40px] leading-[1.08] text-ink">
              1,000+ projects delivered across the Emirates
            </h2>
            <p className="mt-5 text-[15.5px] md:text-[16.5px] leading-[1.75] text-inksoft">
              From residential towers to hospitals and mixed-use developments, our project
              references reflect a consistent, systematic approach — delivered on schedule and to
              specification.
            </p>
          </div>
          <Link to="/projects" className="btn btn-dark shrink-0">
            View all projects
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 6).map((p) => (
            <div
              key={p.title}
              className={`relative overflow-hidden rounded-md border border-white/[.08] text-white p-7 flex flex-col min-h-[220px] bg-gradient-to-br ${p.grad}`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[.12em] text-flame2 mb-3">
                {p.tag}
              </span>
              <h3 className="font-display text-[19px] uppercase tracking-wide mb-3 leading-tight">
                {p.title}
              </h3>
              <p className="text-[13px] leading-[1.6] text-steellight">{p.meta}</p>
              <p className="mt-auto pt-4 text-[12.5px] leading-[1.6] text-white/85 border-t border-white/[.12]">
                {p.systems}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
