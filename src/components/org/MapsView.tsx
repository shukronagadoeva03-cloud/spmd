import { Building2, ShieldCheck, Warehouse, FlaskConical, MapPin, Truck } from "lucide-react";
import { locations, departments } from "@/data/orgStructure";

const ICONS = {
  hq: Building2,
  shou: ShieldCheck,
  industrial: Warehouse,
  site1: FlaskConical,
  site2: MapPin,
  water: Truck,
} as const;

// Условные координаты офисов NETS в Таджикистане (для схематичной карты)
const COORDS: Record<string, { x: number; y: number }> = {
  hq: { x: 38, y: 78 }, // Душанбе
  shou: { x: 41, y: 75 }, // Душанбе (защищённое помещение)
  industrial: { x: 44, y: 72 }, // промзона Душанбе
  site1: { x: 35, y: 80 }, // R&D Душанбе
  site2: { x: 70, y: 30 }, // Худжанд
  water: { x: 55, y: 55 }, // мобильные
};

export function MapsView() {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <div className="p-4 border-b border-zinc-200">
        <h2 className="text-lg font-semibold text-zinc-900">Карта офисов NETS</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Схематичное расположение площадок NETS: HQ и R&D-центр в Душанбе, региональный офис в
          Худжанде, NOC/SOC и сервисный хаб. Выездные бригады работают по всей республике.
        </p>
      </div>

      <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        {/* Stylized country silhouette */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M 5 35 Q 15 25, 30 22 T 60 18 Q 78 16, 92 24 Q 96 32, 88 42 Q 75 50, 55 48 Q 32 52, 18 46 Q 6 42, 5 35 Z"
            fill="url(#land)"
            stroke="#facc15"
            strokeWidth="0.3"
            opacity="0.8"
          />
          {/* Roads */}
          <path
            d="M 70 30 Q 55 50, 38 78"
            fill="none"
            stroke="#a8a29e"
            strokeWidth="0.3"
            strokeDasharray="1 1"
          />
        </svg>

        {/* City labels */}
        <div className="absolute" style={{ left: "37%", top: "82%" }}>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">Душанбе</div>
        </div>
        <div className="absolute" style={{ left: "68%", top: "22%" }}>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">Худжанд</div>
        </div>

        {/* Office pins */}
        {locations.map((loc) => {
          const c = COORDS[loc.id];
          if (!c) return null;
          const Icon = ICONS[loc.id];
          const count = departments
            .filter((d) => d.locationId === loc.id)
            .reduce((s, d) => s + d.positions.reduce((ss, p) => ss + p.count, 0), 0);
          return (
            <div
              key={loc.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <div
                className={`flex items-center gap-2 rounded-full border ${loc.badge} px-2.5 py-1 shadow-md backdrop-blur-sm`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold whitespace-nowrap">
                  {loc.title.replace(/^Локация \d+ — /, "")}
                </span>
                <span className="text-[10px] opacity-70">·{count}</span>
              </div>
              <div className="mx-auto mt-0.5 h-2 w-2 rounded-full bg-yellow-500 ring-2 ring-white" />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 text-[11px]">
        {locations.map((l) => {
          const Icon = ICONS[l.id];
          return (
            <div
              key={l.id}
              className={`flex items-start gap-2 rounded-md border px-2.5 py-2 ${l.badge}`}
            >
              <Icon className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-semibold leading-tight">{l.title}</div>
                <div className="opacity-80 leading-tight">{l.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
