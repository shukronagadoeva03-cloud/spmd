import { hierarchyTree, getDept, type HierarchyNode } from "@/data/orgStructure";

interface Props {
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}

type BoxTone = "ceo" | "cto" | "coo" | "cso" | "cro" | "cfo" | "chro";

const toneStyles: Record<BoxTone, { box: string; selected: string }> = {
  ceo: {
    box: "bg-[#bac8d3] border-[#23445d] text-zinc-900",
    selected: "ring-2 ring-yellow-500/60",
  },
  cto: {
    box: "bg-[#6d8764] border-[#3A5431] text-white",
    selected: "ring-2 ring-yellow-300",
  },
  coo: {
    box: "bg-[#e3c800] border-[#B09500] text-zinc-900",
    selected: "ring-2 ring-yellow-700",
  },
  cso: {
    box: "bg-[#eeeeee] border-zinc-400 text-zinc-900",
    selected: "ring-2 ring-zinc-700",
  },
  cro: {
    box: "bg-[#f4b183] border-[#b85d1e] text-zinc-900",
    selected: "ring-2 ring-orange-700",
  },
  cfo: {
    box: "bg-[#f8cecc] border-[#b85450] text-zinc-900",
    selected: "ring-2 ring-rose-700",
  },
  chro: {
    box: "bg-[#d0cee2] border-[#56517e] text-zinc-900",
    selected: "ring-2 ring-indigo-500",
  },
};

interface ChartNode {
  label: string;
  deptId: string;
  tone: BoxTone;
  positions?: Array<{ title: string; deptId: string; count: number }>;
}

function findNode(root: HierarchyNode, id: string): HierarchyNode | null {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

function collectDeptIds(node: HierarchyNode): string[] {
  const ids: string[] = [...node.departmentIds];
  for (const c of node.children ?? []) ids.push(...collectDeptIds(c));
  return Array.from(new Set(ids));
}

function buildChart(): { root: ChartNode; subordinates: ChartNode[] } {
  const root: ChartNode = {
    label: "CEO — Генеральный директор",
    deptId: hierarchyTree.leadDepartmentId ?? "ceo",
    tone: "ceo",
  };
  const mapping: Array<{ nodeId: string; label: string; tone: BoxTone; leadDept: string }> = [
    { nodeId: "tech", label: "CTO — Технический директор", tone: "cto", leadDept: "cto-office" },
    { nodeId: "operations", label: "COO — Операционный директор", tone: "coo", leadDept: "coo-office" },
    { nodeId: "infosec", label: "CSO — Директор по ИБ", tone: "cso", leadDept: "cso-office" },
    { nodeId: "commercial", label: "CRO — Коммерческий директор", tone: "cro", leadDept: "sales" },
    { nodeId: "finance", label: "CFO — Финансовый директор", tone: "cfo", leadDept: "finance" },
    { nodeId: "people", label: "CHRO — Директор по персоналу", tone: "chro", leadDept: "hr" },
  ];
  const subordinates = mapping.map(({ nodeId, label, tone, leadDept }) => {
    const node = findNode(hierarchyTree, nodeId);
    const allDeptIds = node ? collectDeptIds(node) : [leadDept];
    const positions = allDeptIds.flatMap((id) => {
      const d = getDept(id);
      if (!d) return [];
      const list = id === leadDept ? d.positions.slice(1) : d.positions;
      return list.map((p) => ({ title: p.title, deptId: id, count: p.count }));
    });
    return {
      label,
      deptId: leadDept,
      tone,
      positions,
    } as ChartNode;
  });
  return { root, subordinates };
}

function ChartBox({
  node,
  selected,
  onSelect,
  size = "md",
}: {
  node: ChartNode;
  selected: boolean;
  onSelect: (id: string) => void;
  size?: "md" | "lg";
}) {
  const tone = toneStyles[node.tone];
  return (
    <button
      onClick={() => onSelect(node.deptId)}
      className={`group relative w-full rounded-xl border-2 px-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${tone.box} ${
        selected ? tone.selected : ""
      } ${size === "lg" ? "py-4" : "py-3"}`}
    >
      <div
        className={`font-bold leading-tight text-center ${size === "lg" ? "text-base sm:text-lg" : "text-sm sm:text-[15px]"}`}
      >
        {node.label}
      </div>
    </button>
  );
}

export function HierarchyView({ onSelectDept, selectedDept }: Props) {
  const { root, subordinates } = buildChart();

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-white via-zinc-50 to-white p-4 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-zinc-900">
            Org chart: иерархия подчинения
          </h3>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Нажмите на блок, чтобы открыть карточку отдела с описанием и составом.
        </p>
      </div>

      {/* Top: CEO */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <ChartBox
            node={root}
            selected={selectedDept === root.deptId}
            onSelect={onSelectDept}
            size="lg"
          />
        </div>
      </div>

      {/* Vertical trunk */}
      <div className="mx-auto h-6 w-px bg-zinc-400" />

      {/* Horizontal bar across subordinates (desktop only) */}
      <div className="relative hidden md:block">
        <div className="absolute left-[10%] right-[10%] top-0 h-px bg-zinc-400" />
      </div>

      {/* Subordinate row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6 md:gap-3 md:pt-6">
        {subordinates.map((node) => {
          const toneColor = toneStyles[node.tone];
          return (
            <div key={node.label} className="flex flex-col items-stretch">
              {/* drop line into each box (desktop) */}
              <div className="mx-auto hidden h-6 w-px bg-zinc-400 md:block -mt-6" />
              <ChartBox
                node={node}
                selected={selectedDept === node.deptId}
                onSelect={onSelectDept}
              />
              {/* Positions tree */}
              {node.positions && node.positions.length > 0 && (
                <div className="relative mt-3 pl-5">
                  {/* vertical trunk */}
                  <div className="absolute left-2 top-0 bottom-3 w-px bg-zinc-300" />
                  <ul className="space-y-1.5">
                    {node.positions.map((p, i) => (
                      <li key={i} className="relative">
                        {/* horizontal stub */}
                        <div className="absolute -left-3 top-1/2 h-px w-3 bg-zinc-300" />
                        <button
                          onClick={() => onSelectDept(p.deptId)}
                          className={`flex w-full items-start justify-between gap-2 rounded-md border bg-white px-2 py-1.5 text-left text-[11px] leading-tight text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow ${
                            selectedDept === p.deptId
                              ? `${toneColor.selected} border-zinc-300`
                              : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <span className="flex-1">{p.title}</span>
                          <span className="shrink-0 rounded bg-zinc-100 px-1 font-mono text-[10px] text-zinc-500">
                            ×{p.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border border-zinc-200 bg-white/70 p-3 text-[11px] text-zinc-500">
        Полная детализация подразделений и должностей доступна во вкладках
        «По локациям», «По производственному циклу» и «Штатное расписание».
      </div>
    </div>
  );
}
