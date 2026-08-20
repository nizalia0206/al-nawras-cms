// Animated field of thin converging lines — white/steel fanning in from the left,
// flame/ember fanning in from the right, crossing at a bright pinch point.
// Used behind the PageHeader banner on every subpage (not the home hero).
const LINES = 34;
const W = 1280;
const H = 300;
const PINCH_X = 760;
const PINCH_Y = 140;

function buildLines() {
  const lines = [];
  for (let i = 0; i < LINES; i++) {
    const t = i / (LINES - 1);
    // spread endpoints well beyond the viewBox so the fan feels continuous
    const yStart = -60 + t * (H + 120);
    const yEnd = -60 + (1 - t) * (H + 120) * 0.65 + t * 40;
    lines.push({ id: i, yStart, yEnd });
  }
  return lines;
}

const LINE_DATA = buildLines();

export default function WaveField({ className = "" }) {
  return (
    <svg
      className={`wavefield ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="wfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#93a1c2" stopOpacity=".05" />
          <stop offset="28%" stopColor="#d3daea" stopOpacity=".38" />
          <stop offset="47%" stopColor="#ffffff" stopOpacity=".65" />
          <stop offset="54%" stopColor="#ffb020" stopOpacity=".6" />
          <stop offset="72%" stopColor="#ee6c2f" stopOpacity=".45" />
          <stop offset="100%" stopColor="#c8501c" stopOpacity=".08" />
        </linearGradient>
      </defs>
      <g>
        {LINE_DATA.map((l, i) => (
          <path
            key={l.id}
            className="wf-line"
            d={`M0,${l.yStart} Q${PINCH_X},${PINCH_Y} ${W},${l.yEnd}`}
            fill="none"
            stroke="url(#wfGrad)"
            strokeWidth="1"
            style={{
              animationDuration: `${9 + (i % 7)}s`,
              animationDelay: `-${(i * 0.37).toFixed(2)}s`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
