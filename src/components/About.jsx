import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Counter from "./Counter";

const YOUTUBE_ID = "vMQSlLgoxgw";

export default function About() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-white py-[90px] md:py-[110px]">
      <div ref={ref} className="reveal max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* copy */}
          <div>
            <div className="sec-eyebrow">About Us</div>
            <h2 className="font-display font-bold uppercase leading-[1.08] text-[28px] sm:text-[36px] md:text-[42px] text-flame1 max-w-[14ch]">
              Al Nawras is a Leading Fire, Life Safety &amp; ELV Solutions Provider
            </h2>
            <p className="mt-6 text-[15px] sm:text-[16px] leading-[1.75] text-inksoft max-w-[52ch]">
              Founded in Sharjah in 2005 by Eng. Mohammed Ghazy, Al Nawras Safety &amp; Security
              Systems has grown into a one-stop provider of fire protection, life-safety, ELV and
              ICT solutions across the UAE. From initial system design through installation and
              on-going maintenance, our qualified engineering and delivery teams work to the
              highest standards on every project we undertake.
            </p>
            <Link to="/about/overview" className="btn btn-flame mt-8 w-fit">
              Learn More
            </Link>
          </div>

          {/* video */}
          <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-ink/[.08] shadow-[0_20px_50px_-20px_rgba(0,0,0,.25)] bg-bgdark">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
              title="Al Nawras — Think Safety, Think Al Nawras"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* stats */}
        <div className="flex flex-wrap mt-16 md:mt-20 pt-10 border-t border-ink/[.08]">
          <Counter theme="light" target={1000} suffix="+" label="Projects Executed" />
          <Counter theme="light" target={20} suffix="+" label="Years of Experience" />
          <Counter theme="light" target={3} suffix="" label="UAE Offices" />
          <Counter theme="light" target={6} suffix="" label="Brand Partners" />
        </div>
      </div>
    </section>
  );
}
