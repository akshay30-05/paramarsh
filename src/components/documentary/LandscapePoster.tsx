// Static drawn landscape. It is the first frame before the 3D scene loads, and
// the fallback when WebGL is unavailable. PLACEHOLDER until real footage exists.
export default function LandscapePoster({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="poster-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#111a24" />
          <stop offset="0.55" stopColor="#263d52" />
          <stop offset="0.85" stopColor="#b58a52" stopOpacity="0.55" />
          <stop offset="1" stopColor="#a9b8b1" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="poster-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9b8b1" stopOpacity="0" />
          <stop offset="0.5" stopColor="#a9b8b1" stopOpacity="0.22" />
          <stop offset="1" stopColor="#111a24" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#poster-sky)" />
      <path fill="#2f4a5f" d="M0 560 C200 500 340 540 520 490 S860 430 1040 480 1300 520 1600 450 V900 H0 Z" />
      <path fill="#1f3446" d="M0 650 C180 590 360 640 560 585 S900 540 1100 600 1400 640 1600 580 V900 H0 Z" />
      <rect y="560" width="1600" height="200" fill="url(#poster-haze)" />
      <path fill="#16242f" d="M0 760 C220 700 420 780 640 730 S1000 680 1220 740 1450 790 1600 730 V900 H0 Z" />
      <path fill="#111a24" d="M0 850 C300 810 600 860 900 830 S1400 800 1600 840 V900 H0 Z" />
    </svg>
  );
}
