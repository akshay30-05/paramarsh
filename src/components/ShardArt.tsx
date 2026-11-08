// Decorative, fragmented shard clusters in the company colours.
// Pure SVG: no images to load, crisp at every size.

type Variant = "approach" | "careers" | "about";

interface ShardArtProps {
  variant: Variant;
  className?: string;
}

const CLUSTERS: Record<Variant, { points: string; fill: string; opacity?: number }[]> = {
  approach: [
    { points: "40,30 210,0 250,160 70,190", fill: "#246BFE" },
    { points: "230,170 330,140 360,260 250,290", fill: "#56C8E8" },
    { points: "90,210 200,230 170,330 60,300", fill: "#13233A", opacity: 0.9 },
    { points: "300,40 350,30 360,90 310,100", fill: "#F5C451" },
  ],
  careers: [
    { points: "60,20 260,60 220,240 30,200", fill: "#246BFE" },
    { points: "250,210 370,190 390,330 270,350", fill: "#56C8E8", opacity: 0.9 },
    { points: "40,230 170,250 150,370 20,340", fill: "#CDEFE5", opacity: 0.85 },
    { points: "290,40 360,20 380,110 300,130", fill: "#F5C451" },
  ],
  about: [
    { points: "20,30 120,10 140,110 30,130", fill: "#246BFE" },
    { points: "150,40 230,60 210,150 140,130", fill: "#56C8E8" },
    { points: "40,150 130,140 150,230 50,240", fill: "#CDEFE5" },
    { points: "170,170 230,160 240,220 180,235", fill: "#F5C451" },
  ],
};

const VIEWBOX: Record<Variant, string> = {
  approach: "0 0 380 340",
  careers: "0 0 400 380",
  about: "0 0 260 260",
};

export default function ShardArt({ variant, className }: ShardArtProps) {
  return (
    <svg
      viewBox={VIEWBOX[variant]}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {CLUSTERS[variant].map((s, i) => (
        <polygon
          key={i}
          points={s.points}
          fill={s.fill}
          opacity={s.opacity ?? 1}
          className="shard-poly"
          style={{ animationDelay: `${i * -1.7}s` }}
        />
      ))}
    </svg>
  );
}
