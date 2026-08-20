import { useRef, useState } from "react";
import { uploadImage } from "./uploadImage";

/**
 * label, folder: storage folder e.g. "products"
 * value: current image URL (string) or null
 * onChange(url): called with the new public URL after a successful upload
 */
export default function ImageUploadField({ label, folder, value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (ex) {
      setErr(ex.message || "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-field">
      {label && <label>{label}</label>}
      <div
        className="admin-upload-box"
        onClick={() => inputRef.current?.click()}
      >
        {busy ? "Uploading…" : value ? "Click to replace image" : "Click to upload an image"}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      {err && <div className="admin-error">{err}</div>}
      {value && (
        <div className="admin-preview-strip">
          <img src={value} alt="preview" />
        </div>
      )}
    </div>
  );
}
