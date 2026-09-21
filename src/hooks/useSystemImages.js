import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";

/**
 * fallbackGroups: array of { title, items: [{ src, name, desc?, brand? }] } — bundled
 * static data for this system, used until Supabase data loads (or if it's
 * not configured / the table has no rows yet for this system_key).
 * Returns { groups, loading } where groups is always [{ title, items }].
 */
export default function useSystemImages(systemKey, fallbackGroups) {
  const [groups, setGroups] = useState(fallbackGroups);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    supabase
      .from("system_images")
      .select("*")
      .eq("system_key", systemKey)
      .order("group_order", { ascending: true })
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          const byGroup = new Map();
          for (const row of data) {
            const key = row.group_title || "";
            if (!byGroup.has(key)) byGroup.set(key, []);
            // desc / brand are optional CMS columns (`description` or `desc`, `brand`);
            // they feed the card's description line and brand tag when present.
            byGroup.get(key).push({
              src: row.src,
              name: row.name,
              desc: row.description ?? row.desc ?? undefined,
              brand: row.brand ?? undefined,
            });
          }
          setGroups(Array.from(byGroup.entries()).map(([title, items]) => ({ title, items })));
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [systemKey]);

  return { groups, loading };
}
