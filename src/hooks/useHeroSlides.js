import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";

/**
 * Returns a map of { [slide_key]: image_url } for any home hero slide
 * images that have been overridden via the CMS. Slides not present in
 * the map keep using their bundled static image.
 */
export default function useHeroSlides() {
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;

    supabase
      .from("home_hero_slides")
      .select("*")
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const map = {};
        for (const row of data) map[row.slide_key] = row.image_url;
        setOverrides(map);
      });

    return () => { cancelled = true; };
  }, []);

  return overrides;
}
