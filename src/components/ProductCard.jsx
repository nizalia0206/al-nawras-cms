import { Link } from "react-router-dom";
import { SUPPLIERS } from "../data/products";

export default function ProductCard({ product }) {
  const supplier = SUPPLIERS[product.supplier];

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col bg-white border border-ink/[.08] rounded-md overflow-hidden transition-all duration-300 hover:border-flame1/40 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(238,108,47,.35)]"
    >
      <div className="relative aspect-[4/3] bg-paper2 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 text-[10.5px] font-semibold uppercase tracking-[.1em] text-white bg-ink/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {supplier?.name}
        </span>
      </div>
      <div className="flex flex-col flex-grow p-5">
        <h3 className="font-display text-[14.5px] uppercase tracking-wide text-ink leading-snug mb-2 group-hover:text-flame1 transition-colors">
          {product.name}
        </h3>
        <p className="text-[13px] leading-[1.55] text-inksoft flex-grow">{product.short}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/[.06]">
          <span className="text-[13px] font-semibold text-ink">
            {(product.priceUnit || product.price_unit) ? "From " : ""}
            {product.price ? `AED ${product.price.toLocaleString("en-US")}` : "Request quote"}
            {(product.priceUnit || product.price_unit) ? (
              <span className="text-inksoft font-normal">{product.priceUnit || product.price_unit}</span>
            ) : null}
          </span>
          <span className="text-[12.5px] font-semibold uppercase tracking-[.06em] text-flame1 group-hover:translate-x-0.5 transition-transform">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
