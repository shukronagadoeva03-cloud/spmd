export type LocationId = "hq" | "shou" | "industrial" | "site1" | "site2" | "water";
export type CycleStageId =
  | "exploration"
  | "preparation"
  | "extraction"
  | "transport"
  | "washing"
  | "concentration"
  | "smelting"
  | "sales";

export type SupportTrackId =
  | "mechanics"
  | "supply"
  | "security"
  | "ecology"
  | "admin"
  | "water";

export interface Position {
  title: string;
  count: number;
}

export interface Department {
  id: string;
  name: string;
  short?: string;
  description: string;
  locationId: LocationId;
  cycleStageId?: CycleStageId;
  supportTrackId?: SupportTrackId;
  positions: Position[];
}

export interface LocationInfo {
  id: LocationId;
  title: string;
  subtitle: string;
  physical: string;
  color: string; // tailwind bg class for accent
  ring: string;
  badge: string;
}

export interface CycleStageInfo {
  id: CycleStageId;
  title: string;
  short: string;
  color: string;
}

export interface SupportTrackInfo {
  id: SupportTrackId;
  title: string;
  color: string;
}

export const locations: LocationInfo[] = [
  {
    id: "hq",
    title: "Локация 1 — Центральный штаб",
    subtitle: "Управление и АХЧ",
    physical: "Безопасное неподтопляемое плато вдали от русла реки. Огороженная административная зона.",
    color: "bg-amber-500/15",
    ring: "ring-amber-500/40",
    badge: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  },
  {
    id: "shou",
    title: "Локация 2 — ШОУ",
    subtitle: "Шлихтообогатительный участок",
    physical: "Отдельное бетонное здание бункерного типа на территории центральной базы. Тройной контур охраны, видеонаблюдение 24/7.",
    color: "bg-yellow-500/15",
    ring: "ring-yellow-500/50",
    badge: "bg-yellow-500/20 text-yellow-200 border-yellow-500/40",
  },
  {
    id: "industrial",
    title: "Локация 3 — Промзона и логистика",
    subtitle: "ЦРЦ, склады ГСМ и запчастей",
    physical: "Рядом с центральным штабом, на безопасном удалении от жилых модулей.",
    color: "bg-orange-500/15",
    ring: "ring-orange-500/40",
    badge: "bg-orange-500/20 text-orange-200 border-orange-500/40",
  },
  {
    id: "site1",
    title: "Локация 4А — Горный участок №1",
    subtitle: "Нижнее течение реки · 4× ППМ-5",
    physical: "Мобильный вагончик-офис прямо на полигоне в пойме реки.",
    color: "bg-emerald-500/15",
    ring: "ring-emerald-500/40",
    badge: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  },
  {
    id: "site2",
    title: "Локация 4Б — Горный участок №2",
    subtitle: "Верхнее течение реки · 4× ППМ-5",
    physical: "Автономный мобильный вагончик-офис в верхнем бьефе лицензионной площади.",
    color: "bg-teal-500/15",
    ring: "ring-teal-500/40",
    badge: "bg-teal-500/20 text-teal-200 border-teal-500/40",
  },
  {
    id: "water",
    title: "Водная служба",
    subtitle: "Курсирует вдоль реки",
    physical: "Мобильные бригады, обслуживающие водозабор и берегоукрепление по всему руслу 2000 га.",
    color: "bg-sky-500/15",
    ring: "ring-sky-500/40",
    badge: "bg-sky-500/20 text-sky-200 border-sky-500/40",
  },
];

export const cycleStages: CycleStageInfo[] = [
  { id: "exploration", title: "Разведка", short: "Геология и маркшейдерия", color: "from-violet-500 to-violet-700" },
  { id: "preparation", title: "Подготовка", short: "Вскрыша, снятие торфов", color: "from-indigo-500 to-indigo-700" },
  { id: "extraction", title: "Добыча песков", short: "Экскаваторы, бульдозеры", color: "from-blue-500 to-blue-700" },
  { id: "transport", title: "Транспортировка", short: "Подача к ППМ-5", color: "from-sky-500 to-sky-700" },
  { id: "washing", title: "Промывка", short: "8× ППМ-5 на 4 участках", color: "from-teal-500 to-teal-700" },
  { id: "concentration", title: "Доводка шлиха", short: "ШОУ — концентрация", color: "from-emerald-500 to-emerald-700" },
  { id: "smelting", title: "Плавка / Аффинаж", short: "Слитки, лигатурное золото", color: "from-yellow-500 to-amber-600" },
  { id: "sales", title: "Учёт и сбыт", short: "Драгметаллы, ВЭД", color: "from-amber-500 to-orange-700" },
];

export const supportTracks: SupportTrackInfo[] = [
  { id: "mechanics", title: "Механика и ремонт", color: "bg-orange-500/20 border-orange-500/40 text-orange-200" },
  { id: "water", title: "Вода и берегоукрепление", color: "bg-sky-500/20 border-sky-500/40 text-sky-200" },
  { id: "supply", title: "Снабжение и ГСМ", color: "bg-rose-500/20 border-rose-500/40 text-rose-200" },
  { id: "security", title: "Безопасность", color: "bg-red-500/20 border-red-500/40 text-red-200" },
  { id: "ecology", title: "Экология", color: "bg-lime-500/20 border-lime-500/40 text-lime-200" },
  { id: "admin", title: "HR · Финансы · Юристы", color: "bg-amber-500/20 border-amber-500/40 text-amber-200" },
];

export const departments: Department[] = [
  // HQ
  {
    id: "ceo",
    name: "Дирекция",
    description: "Стратегическое управление компанией полного цикла промывки золота.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "Генеральный директор (CEO)", count: 1 },
      { title: "Заместитель по общим вопросам", count: 1 },
      { title: "Секретарь-референт", count: 1 },
    ],
  },
  {
    id: "finance",
    name: "Финансовый отдел / Бухгалтерия",
    description: "Бухгалтерия, учёт драгметаллов, расчёт зарплаты вахтового персонала.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "Главный бухгалтер", count: 1 },
      { title: "Бухгалтер по учёту драгметаллов", count: 1 },
      { title: "Бухгалтер по расчёту зарплаты", count: 1 },
      { title: "Бухгалтер по материалам и ОС", count: 1 },
      { title: "Финансовый аналитик", count: 1 },
      { title: "Кассир", count: 1 },
      { title: "Учётчик драгметаллов", count: 1 },
    ],
  },
  {
    id: "hr",
    name: "Отдел кадров и юрист",
    description: "Оформление вахт, кадровое делопроизводство, взаимодействие с госорганами Ховалинга.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "Начальник отдела кадров (HR-директор)", count: 1 },
      { title: "Ведущий специалист по кадровому делопроизводству", count: 1 },
      { title: "Специалист по подбору персонала", count: 1 },
      { title: "Инспектор по кадрам (вахтовый учёт)", count: 1 },
      { title: "Юрист", count: 1 },
    ],
  },
  {
    id: "ahc",
    name: "Административно-хозяйственная часть",
    description: "Вахтовый посёлок, медпункт, столовая, прачечная, дизель-генераторы базы.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "Заведующий АХЧ", count: 1 },
      { title: "Фельдшер медпункта", count: 2 },
      { title: "Повар / работник столовой", count: 4 },
      { title: "Работник прачечной", count: 2 },
      { title: "Дизелист базовых генераторов", count: 2 },
    ],
  },
  {
    id: "chief-engineer",
    name: "Управление главного инженера",
    description: "Координация всех производственных отделов на полигоне.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "Главный инженер", count: 1 },
      { title: "Заместитель главного инженера по горным работам", count: 1 },
      { title: "Специалист по ОТ и ПБ", count: 1 },
    ],
  },
  {
    id: "geology",
    name: "Геологоразведочный отдел",
    description: "Разведка, эксплуразведка, опробование, маркшейдерия.",
    locationId: "hq",
    cycleStageId: "exploration",
    positions: [
      { title: "Главный геолог", count: 1 },
      { title: "Ведущий геолог", count: 1 },
      { title: "Геолог", count: 2 },
      { title: "Геофизик", count: 1 },
      { title: "Картограф / GIS-специалист", count: 1 },
      { title: "Горный маркшейдер", count: 2 },
      { title: "Помощник маркшейдера", count: 1 },
      { title: "Оператор буровой установки", count: 1 },
      { title: "Разнорабочий геологосъёмочной партии", count: 2 },
    ],
  },
  {
    id: "ecology",
    name: "Экологический отдел",
    description: "Охрана окружающей среды, рекультивация земель, гидротехника.",
    locationId: "hq",
    supportTrackId: "ecology",
    positions: [
      { title: "Главный эколог", count: 1 },
      { title: "Инженер по охране окружающей среды", count: 1 },
      { title: "Специалист по рекультивации земель", count: 1 },
    ],
  },

  // ШОУ
  {
    id: "shou-mgmt",
    name: "Руководство ШОУ",
    description: "Руководство процессом финальной доводки шлихзолота.",
    locationId: "shou",
    cycleStageId: "concentration",
    positions: [
      { title: "Начальник ШОУ / Главный обогатитель", count: 1 },
      { title: "Инженер-обогатитель", count: 2 },
    ],
  },
  {
    id: "shou-lab",
    name: "Лаборатория доводки",
    description: "Концентрационные столы, отдувка, химический анализ, магнитная сепарация.",
    locationId: "shou",
    cycleStageId: "concentration",
    positions: [
      { title: "Доводчик шлиха (концентраторщик)", count: 4 },
      { title: "Лаборант хим. анализа", count: 2 },
      { title: "Оператор магнитной сепарации", count: 1 },
      { title: "Специалист по учёту драгметаллов", count: 1 },
    ],
  },
  {
    id: "smelting",
    name: "Плавильное отделение / Аффинаж",
    description: "Производство слитков и лигатурного золота.",
    locationId: "shou",
    cycleStageId: "smelting",
    positions: [
      { title: "Начальник аффинажного производства", count: 1 },
      { title: "Плавильщик-аффинажер", count: 2 },
      { title: "Химик-аналитик", count: 2 },
    ],
  },
  {
    id: "sales",
    name: "Сбыт драгметаллов",
    description: "ВЭД, реализация драгоценных металлов.",
    locationId: "shou",
    cycleStageId: "sales",
    positions: [
      { title: "Директор по сбыту", count: 1 },
      { title: "Специалист по ВЭД и сбыту", count: 1 },
      { title: "Ведущий экономист по драгметаллам", count: 1 },
      { title: "Специалист по драгоценным металлам", count: 1 },
    ],
  },
  {
    id: "acceptance",
    name: "Комиссия по приёму шлихзолота",
    description: "Совместная группа (обогатитель + геолог + СБ) для приёмки контейнеров с полигонов.",
    locationId: "shou",
    cycleStageId: "concentration",
    positions: [
      { title: "Представитель ШОУ", count: 1 },
      { title: "Представитель геологии", count: 1 },
      { title: "Представитель СБ", count: 1 },
    ],
  },

  // Industrial
  {
    id: "crc",
    name: "Центральный ремонтный цех (ЦРЦ)",
    description: "Служба главного механика, токарный и сварочный участки, ремонт ППМ-5.",
    locationId: "industrial",
    supportTrackId: "mechanics",
    positions: [
      { title: "Главный механик", count: 1 },
      { title: "Мастер цеха", count: 1 },
      { title: "Механик по горному оборудованию", count: 2 },
      { title: "Слесарь-ремонтник", count: 6 },
      { title: "Токарь", count: 2 },
      { title: "Фрезеровщик", count: 1 },
      { title: "Моторист", count: 2 },
      { title: "Электросварщик (наплавка ковшей, ремонт рам ППМ-5)", count: 4 },
    ],
  },
  {
    id: "letuchki",
    name: "Мобильные рембригады «Летучки»",
    description: "Полноприводные ЗИЛ/УРАЛ для срочного выезда к промприборам на реку.",
    locationId: "industrial",
    supportTrackId: "mechanics",
    positions: [
      { title: "Бригадир выездной бригады", count: 2 },
      { title: "Слесарь выездной бригады", count: 4 },
      { title: "Водитель ЗИЛ/УРАЛ", count: 2 },
    ],
  },
  {
    id: "fuel",
    name: "Склад ГСМ и заправка",
    description: "Резервуарный парк дизтоплива, развоз топлива на участки.",
    locationId: "industrial",
    supportTrackId: "supply",
    positions: [
      { title: "Заведующий складом ГСМ", count: 1 },
      { title: "Оператор АЗС / заправщик", count: 2 },
      { title: "Водитель автотопливозаправщика", count: 4 },
    ],
  },
  {
    id: "warehouse",
    name: "Склад запчастей и расходников",
    description: "Коврики, трафареты, сита, насосы НП-5, подшипники.",
    locationId: "industrial",
    supportTrackId: "supply",
    positions: [
      { title: "Заведующий центральным складом", count: 1 },
      { title: "Кладовщик", count: 2 },
    ],
  },
  {
    id: "supply",
    name: "Отдел снабжения",
    description: "Закупка оборудования, ППМ, ГСМ и расходников.",
    locationId: "industrial",
    supportTrackId: "supply",
    positions: [
      { title: "Начальник отдела снабжения", count: 1 },
      { title: "Закупщик оборудования и запчастей", count: 1 },
      { title: "Менеджер по расходным материалам", count: 1 },
      { title: "Логист по закупкам", count: 1 },
    ],
  },
  {
    id: "transport",
    name: "Транспортный отдел",
    description: "Доставка породы и логистика на полигоне.",
    locationId: "industrial",
    cycleStageId: "transport",
    positions: [
      { title: "Начальник транспортного отдела / Логист", count: 1 },
      { title: "Диспетчер по транспорту", count: 2 },
      { title: "Водитель самосвала (доставка песков к ППМ)", count: 16 },
      { title: "Машинист фронтального погрузчика", count: 2 },
      { title: "Водитель вахтового автобуса", count: 2 },
      { title: "Автослесарь транспортного парка", count: 2 },
    ],
  },

  // Site 1
  {
    id: "site1-mgmt",
    name: "Управление участка №1",
    description: "Мобильный вагончик-офис прямо на полигоне в нижнем течении.",
    locationId: "site1",
    supportTrackId: "admin",
    positions: [
      { title: "Начальник участка (горный мастер)", count: 1 },
      { title: "Горный мастер смены", count: 2 },
    ],
  },
  {
    id: "site1-prep",
    name: "Подготовительные работы — Уч. №1",
    description: "Вскрыша, снятие торфов на нижнем плече.",
    locationId: "site1",
    cycleStageId: "preparation",
    positions: [
      { title: "Бригадир вскрышной бригады", count: 1 },
      { title: "Машинист тяжёлого бульдозера (вскрыша)", count: 3 },
      { title: "Машинист экскаватора (вскрыша)", count: 2 },
      { title: "Водитель самосвала (вскрыша)", count: 2 },
    ],
  },
  {
    id: "site1-extract",
    name: "Добыча песков — Уч. №1",
    description: "Выемка золотоносных песков, подача на ППМ-5.",
    locationId: "site1",
    cycleStageId: "extraction",
    positions: [
      { title: "Оператор экскаватора (добыча)", count: 2 },
      { title: "Машинист бульдозера (подача песков)", count: 4 },
    ],
  },
  {
    id: "site1-wash",
    name: "Промывка — 4× ППМ-5 (Уч. №1)",
    description: "4 бригады промывки на нижнем плече реки.",
    locationId: "site1",
    cycleStageId: "washing",
    positions: [
      { title: "Мастер промприбора", count: 4 },
      { title: "Машинист ППМ-5", count: 4 },
      { title: "Гидромониторщик", count: 4 },
      { title: "Грохотовщик", count: 8 },
      { title: "Слесарь ППМ", count: 2 },
      { title: "Электрик участка", count: 1 },
    ],
  },
  {
    id: "site1-security",
    name: "Пост СБ — Уч. №1",
    description: "Круглосуточная физическая охрана промприборов и касс съёма.",
    locationId: "site1",
    supportTrackId: "security",
    positions: [
      { title: "Старший смены охраны", count: 1 },
      { title: "Инспектор СБ (периметр)", count: 4 },
    ],
  },

  // Site 2
  {
    id: "site2-mgmt",
    name: "Управление участка №2",
    description: "Автономный мобильный вагончик-офис в верхнем бьефе.",
    locationId: "site2",
    supportTrackId: "admin",
    positions: [
      { title: "Начальник участка (горный мастер)", count: 1 },
      { title: "Горный мастер смены", count: 2 },
    ],
  },
  {
    id: "site2-prep",
    name: "Подготовительные работы — Уч. №2",
    description: "Вскрыша, снятие торфов на верхнем плече.",
    locationId: "site2",
    cycleStageId: "preparation",
    positions: [
      { title: "Бригадир вскрышной бригады", count: 1 },
      { title: "Машинист тяжёлого бульдозера (вскрыша)", count: 3 },
      { title: "Машинист экскаватора (вскрыша)", count: 2 },
      { title: "Водитель самосвала (вскрыша)", count: 2 },
    ],
  },
  {
    id: "site2-extract",
    name: "Добыча песков — Уч. №2",
    description: "Выемка золотоносных песков на верхнем плече.",
    locationId: "site2",
    cycleStageId: "extraction",
    positions: [
      { title: "Оператор экскаватора (добыча)", count: 2 },
      { title: "Машинист бульдозера (подача песков)", count: 4 },
    ],
  },
  {
    id: "site2-wash",
    name: "Промывка — 4× ППМ-5 (Уч. №2)",
    description: "4 бригады промывки на верхнем плече реки.",
    locationId: "site2",
    cycleStageId: "washing",
    positions: [
      { title: "Мастер промприбора", count: 4 },
      { title: "Машинист ППМ-5", count: 4 },
      { title: "Гидромониторщик", count: 4 },
      { title: "Грохотовщик", count: 8 },
      { title: "Слесарь ППМ", count: 2 },
      { title: "Электрик участка", count: 1 },
    ],
  },
  {
    id: "site2-security",
    name: "Пост СБ — Уч. №2",
    description: "Физическая охрана и контроль съёмов на верхнем плече.",
    locationId: "site2",
    supportTrackId: "security",
    positions: [
      { title: "Старший смены охраны", count: 1 },
      { title: "Инспектор СБ (периметр)", count: 4 },
    ],
  },

  // Water service (mobile)
  {
    id: "water-pumps",
    name: "Гидротехники и машинисты ДНС",
    description: "Обслуживают дизельные насосные станции и трубы водоподачи вдоль всей реки.",
    locationId: "water",
    supportTrackId: "water",
    positions: [
      { title: "Старший гидротехник", count: 1 },
      { title: "Машинист ДНС", count: 4 },
      { title: "Слесарь по трубам водоподачи", count: 2 },
    ],
  },
  {
    id: "water-dams",
    name: "Группа берегоукрепления",
    description: "Возводят защитные дамбы и сооружают отстойники (зумфы).",
    locationId: "water",
    supportTrackId: "water",
    positions: [
      { title: "Бригадир берегоукрепления", count: 1 },
      { title: "Машинист тяжёлой техники (дамбы)", count: 4 },
      { title: "Разнорабочий", count: 4 },
    ],
  },

  // Central security & video
  {
    id: "security-central",
    name: "Служба безопасности (центр)",
    description: "Режимы ШОУ и аффинаж, видеонаблюдение, экономическая безопасность, ГБР.",
    locationId: "industrial",
    supportTrackId: "security",
    positions: [
      { title: "Начальник службы безопасности", count: 1 },
      { title: "Специалист по режимам (ШОУ и аффинаж)", count: 1 },
      { title: "Оператор видеонаблюдения", count: 4 },
      { title: "Водитель группы быстрого реагирования", count: 2 },
      { title: "Специалист по экономической безопасности", count: 1 },
    ],
  },
];

export function totalHeadcount(): number {
  return departments.reduce(
    (sum, d) => sum + d.positions.reduce((s, p) => s + p.count, 0),
    0,
  );
}

export function getDept(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}

export function getLocation(id: LocationId): LocationInfo {
  return locations.find((l) => l.id === id)!;
}

export function getStage(id: CycleStageId): CycleStageInfo {
  return cycleStages.find((s) => s.id === id)!;
}

export function deptsByLocation(id: LocationId): Department[] {
  return departments.filter((d) => d.locationId === id);
}

export function deptsByStage(id: CycleStageId): Department[] {
  return departments.filter((d) => d.cycleStageId === id);
}

export function deptsBySupport(id: SupportTrackId): Department[] {
  return departments.filter((d) => d.supportTrackId === id);
}