import { supabase } from "../lib/supabase";

/**
 * Uploads a File to the "media" Supabase storage bucket under `folder/`
 * and returns its public URL. Throws on failure.
 */
export async function uploadImage(file, folder) {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
