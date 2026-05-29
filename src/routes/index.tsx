import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Map as MapIcon, Workflow } from "lucide-react";
import { LocationView } from "@/components/org/LocationView";
import { CycleView } from "@/components/org/CycleView";
import { DepartmentDrawer } from "@/components/org/DepartmentDrawer";
import { totalHeadcount, departments, locations } from "@/data/orgStructure";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Оргструктура — Шугнов Голд" },
      {
        name: "description",
        content:
          "Интерактивная организационная структура золотодобывающей компании полного цикла на реке Шугнов: 2000 га, 8× ППМ-5, два вида — по локациям и по производственному циклу.",
      },
      { property: "og:title", content: "Оргструктура — Шугнов Голд" },
      {
        property: "og:description",
        content: "Интерактивная оргструктура золотодобывающей компании полного цикла. 2000 га, 8× ППМ-5.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<"location" | "cycle">("location");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const total = totalHeadcount();
  const sitesCount = locations.filter((l) => l.id === "site1" || l.id === "site2").length;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-yellow-600">
                Aurum · р. Шугнов · Ховалинг, Таджикистан
              </div>
              <h1 className="mt-1 text-3xl sm:text-4xl font-bold leading-tight bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Оргструктура золотодобывающей компании
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                Полный цикл промывки золота на 2000 гектарах поймы реки Шугнов с использованием 8 промывочных приборов
                ППМ-5. Переключайте вид, чтобы увидеть либо физическое размещение отделов, либо порядок их участия в
                производственном цикле.
              </p>
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </header>

        <main>
          {view === "location" ? (
            <LocationView onSelectDept={setSelectedDept} selectedDept={selectedDept} />
          ) : (
            <CycleView onSelectDept={setSelectedDept} selectedDept={selectedDept} />
          )}
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
          Кликните по любому отделу, чтобы увидеть полный штат должностей и переключиться между видами.
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

function ViewToggle({
  view,
  onChange,
}: {
  view: "location" | "cycle";
  onChange: (v: "location" | "cycle") => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1 shadow-inner">
      <button
        onClick={() => onChange("location")}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
          view === "location"
            ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white font-semibold shadow"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        <MapIcon className="h-4 w-4" />
        По локациям
      </button>
      <button
        onClick={() => onChange("cycle")}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
          view === "cycle"
            ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white font-semibold shadow"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        <Workflow className="h-4 w-4" />
        По производственному циклу
      </button>
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
