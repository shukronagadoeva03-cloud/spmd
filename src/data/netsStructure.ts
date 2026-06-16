export type NetsUnitType =
  | "company"
  | "board"
  | "director"
  | "department"
  | "branch"
  | "division"
  | "section"
  | "project"
  | "subsystem"
  | "position";

export interface NetsUnit {
  id: string;
  parentId: string | null;
  type: NetsUnitType;
  nameTj: string;
  nameRu?: string;
  headcount: number;
  positionCount: number;
  salary: number;
  fmm: number;
  totalSalary: number;
  sourceRow?: number;
}

// NOTE: detailed position rows will be added once the staffing sheet is provided.
// For now the structure mirrors the mandatory top hierarchy and includes all
// strategic project / subsystem blocks listed in the spec.
export const NETS_UNITS: NetsUnit[] = [
  { id: "company", parentId: null, type: "company", nameTj: "ҶДММ «Нет Солюшенс»", nameRu: "Net Solutions", headcount: 320, positionCount: 195, salary: 0, fmm: 0, totalSalary: 724197.63 },
  { id: "board", parentId: "company", type: "board", nameTj: "Шӯрои нозирон", nameRu: "Наблюдательный совет", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "director-general", parentId: "board", type: "director", nameTj: "Директори генералӣ", nameRu: "Генеральный директор", headcount: 1, positionCount: 1, salary: 0, fmm: 0, totalSalary: 0 },

  // 9 main blocks
  { id: "department-commerce", parentId: "director-general", type: "department", nameTj: "Департаменти тиҷоратӣ", nameRu: "Коммерческий департамент", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "department-technical", parentId: "director-general", type: "department", nameTj: "Департаменти техникӣ", nameRu: "Технический департамент", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "department-strategic", parentId: "director-general", type: "department", nameTj: "Департаменти идоракунии лоиҳаҳои стратегӣ", nameRu: "Департамент управления стратегическими проектами", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "department-it", parentId: "director-general", type: "department", nameTj: "Департаменти технологияҳои иттилоотӣ", nameRu: "Департамент информационных технологий", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "branch-khujand", parentId: "director-general", type: "branch", nameTj: "Филиали ҶДММ «Нет Солюшенс» дар ш. Хуҷанд", nameRu: "Филиал в г. Худжанд", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "department-accounting", parentId: "director-general", type: "department", nameTj: "Департаменти баҳисобгирии муҳосибӣ", nameRu: "Бухгалтерия", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "division-hr", parentId: "director-general", type: "division", nameTj: "Шуъбаи идоракунии ҳайати кормандон", nameRu: "Отдел управления персоналом", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "division-procurement", parentId: "director-general", type: "division", nameTj: "Шуъбаи харидорӣ ва логистика", nameRu: "Отдел закупок и логистики", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "division-integration", parentId: "director-general", type: "division", nameTj: "Шуъбаи ҳамгироии система", nameRu: "Отдел системной интеграции", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },

  // Strategic projects subtree
  { id: "project-pay-center", parentId: "department-strategic", type: "project", nameTj: "Лоиҳаи «Маркази идоракунии пардохтҳо»", nameRu: "Центр управления платежами", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "project-multilevel-parking", parentId: "department-strategic", type: "project", nameTj: "Лоиҳаи «Таваққуфгоҳи бисёрсатҳа»", nameRu: "Многоуровневая парковка", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "project-imei", parentId: "department-strategic", type: "project", nameTj: "Лоиҳаи «IMEI» — Бақайдгирии воситаҳои мобилии алоқаи барқӣ", nameRu: "IMEI — регистрация мобильных устройств", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "project-neru", parentId: "department-strategic", type: "project", nameTj: "Лоиҳаи «NERU» — Таваққуфгоҳҳои музднок, нуқтаҳои барқдиҳанда, фотофиксация", nameRu: "NERU — платные парковки, зарядные станции, фотофиксация", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },

  { id: "subsystem-traffic-violations", parentId: "project-neru", type: "subsystem", nameTj: "Зернизоми автоматикунонидашудаи бақайдгирии вайронкунии қоидаҳои ҳаракат дар роҳ", nameRu: "Подсистема фотофиксации нарушений ПДД", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "subsystem-paid-parking", parentId: "project-neru", type: "subsystem", nameTj: "Зернизоми таваққуфгоҳҳои музднок", nameRu: "Подсистема платных парковок", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "subsystem-ev-charging", parentId: "project-neru", type: "subsystem", nameTj: "Зернизоми нуқтаҳои барқдиҳанда барои воситаҳои нақлиёти барқӣ", nameRu: "Подсистема зарядных станций для электротранспорта", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "subsystem-vehicle-registration", parentId: "department-strategic", type: "subsystem", nameTj: "Зернизоми бақайдгирӣ ва барасмиятдарории воситаҳои нақлиёт", nameRu: "Подсистема регистрации транспортных средств", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "subsystem-impound", parentId: "department-strategic", type: "subsystem", nameTj: "Зернизоми таваққуфгоҳи ҷаримавӣ", nameRu: "Подсистема штрафстоянки", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },

  { id: "division-audit-projects", parentId: "department-strategic", type: "division", nameTj: "Шуъбаи аудит ва назорати дохилии лоиҳаҳо", nameRu: "Отдел аудита и внутреннего контроля проектов", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "section-admin-projects", parentId: "department-strategic", type: "section", nameTj: "Бахши маъмурию хоҷагидории лоиҳаҳо", nameRu: "Административно-хозяйственный сектор проектов", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "division-customs-brokers", parentId: "department-strategic", type: "division", nameTj: "Шуъбаи брокерони гумрукӣ", nameRu: "Отдел таможенных брокеров", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
  { id: "division-tech-support", parentId: "department-strategic", type: "division", nameTj: "Шуъбаи хизматрасонии техникӣ ва таъминоти барномавӣ", nameRu: "Отдел технического обслуживания и ПО", headcount: 0, positionCount: 0, salary: 0, fmm: 0, totalSalary: 0 },
];

// --- helpers ---
const byId = new Map(NETS_UNITS.map((u) => [u.id, u]));

export function getUnitById(id: string): NetsUnit | undefined {
  return byId.get(id);
}
export function getChildren(parentId: string): NetsUnit[] {
  return NETS_UNITS.filter((u) => u.parentId === parentId);
}
export function getDescendants(parentId: string): NetsUnit[] {
  const out: NetsUnit[] = [];
  const stack = [...getChildren(parentId)];
  while (stack.length) {
    const n = stack.pop()!;
    out.push(n);
    stack.push(...getChildren(n.id));
  }
  return out;
}
export function getPositions(parentId: string): NetsUnit[] {
  return getDescendants(parentId).filter((u) => u.type === "position");
}
export function getTopLevelUnits(): NetsUnit[] {
  return getChildren("director-general");
}
export function getPath(id: string): NetsUnit[] {
  const path: NetsUnit[] = [];
  let cur = getUnitById(id);
  while (cur) {
    path.unshift(cur);
    cur = cur.parentId ? getUnitById(cur.parentId) : undefined;
  }
  return path;
}

// KPI values are fixed per spec until the full staffing sheet is loaded.
export const KPI = {
  headcount: 320,
  positions: 195,
  payroll: 724197.63,
  mainBlocks: 9,
};

export function formatSomoni(n: number): string {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " сомонӣ";
}
