import { GitFork, MapPin, ShieldCheck, Users, Workflow } from "lucide-react";
import {
  departments,
  getLocation,
  getStage,
  getSupportTrack,
  hierarchyTree,
  type Department,
  type HierarchyColorKey,
  type HierarchyNode,
} from "@/data/orgStructure";

interface Props {
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}

interface HierarchyColorClasses {
  shell: string;
  header: string;
  pill: string;
  connector: string;
  chipAccent: string;
}

const hierarchyColors: Record<HierarchyColorKey, HierarchyColorClasses> = {
  executive: {
    shell: "border-yellow-500/40 bg-yellow-50/80 ring-yellow-500/20",
    header: "border-yellow-500/50 bg-gradient-to-br from-yellow-400 to-amber-600 text-white",
    pill: "border-yellow-500/30 bg-yellow-500/10 text-yellow-900",
    connector: "bg-yellow-400",
    chipAccent: "border-l-yellow-500",
  },
  engineering: {
    shell: "border-blue-500/30 bg-blue-50/70 ring-blue-500/15",
    header: "border-blue-500/40 bg-gradient-to-br from-blue-500 to-indigo-700 text-white",
    pill: "border-blue-500/30 bg-blue-500/10 text-blue-900",
    connector: "bg-blue-400",
    chipAccent: "border-l-blue-500",
  },
  processing: {
    shell: "border-amber-500/30 bg-amber-50/70 ring-amber-500/15",
    header: "border-amber-500/40 bg-gradient-to-br from-yellow-500 to-orange-700 text-white",
    pill: "border-amber-500/30 bg-amber-500/10 text-amber-900",
    connector: "bg-amber-400",
    chipAccent: "border-l-amber-500",
  },
  field: {
    shell: "border-teal-500/30 bg-teal-50/70 ring-teal-500/15",
    header: "border-teal-500/40 bg-gradient-to-br from-teal-500 to-emerald-700 text-white",
    pill: "border-teal-500/30 bg-teal-500/10 text-teal-900",
    connector: "bg-teal-400",
    chipAccent: "border-l-teal-500",
  },
  water: {
    shell: "border-sky-500/30 bg-sky-50/70 ring-sky-500/15",
    header: "border-sky-500/40 bg-gradient-to-br from-sky-500 to-cyan-700 text-white",
    pill: "border-sky-500/30 bg-sky-500/10 text-sky-900",
    connector: "bg-sky-400",
    chipAccent: "border-l-sky-500",
  },
  maintenance: {
    shell: "border-orange-500/30 bg-orange-50/70 ring-orange-500/15",
    header: "border-orange-500/40 bg-gradient-to-br from-orange-500 to-red-700 text-white",
    pill: "border-orange-500/30 bg-orange-500/10 text-orange-900",
    connector: "bg-orange-400",
    chipAccent: "border-l-orange-500",
  },
  supply: {
    shell: "border-rose-500/30 bg-rose-50/70 ring-rose-500/15",
    header: "border-rose-500/40 bg-gradient-to-br from-rose-500 to-pink-700 text-white",
    pill: "border-rose-500/30 bg-rose-500/10 text-rose-900",
    connector: "bg-rose-400",
    chipAccent: "border-l-rose-500",
  },
  security: {
    shell: "border-red-500/30 bg-red-50/70 ring-red-500/15",
    header: "border-red-500/40 bg-gradient-to-br from-red-500 to-red-800 text-white",
    pill: "border-red-500/30 bg-red-500/10 text-red-900",
    connector: "bg-red-400",
    chipAccent: "border-l-red-500",
  },
  ecology: {
    shell: "border-lime-500/30 bg-lime-50/70 ring-lime-500/15",
    header: "border-lime-500/40 bg-gradient-to-br from-lime-500 to-emerald-700 text-white",
    pill: "border-lime-500/30 bg-lime-500/10 text-lime-900",
    connector: "bg-lime-400",
    chipAccent: "border-l-lime-500",
  },
  admin: {
    shell: "border-zinc-300 bg-zinc-50/80 ring-zinc-300/40",
    header: "border-zinc-400 bg-gradient-to-br from-zinc-600 to-zinc-800 text-white",
    pill: "border-zinc-300 bg-zinc-100 text-zinc-800",
    connector: "bg-zinc-400",
    chipAccent: "border-l-zinc-500",
  },
};

const legendItems: Array<{ colorKey: HierarchyColorKey; label: string }> = [
  { colorKey: "executive", label: "Руководство" },
  { colorKey: "engineering", label: "Инженерия" },
  { colorKey: "field", label: "Горные участки" },
  { colorKey: "water", label: "Вода / транспорт" },
  { colorKey: "maintenance", label: "Ремонт" },
  { colorKey: "ecology", label: "Геология / экология" },
  { colorKey: "processing", label: "ШОУ / металл" },
  { colorKey: "supply", label: "Снабжение" },
  { colorKey: "security", label: "СБ" },
  { colorKey: "admin", label: "Администрация" },
];

const departmentById = new Map(departments.map((dept) => [dept.id, dept]));

export function HierarchyView({ onSelectDept, selectedDept }: Props) {
  const rootDepartments = resolveDepartments(hierarchyTree.departmentIds);
  const rootTotal = countNodePeople(hierarchyTree);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-white via-zinc-50 to-white p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-zinc-900">
              Org chart: иерархия подчинения от директора до участков
            </h3>
          </div>
          <p className="mt-1 max-w-3xl text-xs text-zinc-500">
            Цвет большой карточки показывает линию подчинения, а бейджи внутри отдела сохраняют
            связь с вкладками «По локациям» и «По производственному циклу».
          </p>
        </div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-900">
          <div className="font-semibold">Всего в структуре</div>
          <div>
            {rootTotal} чел. · {departments.length} отдел.
          </div>
        </div>
      </div>

      <HierarchyLegend />

      <div className="mt-6 flex justify-center">
        <div
          className={`w-full max-w-xl rounded-2xl border p-3 shadow-sm ring-1 ${hierarchyColors.executive.shell}`}
        >
          <NodeHeader
            node={hierarchyTree}
            people={rootTotal}
            departmentsCount={departments.length}
            onSelectDept={onSelectDept}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {rootDepartments.map((dept) => (
              <DepartmentChip
                key={dept.id}
                dept={dept}
                colorKey={hierarchyTree.colorKey}
                selected={selectedDept === dept.id}
                onSelectDept={onSelectDept}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-2 pt-10 lg:pt-12">
        <div className="absolute left-1/2 top-0 hidden h-8 w-px -translate-x-1/2 bg-yellow-400 lg:block" />
        <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-zinc-300 lg:block" />
        <div className="absolute bottom-0 left-4 top-0 w-px bg-zinc-200 lg:hidden" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:items-start">
          {hierarchyTree.children?.map((node) => (
            <DirectorateCard
              key={node.id}
              node={node}
              onSelectDept={onSelectDept}
              selectedDept={selectedDept}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HierarchyLegend() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white/80 p-3 shadow-sm">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        Цветовое кодирование линий подчинения
      </div>
      <div className="flex flex-wrap gap-2">
        {legendItems.map((item) => {
          const colors = hierarchyColors[item.colorKey];
          return (
            <div
              key={item.colorKey}
              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] ${colors.pill}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${colors.connector}`} />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DirectorateCard({
  node,
  onSelectDept,
  selectedDept,
}: {
  node: HierarchyNode;
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}) {
  const nodeDepartments = resolveDepartments(node.departmentIds);
  const people = countNodePeople(node);
  const deptCount = countNodeDepartments(node);
  const colors = hierarchyColors[node.colorKey];

  return (
    <section className={`relative rounded-2xl border p-3 shadow-sm ring-1 ${colors.shell}`}>
      <div className="absolute -top-10 left-1/2 hidden h-10 w-px -translate-x-1/2 bg-zinc-300 lg:block" />
      <div className="absolute -left-5 top-8 h-px w-5 bg-zinc-200 lg:hidden" />
      <NodeHeader
        node={node}
        people={people}
        departmentsCount={deptCount}
        onSelectDept={onSelectDept}
      />
      <div className="mt-3 space-y-2">
        {nodeDepartments.map((dept) => (
          <DepartmentChip
            key={dept.id}
            dept={dept}
            colorKey={node.colorKey}
            selected={selectedDept === dept.id}
            onSelectDept={onSelectDept}
          />
        ))}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="relative mt-4 border-t border-zinc-200 pt-4">
          <div className="absolute left-4 top-0 h-full w-px bg-zinc-200" />
          <div className="relative mb-2 ml-7 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500">
            <GitFork className="h-3 w-3" /> Подчинённые службы
          </div>
          <div className="space-y-3 pl-7">
            {node.children.map((child) => (
              <SubordinateGroup
                key={child.id}
                node={child}
                onSelectDept={onSelectDept}
                selectedDept={selectedDept}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function SubordinateGroup({
  node,
  onSelectDept,
  selectedDept,
}: {
  node: HierarchyNode;
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}) {
  const nodeDepartments = resolveDepartments(node.departmentIds);
  const people = countNodePeople(node);
  const colors = hierarchyColors[node.colorKey];

  return (
    <div className={`relative rounded-xl border p-2 shadow-sm ring-1 ${colors.shell}`}>
      <div className="absolute -left-7 top-5 h-px w-7 bg-zinc-200" />
      <NodeHeader
        node={node}
        people={people}
        departmentsCount={nodeDepartments.length}
        compact
        onSelectDept={onSelectDept}
      />
      <div className="mt-2 space-y-1.5">
        {nodeDepartments.map((dept) => (
          <DepartmentChip
            key={dept.id}
            dept={dept}
            colorKey={node.colorKey}
            selected={selectedDept === dept.id}
            onSelectDept={onSelectDept}
          />
        ))}
      </div>
    </div>
  );
}

function NodeHeader({
  node,
  people,
  departmentsCount,
  compact = false,
  onSelectDept,
}: {
  node: HierarchyNode;
  people: number;
  departmentsCount: number;
  compact?: boolean;
  onSelectDept: (id: string) => void;
}) {
  const colors = hierarchyColors[node.colorKey];
  const leadDepartment = node.leadDepartmentId ? departmentById.get(node.leadDepartmentId) : null;

  return (
    <div className={`rounded-xl border px-3 py-2 shadow-sm ${colors.header}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div
            className={`${compact ? "text-[11px]" : "text-xs"} font-medium uppercase tracking-wide text-white/75`}
          >
            {node.title}
          </div>
          {node.leadTitle && leadDepartment ? (
            <button
              onClick={() => onSelectDept(leadDepartment.id)}
              className={`${compact ? "text-xs" : "text-sm"} mt-0.5 block text-left font-semibold leading-tight underline-offset-2 hover:underline`}
            >
              {node.leadTitle}
            </button>
          ) : (
            <div
              className={`${compact ? "text-xs" : "text-sm"} mt-0.5 font-semibold leading-tight`}
            >
              {node.leadTitle ?? node.title}
            </div>
          )}
          <div className="mt-1 text-[11px] leading-snug text-white/80">{node.subtitle}</div>
        </div>
        <span className="shrink-0 rounded-md bg-white/20 px-2 py-0.5 text-[10px] text-white ring-1 ring-white/30">
          {people} чел.
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-white/80">
        <span className="rounded bg-white/15 px-1.5 py-0.5 ring-1 ring-white/20">
          {departmentsCount} отдел.
        </span>
        {node.leadTitle && (
          <span className="rounded bg-white/15 px-1.5 py-0.5 ring-1 ring-white/20">
            Руководитель
          </span>
        )}
      </div>
    </div>
  );
}

function DepartmentChip({
  dept,
  colorKey,
  selected,
  onSelectDept,
}: {
  dept: Department;
  colorKey: HierarchyColorKey;
  selected: boolean;
  onSelectDept: (id: string) => void;
}) {
  const loc = getLocation(dept.locationId);
  const stage = dept.cycleStageId ? getStage(dept.cycleStageId) : null;
  const support = dept.supportTrackId ? getSupportTrack(dept.supportTrackId) : null;
  const total = dept.positions.reduce((sum, position) => sum + position.count, 0);
  const colors = hierarchyColors[colorKey];

  return (
    <button
      onClick={() => onSelectDept(dept.id)}
      className={`w-full rounded-lg border border-l-4 px-2.5 py-2 text-left text-[11px] shadow-sm transition ${colors.chipAccent} ${
        selected
          ? "border-yellow-500/70 bg-yellow-500/10 text-yellow-900 ring-2 ring-yellow-500/30"
          : "border-zinc-200 bg-white/90 text-zinc-800 hover:bg-white hover:shadow"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium leading-tight">{dept.name}</span>
        <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">
          ×{total}
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        <span
          className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] ${loc.badge}`}
        >
          <MapPin className="h-3 w-3" /> {loc.title.replace("Локация ", "Л.")}
        </span>
        {stage ? (
          <span className="inline-flex items-center gap-1 rounded border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 text-[10px] text-yellow-800">
            <Workflow className="h-3 w-3" /> {stage.title}
          </span>
        ) : support ? (
          <span
            className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] ${support.color}`}
          >
            <ShieldCheck className="h-3 w-3" /> {support.title}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-500">
          <Users className="h-3 w-3" /> {dept.positions.length} поз.
        </span>
      </div>
    </button>
  );
}

function resolveDepartments(ids: string[]): Department[] {
  return ids
    .map((id) => departmentById.get(id))
    .filter((dept): dept is Department => Boolean(dept));
}

function countNodePeople(node: HierarchyNode): number {
  const ownPeople = resolveDepartments(node.departmentIds).reduce(
    (sum, dept) => sum + dept.positions.reduce((deptSum, position) => deptSum + position.count, 0),
    0,
  );
  return ownPeople + (node.children?.reduce((sum, child) => sum + countNodePeople(child), 0) ?? 0);
}

function countNodeDepartments(node: HierarchyNode): number {
  return (
    node.departmentIds.length +
    (node.children?.reduce((sum, child) => sum + countNodeDepartments(child), 0) ?? 0)
  );
}
