import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import {
  NETS_UNITS,
  KPI,
  getChildren,
  getDescendants,
  getUnitById,
  getPath,
  getTopLevelUnits,
  formatSomoni,
  type NetsUnit,
  type NetsUnitType,
} from "@/data/netsStructure";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Сохтори таркибии ҶДММ «Нет Солюшенс»" },
      { name: "description", content: "Интерактивная организационная структура компании" },
    ],
  }),
  component: Index,
});

type TabId = "org" | "departments" | "projects" | "staff" | "analytics" | "glossary";
const TABS: { id: TabId; label: string }[] = [
  { id: "org", label: "Оргсхема" },
  { id: "departments", label: "Департаменты" },
  { id: "projects", label: "Стратегические проекты" },
  { id: "staff", label: "Штатное расписание" },
  { id: "analytics", label: "HR аналитика" },
  { id: "glossary", label: "Глоссарий" },
];

function readTab(): TabId {
  if (typeof window === "undefined") return "org";
  const t = new URLSearchParams(window.location.search).get("tab") as TabId | null;
  return TABS.some((x) => x.id === t) ? (t as TabId) : "org";
}

function Index() {
  const [tab, setTab] = useState<TabId>("org");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => setTab(readTab()), []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }, [tab]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6">
        <header className="border-b border-[#D1D5DB] pb-3">
          <h1 className="text-lg sm:text-xl font-semibold text-[#111827]">
            Сохтори таркибии ҶДММ «Нет Солюшенс»
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            Интерактивная организационная структура компании
          </p>
        </header>

        <KpiStrip />

        <nav className="mt-3 -mx-4 sm:mx-0 overflow-x-auto">
          <div className="flex gap-1 px-4 sm:px-0 border-b border-[#D1D5DB]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap px-3 py-2 text-sm border-b-2 -mb-px transition ${
                  tab === t.id
                    ? "border-[#10B981] text-[#111827] font-medium"
                    : "border-transparent text-[#4B5563] hover:text-[#111827]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="mt-4">
          {tab === "org" && <OrgChart onSelect={setSelected} />}
          {tab === "departments" && <DepartmentsView onSelect={setSelected} />}
          {tab === "projects" && <StrategicProjectsView onSelect={setSelected} />}
          {tab === "staff" && <StaffTable onSelect={setSelected} />}
          {tab === "analytics" && <HrAnalytics />}
          {tab === "glossary" && <Glossary />}
        </main>
      </div>

      <UnitDetailsPanel unitId={selected} onClose={() => setSelected(null)} onSelect={setSelected} />
    </div>
  );
}

/* ---------------- KPI ---------------- */
function KpiStrip() {
  const items = [
    { label: "Штатных единиц", value: KPI.headcount.toString() },
    { label: "Должностей", value: KPI.positions.toString() },
    { label: "Фонд оплаты", value: formatSomoni(KPI.payroll) },
    { label: "Основных блоков", value: KPI.mainBlocks.toString() },
  ];
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-md border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-2">
          <div className="text-[11px] uppercase tracking-wider text-[#4B5563]">{it.label}</div>
          <div className="text-sm sm:text-base font-semibold text-[#111827]">{it.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Org chart ---------------- */
function UnitCard({
  unit,
  onSelect,
  compact = false,
}: {
  unit: NetsUnit;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  const isDept = unit.type === "department" || unit.type === "branch";
  const border = isDept ? "border-[#10B981]" : "border-[#D1D5DB]";
  return (
    <button
      onClick={() => onSelect(unit.id)}
      className={`w-full text-left rounded-md border ${border} bg-white px-3 py-2 hover:bg-[#F9FAFB] transition`}
    >
      <div className={`font-medium text-[#111827] leading-tight ${compact ? "text-[12px]" : "text-[13px]"}`}>
        {unit.nameTj}
      </div>
      {unit.nameRu && (
        <div className="text-[11px] text-[#4B5563] leading-tight mt-0.5">{unit.nameRu}</div>
      )}
      {(unit.headcount > 0 || unit.positionCount > 0) && (
        <div className="mt-1 text-[10px] text-[#4B5563]">
          {unit.headcount} ед. · {unit.positionCount} долж.
        </div>
      )}
    </button>
  );
}

function OrgChart({ onSelect }: { onSelect: (id: string) => void }) {
  const board = getUnitById("board")!;
  const dg = getUnitById("director-general")!;
  const tops = getTopLevelUnits();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1100px] flex flex-col items-center gap-4 py-4">
        <div className="w-[280px]">
          <UnitCard unit={board} onSelect={onSelect} />
        </div>
        <div className="h-4 w-px bg-[#EF4444]" />
        <div className="w-[280px]">
          <UnitCard unit={dg} onSelect={onSelect} />
        </div>
        <div className="h-4 w-px bg-[#EF4444]" />
        <div className="h-px w-full bg-[#EF4444]" />
        <div className="grid grid-cols-9 gap-2 w-full">
          {tops.map((t) => {
            const kids = getChildren(t.id);
            return (
              <div key={t.id} className="flex flex-col gap-2">
                <div className="h-2 w-px bg-[#EF4444] mx-auto -mt-2" />
                <UnitCard unit={t} onSelect={onSelect} compact />
                {kids.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1 border-t border-dashed border-[#D1D5DB]">
                    {kids.slice(0, 8).map((k) => (
                      <UnitCard key={k.id} unit={k} onSelect={onSelect} compact />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Departments ---------------- */
function DepartmentsView({ onSelect }: { onSelect: (id: string) => void }) {
  const tops = getTopLevelUnits();
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tops.map((t) => {
        const kids = getChildren(t.id);
        return (
          <div
            key={t.id}
            className="rounded-md border border-[#10B981] bg-white p-3 cursor-pointer hover:bg-[#F9FAFB]"
            onClick={() => onSelect(t.id)}
          >
            <div className="font-medium text-sm text-[#111827]">{t.nameTj}</div>
            {t.nameRu && <div className="text-xs text-[#4B5563]">{t.nameRu}</div>}
            <div className="mt-2 text-[11px] text-[#4B5563]">
              {t.headcount} штатных ед. · {t.positionCount} должностей · {formatSomoni(t.totalSalary)}
            </div>
            {kids.length > 0 && (
              <ul className="mt-2 text-xs text-[#111827] space-y-0.5">
                {kids.slice(0, 5).map((k) => (
                  <li key={k.id}>• {k.nameTj}</li>
                ))}
                {kids.length > 5 && (
                  <li className="text-[#4B5563]">+ ещё {kids.length - 5}</li>
                )}
              </ul>
            )}
            <button
              className="mt-3 text-xs font-medium text-[#10B981] hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(t.id);
              }}
            >
              Открыть →
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Strategic projects ---------------- */
function StrategicProjectsView({ onSelect }: { onSelect: (id: string) => void }) {
  const dept = getUnitById("department-strategic")!;
  const children = getChildren(dept.id);
  const projects = children.filter((c) => c.type === "project");
  const subsystems = children.filter((c) => c.type === "subsystem");
  const otherUnits = children.filter((c) => c.type !== "project" && c.type !== "subsystem");

  return (
    <div className="space-y-4">
      <div onClick={() => onSelect(dept.id)} className="cursor-pointer">
        <UnitCard unit={dept} onSelect={onSelect} />
      </div>

      <section>
        <h3 className="text-xs uppercase tracking-wider text-[#4B5563] mb-2">Проекты</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {projects.map((p) => {
            const sub = getChildren(p.id);
            return (
              <div key={p.id} className="rounded-md border border-[#10B981] bg-white p-3">
                <button onClick={() => onSelect(p.id)} className="text-left w-full">
                  <div className="font-medium text-sm">{p.nameTj}</div>
                  {p.nameRu && <div className="text-xs text-[#4B5563]">{p.nameRu}</div>}
                </button>
                {sub.length > 0 && (
                  <div className="mt-2 pl-3 border-l-2 border-[#EF4444] space-y-1">
                    {sub.map((s) => (
                      <UnitCard key={s.id} unit={s} onSelect={onSelect} compact />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {subsystems.length > 0 && (
        <section>
          <h3 className="text-xs uppercase tracking-wider text-[#4B5563] mb-2">Подсистемы</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {subsystems.map((s) => (
              <UnitCard key={s.id} unit={s} onSelect={onSelect} compact />
            ))}
          </div>
        </section>
      )}

      {otherUnits.length > 0 && (
        <section>
          <h3 className="text-xs uppercase tracking-wider text-[#4B5563] mb-2">Подразделения</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {otherUnits.map((u) => (
              <UnitCard key={u.id} unit={u} onSelect={onSelect} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------------- Staff table ---------------- */
function StaffTable({ onSelect }: { onSelect: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("");
  const positions = useMemo(() => NETS_UNITS.filter((u) => u.type === "position"), []);
  const tops = getTopLevelUnits();

  const filtered = positions.filter((p) => {
    const path = getPath(p.id);
    const dept = path.find((x) => x.type === "department" || x.type === "branch");
    if (deptFilter && dept?.id !== deptFilter) return false;
    if (q) {
      const hay = `${p.nameTj} ${p.nameRu ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4B5563]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по должности"
            className="pl-7 pr-2 py-1.5 text-sm border border-[#D1D5DB] rounded-md bg-white"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="text-sm border border-[#D1D5DB] rounded-md px-2 py-1.5 bg-white"
        >
          <option value="">Все департаменты</option>
          {tops.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nameTj}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setQ("");
            setDeptFilter("");
          }}
          className="text-sm border border-[#D1D5DB] rounded-md px-2 py-1.5 hover:bg-[#F9FAFB]"
        >
          Сброс
        </button>
        <span className="text-xs text-[#4B5563] ml-auto">Найдено: {filtered.length}</span>
      </div>

      <div className="overflow-x-auto border border-[#D1D5DB] rounded-md">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-[#F9FAFB] sticky top-0">
            <tr className="text-left text-[#4B5563]">
              <th className="px-2 py-2">Департамент</th>
              <th className="px-2 py-2">Подразделение</th>
              <th className="px-2 py-2">Должность TJ</th>
              <th className="px-2 py-2">Должность RU</th>
              <th className="px-2 py-2 text-right">Кол-во</th>
              <th className="px-2 py-2 text-right">Оклад</th>
              <th className="px-2 py-2 text-right">ФММ</th>
              <th className="px-2 py-2 text-right">Итого</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-2 py-6 text-center text-[#4B5563]">
                  Детальные строки штатного расписания будут добавлены после загрузки данных.
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const path = getPath(p.id);
              const dept = path.find((x) => x.type === "department" || x.type === "branch");
              const parent = p.parentId ? getUnitById(p.parentId) : null;
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className="border-t border-[#D1D5DB] hover:bg-[#F9FAFB] cursor-pointer"
                >
                  <td className="px-2 py-1.5">{dept?.nameTj}</td>
                  <td className="px-2 py-1.5">{parent?.nameTj}</td>
                  <td className="px-2 py-1.5">{p.nameTj}</td>
                  <td className="px-2 py-1.5 text-[#4B5563]">{p.nameRu}</td>
                  <td className="px-2 py-1.5 text-right">{p.headcount}</td>
                  <td className="px-2 py-1.5 text-right">{p.salary.toFixed(2)}</td>
                  <td className="px-2 py-1.5 text-right">{p.fmm.toFixed(2)}</td>
                  <td className="px-2 py-1.5 text-right">{p.totalSalary.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- HR analytics ---------------- */
function HrAnalytics() {
  const tops = getTopLevelUnits();
  const max = Math.max(1, ...tops.map((t) => t.headcount));
  const positions = NETS_UNITS.filter((u) => u.type === "position");
  const salaries = positions.map((p) => p.salary).filter((n) => n > 0);
  const avg = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;

  const cards = [
    { label: "Штатных единиц", value: KPI.headcount.toString() },
    { label: "Должностей", value: KPI.positions.toString() },
    { label: "Фонд оплаты", value: formatSomoni(KPI.payroll) },
    { label: "Средний оклад", value: avg ? formatSomoni(avg) : "—" },
    { label: "Мин. оклад", value: salaries.length ? formatSomoni(Math.min(...salaries)) : "—" },
    { label: "Макс. оклад", value: salaries.length ? formatSomoni(Math.max(...salaries)) : "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {cards.map((c) => (
          <div key={c.label} className="rounded-md border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-[#4B5563]">{c.label}</div>
            <div className="text-sm font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <section>
        <h3 className="text-sm font-semibold mb-2">Численность по основным блокам</h3>
        <div className="space-y-1">
          {tops.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-xs">
              <div className="w-56 truncate text-[#111827]">{t.nameTj}</div>
              <div className="flex-1 bg-[#F9FAFB] border border-[#D1D5DB] rounded h-4 overflow-hidden">
                <div
                  className="h-full bg-[#10B981]"
                  style={{ width: `${(t.headcount / max) * 100}%` }}
                />
              </div>
              <div className="w-10 text-right text-[#4B5563]">{t.headcount}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Glossary ---------------- */
function Glossary() {
  const items: [string, string][] = [
    ["Департамент", "Крупный функциональный блок компании."],
    ["Шуъба", "Отдел."],
    ["Бахш", "Сектор или участок внутри отдела."],
    ["Лоиҳа", "Проект."],
    ["Зернизом", "Подсистема."],
    ["Шумора", "Количество штатных единиц."],
    ["Маоши вазифавӣ", "Должностной оклад."],
    ["ФММ", "Фонд месячной оплаты / расчёт фонда оплаты."],
  ];
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {items.map(([term, def]) => (
        <div key={term} className="rounded-md border border-[#D1D5DB] bg-white p-3">
          <dt className="font-medium text-sm text-[#111827]">{term}</dt>
          <dd className="text-xs text-[#4B5563] mt-1">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------- Details panel ---------------- */
const TYPE_LABEL: Record<NetsUnitType, string> = {
  company: "Компания",
  board: "Наблюдательный совет",
  director: "Руководитель",
  department: "Департамент",
  branch: "Филиал",
  division: "Шуъба (отдел)",
  section: "Бахш (сектор)",
  project: "Лоиҳа (проект)",
  subsystem: "Зернизом (подсистема)",
  position: "Должность",
};

function UnitDetailsPanel({
  unitId,
  onClose,
  onSelect,
}: {
  unitId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  if (!unitId) return null;
  const unit = getUnitById(unitId);
  if (!unit) return null;

  const path = getPath(unit.id);
  const parent = unit.parentId ? getUnitById(unit.parentId) : null;
  const children = getChildren(unit.id);
  const positions = getDescendants(unit.id).filter((u) => u.type === "position");
  const dept = path.find((x) => x.type === "department" || x.type === "branch");

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <aside className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white border-l border-[#D1D5DB] shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#D1D5DB] px-4 py-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-[#4B5563]">
              {TYPE_LABEL[unit.type]}
            </div>
            <div className="font-semibold text-[#111827] leading-tight">{unit.nameTj}</div>
            {unit.nameRu && <div className="text-xs text-[#4B5563]">{unit.nameRu}</div>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#F9FAFB] text-[#4B5563]"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-sm">
          <div className="text-xs text-[#4B5563]">
            Путь: {path.map((p) => p.nameTj).join(" › ")}
          </div>

          <dl className="grid grid-cols-2 gap-2 text-xs">
            {parent && (
              <>
                <dt className="text-[#4B5563]">Родитель</dt>
                <dd>{parent.nameTj}</dd>
              </>
            )}
            {dept && unit.type !== "department" && unit.type !== "branch" && (
              <>
                <dt className="text-[#4B5563]">Департамент</dt>
                <dd>{dept.nameTj}</dd>
              </>
            )}
            <dt className="text-[#4B5563]">Штатных единиц</dt>
            <dd>{unit.headcount}</dd>
            <dt className="text-[#4B5563]">Должностей</dt>
            <dd>{unit.positionCount}</dd>
            {unit.type === "position" && (
              <>
                <dt className="text-[#4B5563]">Оклад</dt>
                <dd>{unit.salary.toFixed(2)}</dd>
                <dt className="text-[#4B5563]">ФММ</dt>
                <dd>{unit.fmm.toFixed(2)}</dd>
              </>
            )}
            <dt className="text-[#4B5563]">Итого</dt>
            <dd>{formatSomoni(unit.totalSalary)}</dd>
          </dl>

          {children.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-wider text-[#4B5563] mb-1">
                Дочерние подразделения
              </h4>
              <ul className="space-y-1">
                {children.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => onSelect(c.id)}
                      className="w-full text-left text-xs px-2 py-1.5 rounded border border-[#D1D5DB] hover:bg-[#F9FAFB]"
                    >
                      <div className="font-medium text-[#111827]">{c.nameTj}</div>
                      {c.nameRu && <div className="text-[10px] text-[#4B5563]">{c.nameRu}</div>}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {positions.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-wider text-[#4B5563] mb-1">
                Должности внутри блока
              </h4>
              <div className="overflow-x-auto border border-[#D1D5DB] rounded">
                <table className="w-full text-xs">
                  <thead className="bg-[#F9FAFB]">
                    <tr className="text-left text-[#4B5563]">
                      <th className="px-2 py-1">№</th>
                      <th className="px-2 py-1">Должность</th>
                      <th className="px-2 py-1 text-right">Кол-во</th>
                      <th className="px-2 py-1 text-right">Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((p, i) => (
                      <tr
                        key={p.id}
                        onClick={() => onSelect(p.id)}
                        className="border-t border-[#D1D5DB] hover:bg-[#F9FAFB] cursor-pointer"
                      >
                        <td className="px-2 py-1">{i + 1}</td>
                        <td className="px-2 py-1">{p.nameTj}</td>
                        <td className="px-2 py-1 text-right">{p.headcount}</td>
                        <td className="px-2 py-1 text-right">{p.totalSalary.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
