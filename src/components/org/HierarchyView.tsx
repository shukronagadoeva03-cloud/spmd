import { GitFork, MapPin, ShieldCheck, Users, Workflow } from "lucide-react";
import {
  departments,
  getLocation,
  getStage,
  getSupportTrack,
  hierarchyTree,
  type Department,
  type HierarchyNode,
} from "@/data/orgStructure";

interface Props {
  onSelectDept: (id: string) => void;
  selectedDept: string | null;
}

const departmentById = new Map(departments.map((dept) => [dept.id, dept]));

export function HierarchyView({ onSelectDept, selectedDept }: Props) {
  const rootDepartments = resolveDepartments(hierarchyTree.departmentIds);
  const rootTotal = countNodePeople(hierarchyTree);

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-gradient-to-b from-white via-zinc-50 to-white p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-zinc-900">
              Иерархия подчинения: от директора до участков
            </h3>
          </div>
          <p className="mt-1 max-w-3xl text-xs text-zinc-500">
            Каждый отдел показан тем же штатным составом, локацией и производственной ролью, что и
            во вкладках «По локациям» и «По производственному циклу».
          </p>
        </div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-900">
          <div className="font-semibold">Всего в структуре</div>
          <div>
            {rootTotal} чел. · {departments.length} отдел.
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-xl rounded-2xl border border-yellow-500/40 bg-white p-3 shadow-sm ring-1 ring-yellow-500/20">
          <NodeHeader
            node={hierarchyTree}
            people={rootTotal}
            departmentsCount={departments.length}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {rootDepartments.map((dept) => (
              <DepartmentChip
                key={dept.id}
                dept={dept}
                selected={selectedDept === dept.id}
                onSelectDept={onSelectDept}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto h-8 w-px bg-gradient-to-b from-yellow-400 to-zinc-300" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
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

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-sm">
      <NodeHeader node={node} people={people} departmentsCount={deptCount} />
      <div className="mt-3 space-y-2">
        {nodeDepartments.map((dept) => (
          <DepartmentChip
            key={dept.id}
            dept={dept}
            selected={selectedDept === dept.id}
            onSelectDept={onSelectDept}
          />
        ))}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="mt-3 border-t border-zinc-200 pt-3">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500">
            <GitFork className="h-3 w-3" /> Подчинённые службы
          </div>
          <div className="space-y-3">
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

  return (
    <div className="relative rounded-xl border border-zinc-200 bg-zinc-50/70 p-2">
      <div className="absolute -left-3 top-4 h-px w-3 bg-zinc-300" />
      <NodeHeader node={node} people={people} departmentsCount={nodeDepartments.length} compact />
      <div className="mt-2 space-y-1.5">
        {nodeDepartments.map((dept) => (
          <DepartmentChip
            key={dept.id}
            dept={dept}
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
}: {
  node: HierarchyNode;
  people: number;
  departmentsCount: number;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${node.accent}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className={`${compact ? "text-xs" : "text-sm"} font-semibold leading-tight`}>
            {node.title}
          </div>
          <div className="mt-0.5 text-[11px] leading-snug opacity-80">{node.subtitle}</div>
        </div>
        <span className="shrink-0 rounded-md bg-white/70 px-2 py-0.5 text-[10px] text-zinc-700">
          {people} чел.
        </span>
      </div>
      <div className="mt-1 text-[10px] opacity-70">{departmentsCount} отдел.</div>
    </div>
  );
}

function DepartmentChip({
  dept,
  selected,
  onSelectDept,
}: {
  dept: Department;
  selected: boolean;
  onSelectDept: (id: string) => void;
}) {
  const loc = getLocation(dept.locationId);
  const stage = dept.cycleStageId ? getStage(dept.cycleStageId) : null;
  const support = dept.supportTrackId ? getSupportTrack(dept.supportTrackId) : null;
  const total = dept.positions.reduce((sum, position) => sum + position.count, 0);

  return (
    <button
      onClick={() => onSelectDept(dept.id)}
      className={`w-full rounded-lg border px-2.5 py-2 text-left text-[11px] transition ${
        selected
          ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-900"
          : "border-zinc-200 bg-white/80 text-zinc-800 hover:bg-zinc-50"
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
