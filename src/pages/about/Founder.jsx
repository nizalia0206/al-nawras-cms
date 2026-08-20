import PageHeader from "../../components/PageHeader";
import AboutSubNav from "../../components/AboutSubNav";
import useReveal from "../../hooks/useReveal";

export default function Founder() {
  const ref = useReveal();

  return (
    <>
      <PageHeader
        eyebrow="Al Nawras Overview"
        title="Message from the Founder"
        desc="A personal assurance that every project is delivered safely, to specification and to the international standard."
        crumbs={[{ label: "About", href: "/about/overview" }, { label: "Founder" }]}
      />
      <AboutSubNav />

      <section className="bg-paper py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-[18px]">
            <span className="inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold tracking-[.08em] uppercase text-flame1 border border-flame1/40 bg-flame1/[.06] rounded">
              MD-01
            </span>
            <span className="w-[26px] h-px bg-ink/15" />
            <span className="text-[11.5px] font-semibold tracking-[.22em] uppercase text-inksoft">
              Message from the Managing Director
            </span>
          </div>
          <h1 className="font-display font-semibold uppercase text-[28px] md:text-[40px] leading-[1.1] text-ink">
            A word from <span className="text-flame1">Eng. Mohammed Ghazy</span>
          </h1>
          <span className="block w-14 h-[3px] mx-auto mt-5 rounded-full bg-gradient-to-r from-flame1 to-gold" />
        </div>

        <div ref={ref} className="reveal max-w-[1080px] mx-auto px-8 mt-14">
          <div className="relative bg-white border border-ink/[.08] rounded-lg shadow-[0_30px_60px_-30px_rgba(19,28,51,.18)] px-8 py-10 md:px-16 md:py-14">
            <span
              className="absolute top-6 left-6 md:top-8 md:left-10 font-display text-[110px] md:text-[140px] leading-none text-flame1/[.08] select-none pointer-events-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <div className="relative">
              <p className="text-[16px] md:text-[17px] leading-[1.85] text-inksoft mb-6">
                "Welcome to Al Nawras. As Managing Director, I can confidently assert that the range
                and quality of our services are unmatched in the UAE marketplace. Since 2005, we have
                continually refined our systems, our processes and our people to deliver the most
                efficient experience possible to our loyal customers.
              </p>
              <p className="text-[16px] md:text-[17px] leading-[1.85] text-inksoft mb-6">
                Our reputation is built on the successful completion of more than 400 projects, each
                delivered with the highest possible quality — by embracing new technologies, following
                the latest industry standards and meeting the safety regulations of the UAE. Our
                well-trained engineers, project managers and skilled technicians provide the proper
                design, installation and service our customers have grown to expect at every stage of a
                project.
              </p>
              <p className="text-[16px] md:text-[17px] leading-[1.85] text-inksoft">
                We are committed to conducting our business professionally with every client. Our main
                aim is to enhance the overall safety standards of the UAE community that we are proud to
                live and work in."
              </p>

              <div className="mt-9 pt-7 border-t border-ink/[.08] flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-bgdark to-flame1 flex items-center justify-center shrink-0">
                  <span className="font-display text-[15px] tracking-wide text-white">MG</span>
                </div>
                <div className="text-left">
                  <div className="font-display font-semibold text-[15px] tracking-wide uppercase text-ink">
                    Eng. Mohammed Ghazy
                  </div>
                  <div className="text-[13.5px] text-inksoft mt-0.5">
                    Managing Director, Al Nawras Safety &amp; Security
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
