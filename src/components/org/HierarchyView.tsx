import { hierarchyTree, type HierarchyNode } from "@/data/orgStructure";

interface Props {
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}

type BoxTone = "ceo" | "engineering" | "processing" | "supply" | "security" | "admin";

const toneStyles: Record<BoxTone, { box: string; selected: string }> = {
  ceo: {
    box: "bg-[#bac8d3] border-[#23445d] text-zinc-900",
    selected: "ring-2 ring-yellow-500/60",
  },
  engineering: {
    box: "bg-[#6d8764] border-[#3A5431] text-white",
    selected: "ring-2 ring-yellow-300",
  },
  processing: {
    box: "bg-[#e3c800] border-[#B09500] text-zinc-900",
    selected: "ring-2 ring-yellow-700",
  },
  supply: {
    box: "bg-[#f8cecc] border-[#b85450] text-zinc-900",
    selected: "ring-2 ring-rose-700",
  },
  security: {
    box: "bg-[#eeeeee] border-zinc-400 text-zinc-900",
    selected: "ring-2 ring-zinc-700",
  },
  admin: {
    box: "bg-[#d0cee2] border-[#56517e] text-zinc-900",
    selected: "ring-2 ring-indigo-500",
  },
};

interface ChartNode {
  label: string;
  deptId: string;
  tone: BoxTone;
}

function findNode(root: HierarchyNode, id: string): HierarchyNode | null {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

function buildChart(): { root: ChartNode; subordinates: ChartNode[] } {
  const root: ChartNode = {
    label: "Генеральный директор",
    deptId: hierarchyTree.leadDepartmentId ?? "ceo",
    tone: "ceo",
  };
  const mapping: Array<{ nodeId: string; label: string; tone: BoxTone }> = [
    { nodeId: "engineering", label: "Главный инженер", tone: "engineering" },
    { nodeId: "processing", label: "Начальник ШОУ", tone: "processing" },
    { nodeId: "supply-chain", label: "Начальник отдела снабжения", tone: "supply" },
    { nodeId: "security", label: "Начальник службы безопасности", tone: "security" },
    { nodeId: "administration", label: "Зам. по общим вопросам", tone: "admin" },
  ];
  const subordinates = mapping.map(({ nodeId, label, tone }) => {
    const node = findNode(hierarchyTree, nodeId);
    return {
      label,
      deptId: node?.leadDepartmentId ?? node?.departmentIds[0] ?? "ceo",
      tone,
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-3 md:pt-6">
        {subordinates.map((node) => (
          <div key={node.label} className="flex flex-col items-center">
            {/* drop line into each box (desktop) */}
            <div className="hidden h-6 w-px bg-zinc-400 md:block -mt-6" />
            <ChartBox
              node={node}
              selected={selectedDept === node.deptId}
              onSelect={onSelectDept}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-zinc-200 bg-white/70 p-3 text-[11px] text-zinc-500">
        Полная детализация подразделений и должностей доступна во вкладках
        «По локациям», «По производственному циклу» и «Штатное расписание».
      </div>
    </div>
  );
}
