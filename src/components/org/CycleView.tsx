import { ChevronRight } from "lucide-react";
import {
  cycleStages,
  departments,
  getLocation,
  supportTracks,
  type CycleStageId,
  type SupportTrackId,
} from "@/data/orgStructure";

interface Props {
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}

export function CycleView({ onSelectDept, selectedDept }: Props) {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-gradient-to-b from-white via-zinc-50 to-white p-4 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
        <h3 className="text-sm font-semibold text-zinc-900">Производственный поток: от разведки до слитка</h3>
      </div>

      {/* Main pipeline */}
      <div className="overflow-x-auto pb-3">
        <div className="flex min-w-[1100px] items-stretch gap-2">
          {cycleStages.map((stage, idx) => (
            <div key={stage.id} className="flex items-stretch">
              <StageColumn
                stageId={stage.id}
                title={stage.title}
                subtitle={stage.short}
                color={stage.color}
                onSelectDept={onSelectDept}
                selectedDept={selectedDept}
              />
              {idx < cycleStages.length - 1 && (
                <div className="mx-1 flex items-center text-zinc-400">
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support tracks */}
      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
          Поддерживающие службы (работают параллельно вдоль всего цикла)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {supportTracks.map((track) => (
            <SupportCard
              key={track.id}
              trackId={track.id}
              title={track.title}
              color={track.color}
              onSelectDept={onSelectDept}
              selectedDept={selectedDept}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StageColumn({
  stageId,
  title,
  subtitle,
  color,
  onSelectDept,
  selectedDept,
}: {
  stageId: CycleStageId;
  title: string;
  subtitle: string;
  color: string;
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}) {
  const depts = departments.filter((d) => d.cycleStageId === stageId);
  const total = depts.reduce(
    (s, d) => s + d.positions.reduce((ss, p) => ss + p.count, 0),
    0,
  );

  return (
    <div className="flex w-[200px] flex-col rounded-xl border border-zinc-200 bg-white/80 overflow-hidden shadow-sm">
      <div className={`bg-gradient-to-br ${color} px-3 py-2`}>
        <div className="text-sm font-semibold text-white leading-tight">{title}</div>
        <div className="text-[11px] text-white/80">{subtitle}</div>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-zinc-500 border-b border-zinc-200">
        <span>{depts.length} отдел.</span>
        <span>{total} чел.</span>
      </div>
      <ul className="flex-1 space-y-1.5 p-2">
        {depts.map((d) => {
          const dTotal = d.positions.reduce((s, p) => s + p.count, 0);
          const loc = getLocation(d.locationId);
          const active = selectedDept === d.id;
          return (
            <li key={d.id}>
              <button
                onClick={() => onSelectDept(d.id)}
                className={`w-full rounded-md border px-2 py-1.5 text-left text-[11px] leading-tight transition ${
                  active
                    ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-800"
                    : "border-zinc-200 bg-zinc-50/60 text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate font-medium">{d.name}</span>
                  <span className="shrink-0 text-[10px] text-zinc-500">×{dTotal}</span>
                </div>
                <div className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] border ${loc.badge}`}>
                  {loc.title.replace("Локация ", "Л.")}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SupportCard({
  trackId,
  title,
  color,
  onSelectDept,
  selectedDept,
}: {
  trackId: SupportTrackId;
  title: string;
  color: string;
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}) {
  const depts = departments.filter((d) => d.supportTrackId === trackId);
  const total = depts.reduce(
    (s, d) => s + d.positions.reduce((ss, p) => ss + p.count, 0),
    0,
  );
  return (
    <div className="rounded-xl border border-zinc-200 bg-white/60 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-md border px-2 py-0.5 text-xs ${color}`}>{title}</span>
        <span className="text-[11px] text-zinc-500">{total} чел.</span>
      </div>
      <ul className="mt-2 space-y-1">
        {depts.map((d) => {
          const dTotal = d.positions.reduce((s, p) => s + p.count, 0);
          const active = selectedDept === d.id;
          return (
            <li key={d.id}>
              <button
                onClick={() => onSelectDept(d.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-md border px-2 py-1 text-left text-[11px] transition ${
                  active
                    ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-800"
                    : "border-zinc-200 bg-zinc-50/40 text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                <span className="truncate">{d.name}</span>
                <span className="shrink-0 text-[10px] text-zinc-500">×{dTotal}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
