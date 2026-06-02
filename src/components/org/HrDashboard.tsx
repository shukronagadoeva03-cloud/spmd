import { useMemo, useState } from "react";
import {
  departments,
  locations,
  cycleStages,
  supportTracks,
  getLocation,
  type LocationId,
} from "@/data/orgStructure";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Treemap,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Users,
  TrendingUp,
  UserCheck,
  Briefcase,
  Layers,
  PieChart as PieIcon,
  BarChart3,
  MapPinned,
} from "lucide-react";

type DashKind = "overview" | "workforce";

const PALETTE = [
  "#eab308", // gold
  "#f59e0b",
  "#d97706",
  "#10b981",
  "#14b8a6",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ef4444",
  "#84cc16",
];

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

// --------- derived metrics (pure) ---------

function useMetrics() {
  return useMemo(() => {
    const total = departments.reduce(
      (s, d) => s + d.positions.reduce((ss, p) => ss + p.count, 0),
      0,
    );
    const deptCount = departments.length;
    const uniquePositions = new Set(departments.flatMap((d) => d.positions.map((p) => p.title)))
      .size;

    // Управленческие должности (rough heuristic)
    const leadRe = /(директор|начальник|главный|зам|заместитель|бригадир|мастер|старший)/i;
    const leads = departments.reduce(
      (s, d) =>
        s +
        d.positions.reduce((ss, p) => ss + (leadRe.test(p.title) ? p.count : 0), 0),
      0,
    );

    const byLocation = locations.map((l, i) => {
      const count = departments
        .filter((d) => d.locationId === l.id)
        .reduce((s, d) => s + d.positions.reduce((ss, p) => ss + p.count, 0), 0);
      return {
        id: l.id,
        name: l.title.replace("Локация ", "Л."),
        full: l.title,
        value: count,
        fill: PALETTE[i % PALETTE.length],
      };
    });

    const byStage = cycleStages.map((s, i) => {
      const count = departments
        .filter((d) => d.cycleStageId === s.id)
        .reduce((sum, d) => sum + d.positions.reduce((ss, p) => ss + p.count, 0), 0);
      return { name: s.title, value: count, fill: PALETTE[i % PALETTE.length] };
    });

    const bySupport = supportTracks.map((t, i) => {
      const count = departments
        .filter((d) => d.supportTrackId === t.id)
        .reduce((sum, d) => sum + d.positions.reduce((ss, p) => ss + p.count, 0), 0);
      return { name: t.title, value: count, fill: PALETTE[(i + 3) % PALETTE.length] };
    });

    // Top-10 крупнейших отделов
    const topDepts = [...departments]
      .map((d) => ({
        name: d.name,
        value: d.positions.reduce((s, p) => s + p.count, 0),
        locationId: d.locationId as LocationId,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map((d, i) => ({ ...d, fill: PALETTE[i % PALETTE.length] }));

    // Категории должностей
    const categories = [
      { name: "Руководители", re: /(директор|начальник|главный|зам|заместитель)/i },
      { name: "Мастера / бригадиры", re: /(мастер|бригадир|старший)/i },
      { name: "Инженеры / специалисты", re: /(инженер|геолог|маркшейдер|логист|аналитик|юрист|эколог|обогатитель|химик|плавильщик|аффинаж|экономист)/i },
      { name: "Операторы техники", re: /(машинист|оператор|водитель|гидромониторщик|грохотовщик)/i },
      { name: "Слесари / ремонт", re: /(слесар|сварщик|токарь|фрезеровщик|моторист|электрик|механик)/i },
      { name: "Охрана / СБ", re: /(охран|инспектор сб|режим|видеонаблюдения|быстрого реагирования|сб\b)/i },
      { name: "Лаборатория / доводка", re: /(лаборант|доводчик|концентраторщик|магнитной)/i },
      { name: "АХЧ / сервис", re: /(повар|прачеч|фельдшер|кладовщик|кассир|секретарь|диспетчер|заправщик|дизелист|заведующий)/i },
    ];
    const allPositions = departments.flatMap((d) =>
      d.positions.map((p) => ({ title: p.title, count: p.count })),
    );
    let assigned = 0;
    const catData = categories.map((c, i) => {
      const value = allPositions
        .filter((p) => c.re.test(p.title))
        .reduce((s, p) => s + p.count, 0);
      assigned += value;
      return { name: c.name, value, fill: PALETTE[i % PALETTE.length] };
    });
    const other = Math.max(0, total - assigned);
    if (other > 0) catData.push({ name: "Прочие рабочие", value: other, fill: "#71717a" });

    // Соотношение производство vs поддержка
    const production = departments
      .filter((d) => d.cycleStageId)
      .reduce((s, d) => s + d.positions.reduce((ss, p) => ss + p.count, 0), 0);
    const support = total - production;

    // Заполненность штата (демо — стабильный псевдослучайный процент)
    const fillRates = departments.map((d, i) => {
      const head = d.positions.reduce((s, p) => s + p.count, 0);
      const seed = (d.id.length * 37 + i * 13) % 18; // 0..17
      const rate = 100 - seed; // 82..100
      return { name: d.name, value: rate, head };
    });
    const avgFill = Math.round(fillRates.reduce((s, x) => s + x.value, 0) / fillRates.length);

    return {
      total,
      deptCount,
      uniquePositions,
      leads,
      byLocation,
      byStage: byStage.filter((s) => s.value > 0),
      bySupport: bySupport.filter((s) => s.value > 0),
      topDepts,
      catData,
      production,
      support,
      fillRates,
      avgFill,
    };
  }, []);
}

// --------- UI atoms ---------

function KpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  hint,
  accent = "from-yellow-400 to-amber-600",
}: {
  icon: typeof Users;
  label: string;
  value: string;
  suffix?: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl`}
      />
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span
          className={`bg-gradient-to-br ${accent} bg-clip-text text-3xl font-bold tabular-nums text-transparent`}
        >
          {value}
        </span>
        {suffix && <span className="text-xs text-zinc-500">{suffix}</span>}
      </div>
      {hint && <div className="mt-1 text-[11px] text-zinc-500">{hint}</div>}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon?: typeof Users;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            {Icon && <Icon className="h-4 w-4 text-yellow-600" />}
            {title}
          </div>
          {subtitle && <div className="mt-0.5 text-[11px] text-zinc-500">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  background: "white",
  border: "1px solid #e4e4e7",
  borderRadius: 8,
  fontSize: 12,
  color: "#18181b",
};

// --------- Dashboards ---------

function OverviewDashboard() {
  const m = useMetrics();
  const prodVsSupport = [
    { name: "Производство", value: m.production, fill: "#eab308" },
    { name: "Поддержка", value: m.support, fill: "#0ea5e9" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Users}
          label="Общая численность"
          value={fmt(m.total)}
          suffix="чел."
          hint={`${m.deptCount} подразделений`}
        />
        <KpiCard
          icon={Briefcase}
          label="Уникальных должностей"
          value={fmt(m.uniquePositions)}
          suffix="наим."
          accent="from-emerald-400 to-teal-600"
          hint="по штатному расписанию"
        />
        <KpiCard
          icon={UserCheck}
          label="Руководящий состав"
          value={fmt(m.leads)}
          suffix="чел."
          accent="from-sky-400 to-indigo-600"
          hint={`${Math.round((m.leads / m.total) * 100)}% от штата`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Средняя заполненность"
          value={`${m.avgFill}`}
          suffix="%"
          accent="from-rose-400 to-orange-600"
          hint="по всем отделам"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Численность по локациям"
          subtitle="Где физически работают сотрудники"
          icon={MapPinned}
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.byLocation} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#52525b" }}
                  axisLine={{ stroke: "#e4e4e7" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#52525b" }} axisLine={{ stroke: "#e4e4e7" }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => [`${v} чел.`, "Сотрудники"]}
                  labelFormatter={(_, p) =>
                    (p && p[0]?.payload?.full) || ""
                  }
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#gold)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Производство vs поддержка"
          subtitle="Линейный персонал и обеспечение"
          icon={PieIcon}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prodVsSupport}
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={3}
                >
                  {prodVsSupport.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number, n) => [`${v} чел.`, n as string]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 text-center text-xs text-zinc-500">
            {Math.round((m.production / m.total) * 100)}% / {Math.round((m.support / m.total) * 100)}
            %
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Структура цикла производства"
          subtitle="Сотрудники по этапам полного цикла"
          icon={Layers}
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={m.byStage}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#52525b" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fontSize: 11, fill: "#3f3f46" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => [`${v} чел.`, "Сотрудники"]}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {m.byStage.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Сервисные треки" subtitle="Обеспечивающие службы" icon={BarChart3}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="25%"
                outerRadius="100%"
                data={m.bySupport}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  background={{ fill: "#f4f4f5" }}
                  cornerRadius={6}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number, n) => [`${v} чел.`, n as string]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-1 space-y-1">
            {m.bySupport.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between text-[11px] text-zinc-600"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: s.fill }}
                  />
                  {s.name}
                </span>
                <span className="tabular-nums text-zinc-800">{s.value}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function WorkforceDashboard() {
  const m = useMetrics();

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Users}
          label="Линейный персонал"
          value={fmt(m.production)}
          suffix="чел."
          accent="from-emerald-400 to-teal-600"
          hint="на производственном цикле"
        />
        <KpiCard
          icon={Briefcase}
          label="Обеспечение"
          value={fmt(m.support)}
          suffix="чел."
          accent="from-sky-400 to-indigo-600"
          hint="сервис, охрана, АХЧ, HR"
        />
        <KpiCard
          icon={UserCheck}
          label="Управленцев на 100 чел."
          value={`${Math.round((m.leads / m.total) * 100)}`}
          accent="from-rose-400 to-orange-600"
          hint="плотность руководства"
        />
        <KpiCard
          icon={TrendingUp}
          label="Средняя укомпл."
          value={`${m.avgFill}`}
          suffix="%"
          hint="по штатному расписанию"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Топ-10 крупнейших подразделений"
          subtitle="Где сосредоточена основная численность"
          icon={BarChart3}
          className="lg:col-span-2"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={m.topDepts}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#52525b" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={210}
                  tick={{ fontSize: 11, fill: "#3f3f46" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number, _n, p) => [
                    `${v} чел.`,
                    getLocation((p?.payload as { locationId: LocationId }).locationId).title,
                  ]}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {m.topDepts.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Категории должностей"
          subtitle="Профессиональный срез штата"
          icon={PieIcon}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={m.catData}
                dataKey="value"
                stroke="white"
                content={(props: unknown) => {
                  const p = props as {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                    name?: string;
                    value?: number;
                    payload?: { fill?: string };
                  };
                  const { x, y, width, height, name, value, payload } = p;
                  const fill = payload?.fill || "#eab308";
                  return (
                    <g>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        style={{ fill, stroke: "white", strokeWidth: 2 }}
                      />
                      {width > 70 && height > 40 && (
                        <>
                          <text
                            x={x + 8}
                            y={y + 18}
                            fill="white"
                            fontSize={11}
                            fontWeight={600}
                          >
                            {name}
                          </text>
                          <text x={x + 8} y={y + 34} fill="white" fontSize={14} fontWeight={700}>
                            {value}
                          </text>
                        </>
                      )}
                    </g>
                  );
                }}
              />
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Укомплектованность подразделений"
        subtitle="% от планового штата (демо-данные)"
        icon={UserCheck}
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {m.fillRates.map((r) => {
            const color =
              r.value >= 95
                ? "from-emerald-400 to-emerald-600"
                : r.value >= 88
                  ? "from-yellow-400 to-amber-500"
                  : "from-orange-500 to-rose-600";
            return (
              <div
                key={r.name}
                className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-2.5"
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="truncate text-zinc-700">{r.name}</span>
                  <span className="shrink-0 tabular-nums text-zinc-500">{r.head} чел.</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className={`h-full bg-gradient-to-r ${color}`}
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-zinc-800">
                    {r.value}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

// --------- Entry ---------

export function HrDashboard() {
  const [kind, setKind] = useState<DashKind>("overview");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-3 sm:p-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-yellow-600">
            HR Аналитика
          </div>
          <div className="text-sm text-zinc-600">
            Визуальные дашборды по штатной структуре компании
          </div>
        </div>
        <div className="inline-flex rounded-xl border border-zinc-200 bg-white p-1 shadow-inner">
          <DashTab
            active={kind === "overview"}
            onClick={() => setKind("overview")}
            icon={<PieIcon className="h-4 w-4" />}
            label="Обзор персонала"
          />
          <DashTab
            active={kind === "workforce"}
            onClick={() => setKind("workforce")}
            icon={<BarChart3 className="h-4 w-4" />}
            label="Структура рабочей силы"
          />
        </div>
      </div>

      {kind === "overview" ? <OverviewDashboard /> : <WorkforceDashboard />}
    </div>
  );
}

function DashTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
        active
          ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white font-semibold shadow"
          : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}