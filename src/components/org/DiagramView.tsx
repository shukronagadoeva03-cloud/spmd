import { hierarchyTree, getDept } from "@/data/orgStructure";

// Простая SVG-оргсхема: CEO → 6 C-level, под каждым — список ключевых подразделений.
export function DiagramView() {
  const root = hierarchyTree;
  const children = root.children ?? [];

  // sizes
  const W = 1300;
  const H = 760;
  const ceoBox = { x: W / 2 - 150, y: 30, w: 300, h: 60 };
  const colW = W / children.length;

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <div className="p-4 border-b border-zinc-200">
        <h2 className="text-lg font-semibold text-zinc-900">Оргсхема NETS</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Классическая блок-схема с явными линиями подчинения: CEO → 6 C-level → ключевые подразделения.
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="block min-w-[900px] w-full h-auto">
          {/* CEO */}
          <g>
            <rect
              x={ceoBox.x}
              y={ceoBox.y}
              width={ceoBox.w}
              height={ceoBox.h}
              rx={10}
              fill="#bac8d3"
              stroke="#23445d"
              strokeWidth={2}
            />
            <text
              x={ceoBox.x + ceoBox.w / 2}
              y={ceoBox.y + ceoBox.h / 2 + 5}
              textAnchor="middle"
              fontSize={18}
              fontWeight={700}
              fill="#0f172a"
            >
              CEO — Генеральный директор
            </text>
          </g>

          {/* Horizontal trunk */}
          <line
            x1={ceoBox.x + ceoBox.w / 2}
            y1={ceoBox.y + ceoBox.h}
            x2={ceoBox.x + ceoBox.w / 2}
            y2={130}
            stroke="#64748b"
            strokeWidth={2}
          />
          <line
            x1={colW / 2}
            y1={130}
            x2={W - colW / 2}
            y2={130}
            stroke="#64748b"
            strokeWidth={2}
          />

          {children.map((c, i) => {
            const cx = colW * i + colW / 2;
            const cBox = { x: cx - 110, y: 150, w: 220, h: 56 };
            const tone = TONE[i % TONE.length];
            const ledDept = c.leadDepartmentId ? getDept(c.leadDepartmentId) : null;
            const childDepts = collectChildDepts(c);
            return (
              <g key={c.id}>
                {/* drop line */}
                <line x1={cx} y1={130} x2={cx} y2={cBox.y} stroke="#64748b" strokeWidth={2} />

                {/* C-level box */}
                <rect
                  x={cBox.x}
                  y={cBox.y}
                  width={cBox.w}
                  height={cBox.h}
                  rx={8}
                  fill={tone.fill}
                  stroke={tone.stroke}
                  strokeWidth={2}
                />
                <text
                  x={cx}
                  y={cBox.y + 22}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={700}
                  fill={tone.text}
                >
                  {shortLead(c.leadTitle ?? c.title)}
                </text>
                <text
                  x={cx}
                  y={cBox.y + 40}
                  textAnchor="middle"
                  fontSize={11}
                  fill={tone.text}
                  opacity={0.85}
                >
                  {ledDept ? ledDept.name : c.title}
                </text>

                {/* trunk to children */}
                <line
                  x1={cx}
                  y1={cBox.y + cBox.h}
                  x2={cx}
                  y2={cBox.y + cBox.h + 28}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                />

                {/* department list */}
                {childDepts.map((d, j) => {
                  const dy = cBox.y + cBox.h + 28 + j * 46;
                  return (
                    <g key={d.id}>
                      <line
                        x1={cx}
                        y1={dy + 18}
                        x2={cx - 90}
                        y2={dy + 18}
                        stroke="#cbd5e1"
                        strokeWidth={1.2}
                      />
                      <rect
                        x={cx - 95}
                        y={dy}
                        width={190}
                        height={36}
                        rx={6}
                        fill="#f1f5f9"
                        stroke="#cbd5e1"
                        strokeWidth={1}
                      />
                      <text
                        x={cx}
                        y={dy + 16}
                        textAnchor="middle"
                        fontSize={10.5}
                        fill="#0f172a"
                        fontWeight={600}
                      >
                        {truncate(d.name, 30)}
                      </text>
                      <text
                        x={cx}
                        y={dy + 29}
                        textAnchor="middle"
                        fontSize={9.5}
                        fill="#64748b"
                      >
                        {d.positions.reduce((s, p) => s + p.count, 0)} чел.
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

const TONE = [
  { fill: "#dcfce7", stroke: "#15803d", text: "#0f172a" }, // CTO
  { fill: "#fef3c7", stroke: "#b45309", text: "#0f172a" }, // COO
  { fill: "#e5e7eb", stroke: "#475569", text: "#0f172a" }, // CSO
  { fill: "#ffedd5", stroke: "#c2410c", text: "#0f172a" }, // CRO
  { fill: "#fee2e2", stroke: "#b91c1c", text: "#0f172a" }, // CFO
  { fill: "#ede9fe", stroke: "#5b21b6", text: "#0f172a" }, // CHRO
];

function shortLead(s: string): string {
  // "CTO — Технический директор" → "CTO"
  const idx = s.indexOf("—");
  if (idx > 0) return s.slice(0, idx).trim();
  return s;
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function collectChildDepts(node: { departmentIds: string[]; children?: { departmentIds: string[] }[] }) {
  const ids = new Set<string>();
  for (const c of node.children ?? []) for (const id of c.departmentIds) ids.add(id);
  if (ids.size === 0) for (const id of node.departmentIds) ids.add(id);
  return Array.from(ids)
    .map((id) => getDept(id))
    .filter((d): d is NonNullable<ReturnType<typeof getDept>> => !!d)
    .slice(0, 8);
}
