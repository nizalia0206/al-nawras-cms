export default function Testimonial() {
  return (
    <section className="bg-white py-[70px] md:py-[90px] border-t border-ink/[.06]">
      <div className="max-w-[820px] mx-auto px-8 text-center">
        <svg className="w-9 h-9 text-flame1/70 mx-auto mb-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.17 6C4.87 8.1 3.5 11 3.5 14.2 3.5 17.85 6.1 20 9 20c2.35 0 4-1.85 4-4.15 0-2.15-1.5-3.85-3.5-3.85-.35 0-.65.05-.9.1.35-2.35 2.15-4.45 4.4-5.6L11.5 4C9.9 4.55 8.35 5.1 7.17 6zm10 0C14.87 8.1 13.5 11 13.5 14.2c0 3.65 2.6 5.8 5.5 5.8 2.35 0 4-1.85 4-4.15 0-2.15-1.5-3.85-3.5-3.85-.35 0-.65.05-.9.1.35-2.35 2.15-4.45 4.4-5.6L21.5 4C19.9 4.55 18.35 5.1 17.17 6z" />
        </svg>
        <p className="font-display text-[19px] md:text-[24px] leading-[1.5] text-ink">
          Al Nawras delivered our fire and life-safety systems on schedule, to specification and
          fully compliant with Civil Defense requirements — a partner we keep coming back to.
        </p>
        <div className="mt-6">
          <div className="text-flame1 font-semibold text-[15px]">Facilities Director</div>
          <div className="text-inksoft text-[13px] mt-0.5">Client, Commercial Development · Dubai</div>
        </div>
      </div>
    </section>
  );
}
