import PageHeader from "../../components/PageHeader";
import AboutSubNav from "../../components/AboutSubNav";
import { IconPerson, IconHardHat } from "../../components/Icons";
import { team } from "../../data/content";
import useReveal from "../../hooks/useReveal";

export default function Team() {
  const ref = useReveal();

  return (
    <>
      <PageHeader
        eyebrow="Al Nawras Overview"
        title="Our Team"
        desc="The engineers, managers and specialists who plan, deliver and support every Al Nawras project."
        crumbs={[{ label: "About", href: "/about/overview" }, { label: "Our Team" }]}
      />
      <AboutSubNav />

      <section className="bg-paper py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[680px] mb-14">
            <div className="sec-eyebrow">Leadership</div>
            <h1 className="font-display font-semibold uppercase text-[28px] md:text-[40px] leading-[1.08] text-ink">
              The people behind Al Nawras
            </h1>
          </div>

          <div ref={ref} className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((p) => {
              const Icon = p.icon === "hardhat" ? IconHardHat : IconPerson;
              return (
                <div key={p.id} className="svc-card">
                  <div className="relative w-14 h-14 mb-6">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-bgdark to-flame1 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white border border-ink/10 flex items-center justify-center text-[9.5px] font-bold tracking-wide text-flame1">
                      {p.initials}
                    </span>
                  </div>
                  <h3 className="font-display text-[18px] uppercase tracking-wide mb-1.5">{p.name}</h3>
                  <div className="text-[13px] font-semibold text-flame1 mb-3">{p.role}</div>
                  <div className="text-[13.5px] text-inksoft flex-grow">{p.phone}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
