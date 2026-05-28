import { Building2, ShieldCheck, Wrench, Mountain, Waves, Droplets } from "lucide-react";
import { departments, locations, type LocationId } from "@/data/orgStructure";

interface Props {
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}

const icons: Record<LocationId, React.ReactNode> = {
  hq: <Building2 className="h-5 w-5" />,
  shou: <ShieldCheck className="h-5 w-5" />,
  industrial: <Wrench className="h-5 w-5" />,
  site1: <Mountain className="h-5 w-5" />,
  site2: <Mountain className="h-5 w-5" />,
  water: <Droplets className="h-5 w-5" />,
};

export function LocationView({ onSelectDept, selectedDept }: Props) {
  return (
    <div className="relative w-full">
      {/* Schematic map */}
      <div className="relative w-full rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
        {/* River SVG layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="river" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="plateau" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1917" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#a8a29e" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          {/* plateau strip top */}
          <rect x="0" y="0" width="1000" height="220" fill="url(#plateau)" />
          {/* river */}
          <path
            d="M -20 540 C 150 480, 280 600, 430 530 S 720 470, 880 560 L 1040 560 L 1040 700 L -20 700 Z"
            fill="url(#river)"
          />
          <path
            d="M -20 540 C 150 480, 280 600, 430 530 S 720 470, 880 560 L 1040 560"
            stroke="#7dd3fc"
            strokeOpacity="0.6"
            strokeWidth="2"
            fill="none"
          />
          <text x="940" y="535" fill="#7dd3fc" fontSize="14" opacity="0.7">
            р. Шугнов →
          </text>
          <text x="20" y="535" fill="#7dd3fc" fontSize="14" opacity="0.7">
            ← верхнее течение
          </text>
        </svg>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6 min-h-[760px] lg:min-h-[680px]">
          {/* Top row — plateau zones */}
          <Zone
            className="lg:col-span-4 lg:col-start-1 lg:row-start-1"
            id="hq"
            onSelectDept={onSelectDept}
            selectedDept={selectedDept}
            icon={icons.hq}
          />
          <Zone
            className="lg:col-span-4 lg:col-start-5 lg:row-start-1"
            id="shou"
            onSelectDept={onSelectDept}
            selectedDept={selectedDept}
            icon={icons.shou}
          />
          <Zone
            className="lg:col-span-4 lg:col-start-9 lg:row-start-1"
            id="industrial"
            onSelectDept={onSelectDept}
            selectedDept={selectedDept}
            icon={icons.industrial}
          />

          {/* spacer for river */}
          <div className="lg:col-span-12 lg:row-start-2 h-10 lg:h-16" />

          {/* Bottom row — sites on the river */}
          <Zone
            className="lg:col-span-5 lg:col-start-1 lg:row-start-3"
            id="site2"
            onSelectDept={onSelectDept}
            selectedDept={selectedDept}
            icon={icons.site2}
          />
          <Zone
            className="lg:col-span-2 lg:col-start-6 lg:row-start-3"
            id="water"
            onSelectDept={onSelectDept}
            selectedDept={selectedDept}
            icon={icons.water}
          />
          <Zone
            className="lg:col-span-5 lg:col-start-8 lg:row-start-3"
            id="site1"
            onSelectDept={onSelectDept}
            selectedDept={selectedDept}
            icon={icons.site1}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        Подсказка: верхняя терраса — административно-производственная база, нижняя полоса — пойма реки с участками
        добычи. Кликните по отделу, чтобы увидеть штат.
      </p>
    </div>
  );
}

function Zone({
  id,
  icon,
  className,
  onSelectDept,
  selectedDept,
}: {
  id: LocationId;
  icon: React.ReactNode;
  className?: string;
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}) {
  const loc = locations.find((l) => l.id === id)!;
  const depts = departments.filter((d) => d.locationId === id);
  const total = depts.reduce(
    (s, d) => s + d.positions.reduce((ss, p) => ss + p.count, 0),
    0,
  );
  return (
    <div
      className={`relative rounded-xl border border-zinc-800 ${loc.color} backdrop-blur-sm p-3 sm:p-4 ring-1 ${loc.ring} ${className ?? ""}`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${loc.color} ring-1 ${loc.ring} text-zinc-100`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-zinc-100 leading-tight">{loc.title}</div>
          <div className="text-xs text-zinc-400">{loc.subtitle}</div>
        </div>
        <span className="shrink-0 rounded-md bg-zinc-900/80 px-2 py-0.5 text-xs text-zinc-300">{total} чел.</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {depts.map((d) => {
          const dTotal = d.positions.reduce((s, p) => s + p.count, 0);
          const active = selectedDept === d.id;
          return (
            <li key={d.id}>
              <button
                onClick={() => onSelectDept(d.id)}
                className={`group flex w-full items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-left text-xs transition ${
                  active
                    ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-50"
                    : "border-zinc-800 bg-zinc-950/50 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
              >
                <span className="truncate">{d.name}</span>
                <span className="shrink-0 text-[10px] text-zinc-400 group-hover:text-zinc-200">×{dTotal}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}