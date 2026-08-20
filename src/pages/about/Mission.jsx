import PageHeader from "../../components/PageHeader";
import AboutSubNav from "../../components/AboutSubNav";
import useReveal from "../../hooks/useReveal";

const CARDS = [
  {
    num: "01",
    title: "Our Mission",
    desc: "To safeguard lives and property across the UAE by engineering, supplying and maintaining fire, life-safety and ELV systems of uncompromising reliability — delivered on time, to code, every time.",
  },
  {
    num: "02",
    title: "Our Vision",
    desc: "To be the UAE's most trusted integrated safety and security partner, recognized for technical excellence, authorized brand partnerships and a zero-compromise approach to compliance.",
  },
  {
    num: "03",
    title: "Quality Commitment",
    desc: "ISO 9001:2015 certified, with civil defense approvals across three Emirates and an in-house team of licensed engineers and technicians who stand behind every installation.",
  },
];

function Card({ item }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal bg-white border border-black/[.08] p-8 md:p-10">
      <div className="font-mono text-[13px] text-flame1 font-semibold mb-4">{item.num}</div>
      <h3 className="font-display text-[22px] uppercase tracking-wide mb-4">{item.title}</h3>
      <p className="text-[15px] text-inksoft leading-[1.75]">{item.desc}</p>
    </div>
  );
}

export default function Mission() {
  return (
    <>
      <PageHeader
        eyebrow="Al Nawras Overview"
        title="Mission & Vision"
        desc="Progressive thinking and a systematic approach to every project, so our clients keep coming back to us."
        crumbs={[{ label: "About", href: "/about/overview" }, { label: "Mission & Vision" }]}
      />
      <AboutSubNav />

      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARDS.map((c) => (
              <Card key={c.num} item={c} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
