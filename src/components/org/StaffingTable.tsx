import { Fragment, useEffect, useMemo, useState } from "react";
import { departments, getLocation, hierarchyTree, type HierarchyNode } from "@/data/orgStructure";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Download } from "lucide-react";

interface Props {
  onSelectDept: (id: string) => void;
}

type SalaryMap = Record<string, { salary: number; bonusPct: number }>;

const STORAGE_KEY = "shugnov.staffing.v1";
const MIN_SALARY = 2000;
const MAX_SALARY = 13000;

function clampSalary(value: number): number {
  return Math.min(MAX_SALARY, Math.max(MIN_SALARY, value));
}

function normalizeSalaryMap(value: unknown): SalaryMap {
  if (!value || typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value as SalaryMap).map(([key, row]) => [
      key,
      {
        salary: clampSalary(Number(row.salary) || MIN_SALARY),
        bonusPct: Math.max(0, Number(row.bonusPct) || 0),
      },
    ]),
  );
}

// Эвристика стартовых окладов (сомони TJS / мес) по ключевым словам в названии
function guessSalary(title: string): number {
  const t = title.toLowerCase();
  if (/(ceo|генеральный директор)/.test(t)) return 13000;
  if (/директор|главный инженер|главный бухгалтер|hr-директор/.test(t)) return 11000;
  if (/начальник|главный геолог|главный механик|главный эколог|главный обогатитель/.test(t))
    return 9000;
  if (/ведущий|зам|заместитель|мастер цеха|бригадир/.test(t)) return 7500;
  if (
    /инженер|геолог|маркшейдер|логист|аналитик|юрист|эколог|обогатитель|плавильщик|аффинаж/.test(t)
  )
    return 6500;
  if (/машинист|оператор экскаватора|оператор|электрик|сварщик|токарь|фрезеровщик|моторист/.test(t))
    return 5500;
  if (/водитель|слесарь|гидромониторщик|грохотовщик|доводчик|концентраторщик|лаборант/.test(t))
    return 4500;
  if (/охран|инспектор сб|пост|режим/.test(t)) return 4000;
  if (/повар|прачеч|фельдшер|кладовщик|кассир|секретарь|диспетчер|заправщик/.test(t)) return 3500;
  if (/разнорабочий|помощник/.test(t)) return 2000;
  return 5000;
}

function bonusGuess(title: string): number {
  const t = title.toLowerCase();
  if (/(машинист ппм|гидромониторщик|грохотовщик|плавильщик|аффинаж|драгметал)/.test(t)) return 25;
  if (/(вскрыша|добыча|самосвал|бульдозер|экскаватор)/.test(t)) return 20;
  if (/(охран|сб|режим|видеонаблюдения)/.test(t)) return 15;
  if (/(директор|главный|начальник)/.test(t)) return 20;
  return 10;
}

function fmt(n: number): string {
  return n.toLocaleString("ru-RU");
}

function keyFor(deptId: string, idx: number): string {
  return `${deptId}::${idx}`;
}

// Порядок отделов по иерархии (BFS) для штатного расписания
function hierarchicalDeptOrder(): string[] {
  const order: string[] = [];
  const visit = (n: HierarchyNode) => {
    for (const id of n.departmentIds) if (!order.includes(id)) order.push(id);
    if (n.children) for (const c of n.children) visit(c);
  };
  visit(hierarchyTree);
  for (const d of departments) if (!order.includes(d.id)) order.push(d.id);
  return order;
}

export function StaffingTable({ onSelectDept }: Props) {
  const [overrides, setOverrides] = useState<SalaryMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOverrides(normalizeSalaryMap(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      /* ignore */
    }
  }, [overrides]);

  const ordered = useMemo(() => {
    const order = hierarchicalDeptOrder();
    return order.map((id) => departments.find((d) => d.id === id)!).filter(Boolean);
  }, []);

  const getRow = (deptId: string, idx: number, title: string) => {
    const k = keyFor(deptId, idx);
    const def = { salary: clampSalary(guessSalary(title)), bonusPct: bonusGuess(title) };
    return overrides[k] ?? def;
  };

  const setRow = (
    deptId: string,
    idx: number,
    patch: Partial<{ salary: number; bonusPct: number }>,
  ) => {
    const k = keyFor(deptId, idx);
    setOverrides((prev) => {
      const cur = prev[k] ?? {
        salary: clampSalary(
          guessSalary(departments.find((d) => d.id === deptId)!.positions[idx].title),
        ),
        bonusPct: bonusGuess(departments.find((d) => d.id === deptId)!.positions[idx].title),
      };
      return { ...prev, [k]: { ...cur, ...patch } };
    });
  };

  const totals = useMemo(() => {
    let units = 0;
    let fund = 0;
    for (const d of ordered) {
      d.positions.forEach((p, i) => {
        const r = getRow(d.id, i, p.title);
        units += p.count;
        fund += p.count * Math.round(r.salary * (1 + r.bonusPct / 100));
      });
    }
    return { units, fund };
  }, [ordered, overrides]);

  const resetAll = () => {
    if (confirm("Сбросить все изменения окладов и надбавок к значениям по умолчанию?")) {
      setOverrides({});
    }
  };

  const exportCSV = () => {
    const rows: string[] = [];
    rows.push(
      ["Код", "Подразделение", "Должность", "Шт. ед.", "Оклад", "Надбавка %", "Месячный ФОТ"].join(
        ";",
      ),
    );
    for (const d of ordered) {
      d.positions.forEach((p, i) => {
        const r = getRow(d.id, i, p.title);
        const perPos = Math.round(r.salary * (1 + r.bonusPct / 100));
        const fund = perPos * p.count;
        rows.push(
          [d.id, `"${d.name}"`, `"${p.title}"`, p.count, r.salary, r.bonusPct, fund].join(";"),
        );
      });
    }
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shtatnoe-raspisanie-shugnov.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Штатное расписание</h2>
          <p className="mt-1 max-w-2xl text-xs text-zinc-600">
            Обезличенный документ, фиксирующий организационную структуру компании. Должности
            расположены иерархически — от руководителя к подчинённым, с указанием кода
            подразделения, штатных единиц, оклада и надбавки. Оклады ограничены диапазоном от 2 000
            до 13 000 TJS. Ячейки оклада и надбавки можно редактировать — данные сохраняются в этом
            браузере.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Экспорт CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
            className="border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Сбросить
          </Button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <SummaryCard label="Всего штатных единиц" value={`${totals.units} чел.`} />
        <SummaryCard label="Месячный ФОТ" value={`${fmt(totals.fund)} TJS`} />
        <SummaryCard label="Годовой ФОТ" value={`${fmt(totals.fund * 12)} TJS`} />
        <SummaryCard
          label="Средняя з/п (с надб.)"
          value={`${fmt(Math.round(totals.fund / Math.max(totals.units, 1)))} TJS`}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-[11px] uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-3 py-2 font-medium">Код</th>
              <th className="px-3 py-2 font-medium">Должность</th>
              <th className="px-3 py-2 font-medium text-right">Шт. ед.</th>
              <th className="px-3 py-2 font-medium text-right">Оклад, TJS</th>
              <th className="px-3 py-2 font-medium text-right">Надб., %</th>
              <th className="px-3 py-2 font-medium text-right">ФОТ / мес</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((d) => {
              const loc = getLocation(d.locationId);
              const deptUnits = d.positions.reduce((s, p) => s + p.count, 0);
              const deptFund = d.positions.reduce((s, p, i) => {
                const r = getRow(d.id, i, p.title);
                return s + p.count * Math.round(r.salary * (1 + r.bonusPct / 100));
              }, 0);
              return (
                <Fragment key={d.id}>
                  <tr
                    key={`h-${d.id}`}
                    className="border-t border-zinc-200 bg-zinc-50/70 cursor-pointer hover:bg-zinc-100"
                    onClick={() => onSelectDept(d.id)}
                  >
                    <td className="px-3 py-2 font-mono text-[11px] text-zinc-600">{d.id}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-zinc-900">{d.name}</span>
                        <Badge variant="outline" className={`${loc.badge} text-[10px]`}>
                          {loc.title.replace("Локация ", "Л.")}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-zinc-800">
                      {deptUnits}
                    </td>
                    <td className="px-3 py-2 text-right text-zinc-400">—</td>
                    <td className="px-3 py-2 text-right text-zinc-400">—</td>
                    <td className="px-3 py-2 text-right font-semibold text-yellow-700">
                      {fmt(deptFund)}
                    </td>
                  </tr>
                  {d.positions.map((p, i) => {
                    const r = getRow(d.id, i, p.title);
                    const perPos = Math.round(r.salary * (1 + r.bonusPct / 100));
                    const fund = perPos * p.count;
                    return (
                      <tr key={`${d.id}-${i}`} className="border-t border-zinc-100">
                        <td className="px-3 py-1.5 font-mono text-[10px] text-zinc-400">
                          {d.id}.{String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-3 py-1.5 text-zinc-800">{p.title}</td>
                        <td className="px-3 py-1.5 text-right text-zinc-700">{p.count}</td>
                        <td className="px-3 py-1.5 text-right">
                          <Input
                            type="number"
                            min={MIN_SALARY}
                            max={MAX_SALARY}
                            step={500}
                            value={r.salary}
                            onChange={(e) =>
                              setRow(d.id, i, {
                                salary: clampSalary(Number(e.target.value) || MIN_SALARY),
                              })
                            }
                            className="ml-auto h-7 w-28 text-right text-sm tabular-nums"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <Input
                            type="number"
                            min={0}
                            max={200}
                            step={5}
                            value={r.bonusPct}
                            onChange={(e) =>
                              setRow(d.id, i, {
                                bonusPct: Math.max(0, Number(e.target.value) || 0),
                              })
                            }
                            className="ml-auto h-7 w-20 text-right text-sm tabular-nums"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right tabular-nums text-zinc-800">
                          {fmt(fund)}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-zinc-300 bg-yellow-50/60">
              <td className="px-3 py-2 font-mono text-[11px] text-zinc-600">ИТОГО</td>
              <td className="px-3 py-2 font-semibold text-zinc-900">По компании</td>
              <td className="px-3 py-2 text-right font-semibold text-zinc-900">{totals.units}</td>
              <td className="px-3 py-2" />
              <td className="px-3 py-2" />
              <td className="px-3 py-2 text-right font-bold text-yellow-700">
                {fmt(totals.fund)} TJS
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900">{value}</div>
    </div>
  );
}
