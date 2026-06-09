import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, GitFork, Map as MapIcon, Workflow, FileSpreadsheet, LineChart, Globe, Network } from "lucide-react";
import { LocationView } from "@/components/org/LocationView";
import { CycleView } from "@/components/org/CycleView";
import { HierarchyView } from "@/components/org/HierarchyView";
import { StaffingTable } from "@/components/org/StaffingTable";
import { HrDashboard } from "@/components/org/HrDashboard";
import { GlossaryView } from "@/components/org/GlossaryView";
import { MapsView } from "@/components/org/MapsView";
import { DiagramView } from "@/components/org/DiagramView";
import { DepartmentDrawer } from "@/components/org/DepartmentDrawer";
import { totalHeadcount, departments, locations } from "@/data/orgStructure";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Оргструктура — Шугнов Голд" },
      {
        name: "description",
        content:
          "Интерактивная организационная структура золотодобывающей компании полного цикла на реке Шугнов: 2000 га, 8× ППМ-5, три вида — по локациям, по производственному циклу и по иерархии подчинения.",
      },
      { property: "og:title", content: "Оргструктура — Шугнов Голд" },
      {
        property: "og:description",
        content:
          "Интерактивная оргструктура золотодобывающей компании полного цикла. 2000 га, 8× ППМ-5.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<OrgView>("location");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const total = totalHeadcount();
  const sitesCount = locations.filter((l) => l.id === "site1" || l.id === "site2").length;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.2em] text-yellow-600">
                Aurum · р. Шугнов · Ховалинг, Таджикистан
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Оргструктура золотодобывающей компании
              </h1>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-600">
                Полный цикл промывки золота на 2000 гектарах поймы реки Шугнов с использованием 8
                промывочных приборов ППМ-5. Переключайте вид, чтобы увидеть физическое размещение
                отделов, порядок их участия в производственном цикле или схему управленческого
                подчинения.
              </p>
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </header>

        <main>
          {view === "location" && (
            <LocationView onSelectDept={setSelectedDept} selectedDept={selectedDept} />
          )}
          {view === "cycle" && (
            <CycleView onSelectDept={setSelectedDept} selectedDept={selectedDept} />
          )}
          {view === "hierarchy" && (
            <HierarchyView onSelectDept={setSelectedDept} selectedDept={selectedDept} />
          )}
          {view === "staffing" && <StaffingTable onSelectDept={setSelectedDept} />}
          {view === "hr" && <HrDashboard />}
          {view === "glossary" && (
            <GlossaryView
              onSwitchView={(v, deptId) => {
                setView(v);
                if (deptId) setSelectedDept(deptId);
              }}
            />
          )}
          {view === "maps" && <MapsView />}
        </main>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Сотрудников" value={total.toString()} suffix="чел." />
          <Stat label="Машин ППМ-5" value="8" suffix="шт." />
          <Stat label="Горных участков" value={sitesCount.toString()} suffix="пл." />
          <Stat label="Площадь" value="2 000" suffix="га" />
        </section>

        <section className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 text-[11px]">
          {locations.map((l) => {
            const c = departments
              .filter((d) => d.locationId === l.id)
              .reduce((s, d) => s + d.positions.reduce((ss, p) => ss + p.count, 0), 0);
            return (
              <div
                key={l.id}
                className={`rounded-md border px-2 py-1.5 ${l.badge} flex items-center justify-between gap-2`}
              >
                <span className="truncate">{l.title.replace("Локация ", "Л.")}</span>
                <span className="opacity-80">{c}</span>
              </div>
            );
          })}
        </section>

        <footer className="mt-8 text-center text-[11px] text-zinc-500">
          Кликните по любому отделу, чтобы увидеть полный штат должностей и переключиться между
          видами.
        </footer>
      </div>

      <DepartmentDrawer
        deptId={selectedDept}
        onClose={() => setSelectedDept(null)}
        view={view}
        onSwitchView={setView}
      />
    </div>
  );
}

type OrgView = "location" | "cycle" | "hierarchy" | "staffing" | "hr" | "glossary" | "maps";

function ViewToggle({ view, onChange }: { view: OrgView; onChange: (v: OrgView) => void }) {
  const items: Array<{ id: OrgView; label: string; short: string; Icon: typeof MapIcon }> = [
    { id: "location", label: "По локациям", short: "Локации", Icon: MapIcon },
    { id: "cycle", label: "По производственному циклу", short: "Цикл", Icon: Workflow },
    { id: "hierarchy", label: "По иерархии", short: "Иерархия", Icon: GitFork },
    { id: "staffing", label: "Штатное расписание", short: "Штат", Icon: FileSpreadsheet },
    { id: "hr", label: "HR аналитика", short: "HR", Icon: LineChart },
    { id: "glossary", label: "Глоссарий", short: "Глоссарий", Icon: BookOpen },
    { id: "maps", label: "Карта", short: "Карта", Icon: Globe },
  ];
  return (
    <div className="-mx-4 sm:mx-0 overflow-x-auto sm:overflow-visible">
      <div className="inline-flex min-w-max sm:min-w-0 sm:flex-wrap rounded-xl border border-zinc-200 bg-zinc-100 p-1 shadow-inner mx-4 sm:mx-0 gap-0.5">
        {items.map(({ id, label, short, Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs sm:text-sm whitespace-nowrap transition ${
                active
                  ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white font-semibold shadow"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-yellow-600">{value}</span>
        <span className="text-xs text-zinc-500">{suffix}</span>
      </div>
    </div>
  );
}
