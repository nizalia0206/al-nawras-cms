import { useParams, Link, Navigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import { SUPPLIERS, CATEGORIES } from "../data/products";
import useProducts from "../hooks/useProducts";

function suggestionsFor(product, PRODUCTS, count = 3) {
  const sameCat = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  const sameSup = PRODUCTS.filter(
    (p) => p.id !== product.id && p.supplier === product.supplier && p.category !== product.category
  );
  const pool = [...sameCat, ...sameSup];
  const seen = new Set();
  const out = [];
  for (const p of pool) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= count) break;
  }
  return out;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { products: PRODUCTS, loading } = useProducts();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    if (loading) return null;
    return <Navigate to="/products" replace />;
  }

  const supplier = SUPPLIERS[product.supplier];
  const category = CATEGORIES.find((c) => c.id === product.category);
  const related = suggestionsFor(product, PRODUCTS, 3);

  return (
    <>
      <PageHeader
        eyebrow={supplier?.name}
        title={product.name}
        crumbs={[
          { label: "Products", href: "/products" },
          { label: supplier?.name, href: `/products?supplier=${product.supplier}` },
          { label: product.name },
        ]}
      />

      <section className="py-14 md:py-16">
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-paper2 rounded-md border border-ink/[.08] aspect-square flex items-center justify-center p-10">
            <img
              src={product.images[0]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div>
            <div className="sec-eyebrow">{category?.name}</div>
            <h1 className="font-display font-semibold uppercase text-[26px] md:text-[32px] leading-[1.1] text-ink mb-4">
              {product.name}
            </h1>
            <p className="text-[15px] leading-[1.8] text-inksoft mb-6">{product.description}</p>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-[20px] font-semibold text-ink">
                AED {product.price.toLocaleString("en-US")}
              </span>
              {(product.priceUnit || product.price_unit) && (
                <span className="text-[13px] text-inksoft">{product.priceUnit || product.price_unit}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              <a href="#contact" className="btn btn-flame">
                Request a Quote
              </a>
              <Link
                to={`/products?supplier=${product.supplier}`}
                className="btn border border-ink/[.14] text-ink hover:border-flame1/50"
              >
                More from {supplier?.name}
              </Link>
            </div>

            {product.specs?.length > 0 && (
              <div className="border-t border-ink/[.08] pt-6">
                <h3 className="font-display uppercase text-[13.5px] tracking-wide text-ink mb-4">
                  Specifications
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {product.specs.map(([label, val]) => (
                    <div key={label} className="flex justify-between sm:flex-col sm:gap-0.5 text-[13.5px]">
                      <dt className="text-inksoft">{label}</dt>
                      <dd className="font-medium text-ink text-right sm:text-left">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="max-w-[1280px] mx-auto px-8">
            <h2 className="font-display uppercase text-[20px] md:text-[24px] tracking-wide text-ink mb-6 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-gradient-to-r from-flame1 to-gold" />
              You may also need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
