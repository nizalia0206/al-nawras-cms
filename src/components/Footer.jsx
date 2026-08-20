import { Link } from "react-router-dom";
import Logo from "./Logo";
import { IconLinkedIn, IconInstagram, IconX, IconArrow } from "./Icons";

export default function Footer() {
  return (
    <footer id="contact" className="bg-bgdark text-white">
      {/* CTA banner */}
      <div className="border-b border-white/[.1]">
        <div className="max-w-[1280px] mx-auto px-8 py-12 md:py-14 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 text-center md:text-left">
          <h3 className="font-display font-semibold uppercase text-[24px] md:text-[30px] leading-[1.2] max-w-[26ch]">
            Ready to get started with your project?
          </h3>
          <a href="mailto:info@nawrassystems.com" className="btn btn-flame shrink-0">
            Get in touch <IconArrow />
          </a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-x-10 gap-y-10 py-[60px] border-b border-white/[.1]">
          <div>
            <div className="mb-5">
              <div className="inline-block bg-white rounded-lg px-4 py-2.5">
                <Logo size={34} />
              </div>
            </div>
            <p className="text-[13.5px] leading-[1.75] text-steellight max-w-[34ch]">
              Fire &amp; life-safety, ELV and ICT solutions provider based in Sharjah, UAE, delivering
              certified systems across the Emirates since 2005.
            </p>
            <div className="flex gap-2.5 mt-6">
              <a
                href="https://ae.linkedin.com/in/al-nawras-91365b25b"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-[40px] h-[40px] rounded-full border border-white/[.25] text-white flex items-center justify-center transition-all duration-300 hover:border-flame1 hover:bg-flame1"
              >
                <IconLinkedIn className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-[40px] h-[40px] rounded-full border border-white/[.25] text-white flex items-center justify-center transition-all duration-300 hover:border-flame1 hover:bg-flame1"
              >
                <IconInstagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                aria-label="X"
                className="w-[40px] h-[40px] rounded-full border border-white/[.25] text-white flex items-center justify-center transition-all duration-300 hover:border-flame1 hover:bg-flame1"
              >
                <IconX className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-[13px] tracking-[.12em] uppercase text-white mb-5">
              Company
            </h4>
            <div className="flex flex-col gap-[13px]">
              <Link to="/about/overview" className="text-[14px] text-steellight hover:text-white transition-colors">
                Overview
              </Link>
              <Link to="/about/mission" className="text-[14px] text-steellight hover:text-white transition-colors">
                Mission &amp; Vision
              </Link>
              <Link to="/about/founder" className="text-[14px] text-steellight hover:text-white transition-colors">
                Message from Founder
              </Link>
              <a href="#certifications" className="text-[14px] text-steellight hover:text-white transition-colors">
                Certifications
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-[13px] tracking-[.12em] uppercase text-white mb-5">
              Systems
            </h4>
            <div className="flex flex-col gap-[13px]">
              <Link to="/systems/fire-fighting" className="text-[14px] text-steellight hover:text-white transition-colors">
                Fire Fighting Systems
              </Link>
              <Link to="/systems/fire-alarm" className="text-[14px] text-steellight hover:text-white transition-colors">
                Fire Alarm Systems
              </Link>
              <Link to="/systems/emergency-lighting" className="text-[14px] text-steellight hover:text-white transition-colors">
                Emergency Lighting
              </Link>
              <Link to="/systems/elv" className="text-[14px] text-steellight hover:text-white transition-colors">
                ELV Systems
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-[13px] tracking-[.12em] uppercase text-white mb-5">
              Contact
            </h4>
            <div className="flex flex-col gap-[13px] text-[14px] text-steellight leading-[1.5]">
              <span>Sharjah HQ · +971 6 562 5425</span>
              <span>Dubai · +971 4 333 5373</span>
              <span>info@nawrassystems.com</span>
              <span>www.nawrassystems.com</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 py-7 text-[12.5px] text-steellight">
          <span>© 2026 Al Nawras Safety &amp; Security Systems LLC. All rights reserved.</span>
          <span>Concept design — for internal review.</span>
        </div>
      </div>
    </footer>
  );
}
