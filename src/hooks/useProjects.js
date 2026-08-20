import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { FALLBACK_PROJECTS } from "../data/projectsFallback";

/** Returns { projects, loading }, with the same graceful-fallback pattern as useProducts. */
export default function useProjects() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;

    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setProjects(data);
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { projects, loading };
}
