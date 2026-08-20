import logoFull from "../assets/brand/logo-full.png";
import logoMark from "../assets/brand/logo-mark.png";

/**
 * size = rendered height in px. Width follows the artwork's own aspect ratio.
 * showText=false renders just the flame "N/S" mark (used as the large Hero watermark);
 * showText=true (default) renders the full lockup — mark + wordmark + tagline.
 */
export default function Logo({ size = 48, showText = true, light = false, className = "" }) {
  if (!showText) {
    return (
      <img
        src={logoMark}
        alt="Al Nawras"
        style={{ height: size, width: "auto" }}
        className={`shrink-0 object-contain ${light ? "drop-shadow-[0_4px_16px_rgba(0,0,0,.35)]" : ""} ${className}`}
      />
    );
  }

  return (
    <img
      src={logoFull}
      alt="Al Nawras Safety & Security Systems LLC"
      style={{ height: size, width: "auto" }}
      className={`shrink-0 object-contain ${light ? "drop-shadow-[0_4px_16px_rgba(0,0,0,.35)]" : ""} ${className}`}
    />
  );
}
