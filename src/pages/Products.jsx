import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import { IconSearch, IconClose } from "../components/Icons";
import { CATEGORIES, SUPPLIERS } from "../data/products";
import useProducts from "../hooks/useProducts";

export default function Products() {
  const { products: PRODUCTS } = useProducts();
  const [params, setParams] = useSearchParams();

  const [category, setCategory] = useState(params.get("cat") || "all");
  const [supplier, setSupplier] = useState(params.get("supplier") || "all");
  const [q, setQ] = useState(params.get("q") || "");
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    const next = {};
    if (category !== "all") next.cat = category;
    if (supplier !== "all") next.supplier = supplier;
    if (q) next.q = q;
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, supplier, q]);

  // keep in sync if the header/brand links change the URL after mount
  useEffect(() => {
    setCategory(params.get("cat") || "all");
    setSupplier(params.get("supplier") || "all");
    setQ(params.get("q") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("cat"), params.get("supplier")]);

  const list = useMemo(() => {
    const query = q.toLowerCase().trim();
    let l = !query
      ? PRODUCTS
      : PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            (p.short || "").toLowerCase().includes(query) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(query)) ||
            (SUPPLIERS[p.supplier]?.name || "").toLowerCase().includes(query)
        );
    if (category !== "all") l = l.filter((p) => p.category === category);
    if (supplier !== "all") l = l.filter((p) => p.supplier === supplier);
    if (sort === "price-asc") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") l = [...l].sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [PRODUCTS, q, category, supplier, sort]);

  const activeSupplierName = supplier !== "all" ? SUPPLIERS[supplier]?.name : null;

  return (
    <>
      <PageHeader
        eyebrow="Product Catalog"
        title={activeSupplierName ? `${activeSupplierName} Products` : "Fire, Life Safety & ICT Products"}
        desc="Certified equipment from Honeywell, Waterfall, H3C, Teknoware, Uranus Cable and KD Pipes — supplied, engineered and supported by Al Nawras Safety & Security Systems LLC."
        crumbs={[{ label: "Products" }]}
      />

      {/* Supplier strip */}
      <div className="border-b border-black/[.09] bg-paper2">
        <div className="max-w-[1280px] mx-auto px-8 py-4 flex gap-2.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSupplier("all")}
            className={`shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold uppercase tracking-[.05em] border transition-colors ${
              supplier === "all"
                ? "bg-ink text-white border-ink"
                : "bg-white text-inksoft border-ink/[.12] hover:border-flame1/50 hover:text-ink"
            }`}
          >
            All Brands
          </button>
          {Object.entries(SUPPLIERS).map(([key, s]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSupplier(supplier === key ? "all" : key)}
              className={`shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold uppercase tracking-[.05em] border transition-colors ${
                supplier === key
                  ? "bg-flame1 text-white border-flame1"
                  : "bg-white text-inksoft border-ink/[.12] hover:border-flame1/50 hover:text-ink"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <section className="py-14 md:py-16">
        <div className="max-w-[1280px] mx-auto px-8">
          {/* search + sort toolbar */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="relative flex-grow max-w-[440px]">
              <IconSearch className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-inksoft" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="w-full pl-11 pr-9 py-3 text-[14px] bg-white border border-ink/[.12] rounded-full outline-none focus:border-flame1 transition-colors"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-inksoft hover:text-ink"
                  aria-label="Clear search"
                >
                  <IconClose />
                </button>
              )}
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 text-[13px] font-medium bg-white border border-ink/[.12] rounded-full outline-none focus:border-flame1 transition-colors"
            >
              <option value="all">All Categories ({PRODUCTS.length})</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({PRODUCTS.filter((p) => p.category === c.id).length})
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="md:ml-auto px-4 py-3 text-[13px] font-medium bg-white border border-ink/[.12] rounded-full outline-none focus:border-flame1 transition-colors"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>

          <div className="text-[13px] text-inksoft mb-6">
            {list.length} product{list.length !== 1 ? "s" : ""} found
          </div>

          {list.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-ink/[.15] rounded-md">
              <IconSearch className="w-8 h-8 mx-auto mb-4 text-inksoft" />
              <h3 className="font-display uppercase text-[18px] text-ink mb-1.5">No matching products</h3>
              <p className="text-[13.5px] text-inksoft">Try a different search term or clear your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
