// NETS — IT системный интегратор. Оргструктура.
// LocationId / CycleStageId / SupportTrackId сохранены технически, но смысл переопределён под IT.

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

export type SupportTrackId = "mechanics" | "supply" | "security" | "ecology" | "admin" | "water";

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
  color: string;
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

export type HierarchyColorKey =
  | "executive"
  | "engineering"
  | "processing"
  | "field"
  | "water"
  | "maintenance"
  | "supply"
  | "security"
  | "ecology"
  | "admin";

export interface HierarchyNode {
  id: string;
  title: string;
  subtitle: string;
  departmentIds: string[];
  colorKey: HierarchyColorKey;
  leadTitle?: string;
  leadDepartmentId?: string;
  children?: HierarchyNode[];
}

export const locations: LocationInfo[] = [
  {
    id: "hq",
    title: "Локация 1 — HQ Душанбе",
    subtitle: "Штаб-квартира · C-level · Sales · Finance · HR",
    physical:
      "Бизнес-центр класса A в центре Душанбе. Открытые опен-спейсы, переговорные, демо-зона для клиентов.",
    color: "bg-amber-500/15",
    ring: "ring-amber-500/40",
    badge: "bg-amber-500/15 text-amber-800 border-amber-500/30",
  },
  {
    id: "shou",
    title: "Локация 2 — NOC / SOC 24×7",
    subtitle: "Центр мониторинга сети и информационной безопасности",
    physical:
      "Защищённое помещение со СКУД и биометрией, видеостена 24/7, два независимых ввода электричества и интернета.",
    color: "bg-yellow-500/15",
    ring: "ring-yellow-500/50",
    badge: "bg-yellow-500/15 text-yellow-800 border-yellow-500/30",
  },
  {
    id: "industrial",
    title: "Локация 3 — Сервисный хаб",
    subtitle: "Склад оборудования · Service Desk · Внедрение",
    physical:
      "Промышленная зона: склад сетевого и серверного оборудования, ремонтная мастерская, парковка сервисных авто.",
    color: "bg-orange-500/15",
    ring: "ring-orange-500/40",
    badge: "bg-orange-500/15 text-orange-800 border-orange-500/30",
  },
  {
    id: "site1",
    title: "Локация 4 — R&D-центр",
    subtitle: "Разработка ПО · Cloud / DevOps · Лаборатория",
    physical:
      "Отдельный офис разработки в Душанбе: лаборатория тестовых стендов, kubernetes-кластер, демо-облако.",
    color: "bg-emerald-500/15",
    ring: "ring-emerald-500/40",
    badge: "bg-emerald-500/15 text-emerald-800 border-emerald-500/30",
  },
  {
    id: "site2",
    title: "Локация 5 — Региональный офис (Худжанд)",
    subtitle: "Сетевые и инфраструктурные инженеры северного региона",
    physical:
      "Офис в Худжанде с собственным складом ЗИП, обслуживает клиентов в Согдийской области.",
    color: "bg-teal-500/15",
    ring: "ring-teal-500/40",
    badge: "bg-teal-500/15 text-teal-800 border-teal-500/30",
  },
  {
    id: "water",
    title: "Выездные инженерные бригады",
    subtitle: "Field engineers · по площадкам клиентов",
    physical:
      "Мобильные бригады с сервисными авто, выезжают к клиентам по всему Таджикистану и в командировки в регион.",
    color: "bg-sky-500/15",
    ring: "ring-sky-500/40",
    badge: "bg-sky-500/15 text-sky-800 border-sky-500/30",
  },
];

export const cycleStages: CycleStageInfo[] = [
  {
    id: "exploration",
    title: "Пресейл и аудит",
    short: "Сбор требований, обследование",
    color: "from-violet-500 to-violet-700",
  },
  {
    id: "preparation",
    title: "Архитектура и дизайн",
    short: "HLD / LLD, BoM, спецификация",
    color: "from-indigo-500 to-indigo-700",
  },
  {
    id: "extraction",
    title: "Закупка оборудования",
    short: "Тендеры, вендоры, лицензии",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "transport",
    title: "Доставка и логистика",
    short: "Склад → площадка клиента",
    color: "from-sky-500 to-sky-700",
  },
  {
    id: "washing",
    title: "Монтаж и пусконаладка",
    short: "СКС, сеть, серверы, ЦОД",
    color: "from-teal-500 to-teal-700",
  },
  {
    id: "concentration",
    title: "Интеграция и тестирование",
    short: "ПО, миграция, UAT",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    id: "smelting",
    title: "Передача в эксплуатацию",
    short: "Документация, обучение, hand-over",
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "sales",
    title: "Поддержка и SLA",
    short: "Service Desk, NOC, SOC",
    color: "from-amber-500 to-orange-700",
  },
];

export const supportTracks: SupportTrackInfo[] = [
  {
    id: "mechanics",
    title: "DevOps и автоматизация",
    color: "bg-orange-500/15 border-orange-500/30 text-orange-800",
  },
  {
    id: "water",
    title: "Выездные инженерные бригады",
    color: "bg-sky-500/15 border-sky-500/30 text-sky-800",
  },
  {
    id: "supply",
    title: "Закупки и склад",
    color: "bg-rose-500/15 border-rose-500/30 text-rose-800",
  },
  {
    id: "security",
    title: "Информационная и физ. безопасность",
    color: "bg-red-500/15 border-red-500/30 text-red-800",
  },
  {
    id: "ecology",
    title: "Качество и compliance",
    color: "bg-lime-500/15 border-lime-500/30 text-lime-800",
  },
  {
    id: "admin",
    title: "HR · Финансы · Юристы",
    color: "bg-amber-500/15 border-amber-500/30 text-amber-800",
  },
];

export const hierarchyTree: HierarchyNode = {
  id: "company",
  title: "Генеральный директор (CEO)",
  subtitle: "Стратегия NETS — системная интеграция, ЦОД, сети, ИБ и сервис под ключ.",
  departmentIds: ["ceo"],
  colorKey: "executive",
  leadTitle: "CEO",
  leadDepartmentId: "ceo",
  children: [
    {
      id: "tech",
      title: "Технический блок (CTO)",
      subtitle: "Архитектура решений, сетевая инженерия, ЦОД, облака, разработка и R&D.",
      departmentIds: ["cto-office"],
      colorKey: "engineering",
      leadTitle: "CTO — технический директор",
      leadDepartmentId: "cto-office",
      children: [
        {
          id: "tech-presale",
          title: "Пресейл и архитектура",
          subtitle: "Solution-архитекторы, системные аналитики, пресейл-инженеры.",
          departmentIds: ["presale"],
          colorKey: "engineering",
          leadTitle: "Руководитель пресейла",
        },
        {
          id: "tech-infra",
          title: "Сети, ЦОД, облако",
          subtitle: "LAN/WAN/SD-WAN, серверная инфраструктура, виртуализация, Cloud/DevOps.",
          departmentIds: ["network", "datacenter", "cloud"],
          colorKey: "field",
          leadTitle: "Руководители направлений",
        },
        {
          id: "tech-soft",
          title: "Разработка и R&D",
          subtitle: "Интеграция ПО, мобильная разработка, ML/IoT-лаборатория.",
          departmentIds: ["dev", "rnd"],
          colorKey: "processing",
          leadTitle: "Head of Engineering / Head of R&D",
        },
      ],
    },
    {
      id: "operations",
      title: "Операции и сервис (COO)",
      subtitle: "PMO, внедрение, Service Desk, NOC 24×7, склад и логистика.",
      departmentIds: ["coo-office"],
      colorKey: "processing",
      leadTitle: "COO — операционный директор",
      leadDepartmentId: "coo-office",
      children: [
        {
          id: "ops-projects",
          title: "Проекты и внедрение",
          subtitle: "PMO, монтажные бригады, пусконаладка на площадках клиентов.",
          departmentIds: ["pmo", "deployment"],
          colorKey: "maintenance",
          leadTitle: "Head of PMO / Head of Deployment",
        },
        {
          id: "ops-service",
          title: "Эксплуатация и поддержка",
          subtitle: "Service Desk L1–L2, NOC 24×7 и выездные инженеры.",
          departmentIds: ["servicedesk", "noc", "servicemobile"],
          colorKey: "water",
          leadTitle: "Service Delivery Manager",
        },
        {
          id: "ops-logistics",
          title: "Склад и логистика",
          subtitle: "Хранение оборудования, доставка к клиентам.",
          departmentIds: ["warehouse"],
          colorKey: "supply",
          leadTitle: "Руководитель склада",
        },
      ],
    },
    {
      id: "infosec",
      title: "Информационная безопасность (CSO)",
      subtitle: "SOC 24×7, аудит и compliance, физическая безопасность объектов.",
      departmentIds: ["cso-office"],
      colorKey: "security",
      leadTitle: "CSO — директор по безопасности",
      leadDepartmentId: "cso-office",
      children: [
        {
          id: "sec-soc",
          title: "SOC и реагирование",
          subtitle: "Мониторинг событий ИБ, threat hunting, расследование инцидентов.",
          departmentIds: ["soc"],
          colorKey: "security",
          leadTitle: "Head of SOC",
        },
        {
          id: "sec-audit",
          title: "Аудит, compliance и физ. безопасность",
          subtitle: "ISO 27001, пентесты, СКУД и режим в офисах.",
          departmentIds: ["audit", "physsec"],
          colorKey: "security",
          leadTitle: "Руководители направлений",
        },
      ],
    },
    {
      id: "commercial",
      title: "Коммерческий блок (CRO)",
      subtitle: "Продажи enterprise-клиентам, маркетинг и партнёрства с вендорами.",
      departmentIds: ["sales"],
      colorKey: "admin",
      leadTitle: "CRO — коммерческий директор",
      leadDepartmentId: "sales",
      children: [
        {
          id: "comm-marketing",
          title: "Маркетинг и партнёрства",
          subtitle: "Бренд, лидогенерация, вендорские сертификации и спецусловия.",
          departmentIds: ["marketing", "partners"],
          colorKey: "admin",
          leadTitle: "CMO / Head of Partnerships",
        },
      ],
    },
    {
      id: "finance",
      title: "Финансы и закупки (CFO)",
      subtitle: "Бухгалтерия, финансовый контроль, корпоративные закупки.",
      departmentIds: ["finance"],
      colorKey: "supply",
      leadTitle: "CFO — финансовый директор",
      leadDepartmentId: "finance",
      children: [
        {
          id: "fin-procurement",
          title: "Закупки",
          subtitle: "Тендеры, работа с вендорами и логистикой завоза.",
          departmentIds: ["procurement"],
          colorKey: "supply",
          leadTitle: "Руководитель закупок",
        },
      ],
    },
    {
      id: "people",
      title: "HR, обучение и юристы (CHRO)",
      subtitle: "Подбор IT-специалистов, T&D, кадровое делопроизводство и юр. поддержка.",
      departmentIds: ["hr"],
      colorKey: "ecology",
      leadTitle: "CHRO — директор по персоналу",
      leadDepartmentId: "hr",
    },
  ],
};

export const departments: Department[] = [
  // ===== HQ — Дирекция и админ. =====
  {
    id: "ceo",
    name: "Дирекция (C-level)",
    description: "Стратегическое управление NETS, работа с ключевыми клиентами и инвесторами.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "CEO — Генеральный директор", count: 1 },
      { title: "Помощник CEO / Chief of Staff", count: 1 },
      { title: "Корпоративный секретарь", count: 1 },
    ],
  },
  {
    id: "finance",
    name: "Финансы и бухгалтерия",
    description: "Управленческий и бухгалтерский учёт, P&L по проектам, казначейство.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "CFO — Финансовый директор", count: 1 },
      { title: "Главный бухгалтер", count: 1 },
      { title: "Бухгалтер", count: 2 },
      { title: "Финансовый аналитик / контроллер", count: 1 },
    ],
  },
  {
    id: "hr",
    name: "HR, обучение и юристы",
    description: "Подбор IT-специалистов, бренд работодателя, T&D, кадровое и юр. сопровождение.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "CHRO — Директор по персоналу", count: 1 },
      { title: "HR Business Partner", count: 1 },
      { title: "IT-рекрутер", count: 2 },
      { title: "T&D / Тренинг-менеджер", count: 1 },
      { title: "Корпоративный юрист", count: 1 },
    ],
  },
  {
    id: "procurement",
    name: "Закупки",
    description: "Тендеры, переговоры с вендорами, контрактация поставок оборудования и лицензий.",
    locationId: "hq",
    cycleStageId: "extraction",
    positions: [
      { title: "Руководитель отдела закупок", count: 1 },
      { title: "Закупщик IT-оборудования", count: 2 },
      { title: "Менеджер по тендерам и госзакупкам", count: 2 },
    ],
  },

  // ===== HQ — Технический блок =====
  {
    id: "cto-office",
    name: "Офис CTO — архитектура предприятия",
    description: "Технологическая стратегия, корпоративная архитектура, технический комитет.",
    locationId: "hq",
    cycleStageId: "preparation",
    positions: [
      { title: "CTO — Технический директор", count: 1 },
      { title: "Enterprise Architect", count: 2 },
      { title: "Главный технолог / Standards Owner", count: 1 },
    ],
  },
  {
    id: "presale",
    name: "Пресейл и архитектура решений",
    description: "Подготовка ТКП, обследование инфраструктуры клиента, проектирование решений.",
    locationId: "hq",
    cycleStageId: "exploration",
    positions: [
      { title: "Руководитель пресейла", count: 1 },
      { title: "Solution Architect", count: 4 },
      { title: "Системный аналитик", count: 3 },
      { title: "Пресейл-инженер", count: 4 },
    ],
  },

  // ===== Site2 — Региональный офис: Сети и ЦОД =====
  {
    id: "network",
    name: "Сетевая инженерия (LAN/WAN/SD-WAN)",
    description: "Проектирование и внедрение корпоративных сетей, маршрутизации, Wi-Fi и SD-WAN.",
    locationId: "site2",
    cycleStageId: "washing",
    positions: [
      { title: "Руководитель сетевого отдела", count: 1 },
      { title: "Network Architect (CCIE)", count: 3 },
      { title: "Сетевой инженер L3 (CCNP)", count: 6 },
      { title: "Сетевой инженер L2", count: 8 },
      { title: "Wi-Fi / SD-WAN специалист", count: 3 },
    ],
  },
  {
    id: "datacenter",
    name: "ЦОД и инфраструктура",
    description: "Серверы, СХД, виртуализация, бэкап. Проектирование и эксплуатация ЦОД Tier III.",
    locationId: "site2",
    cycleStageId: "washing",
    positions: [
      { title: "Руководитель отдела ЦОД", count: 1 },
      { title: "Архитектор виртуализации", count: 2 },
      { title: "Инженер серверной инфраструктуры", count: 6 },
      { title: "Инженер СХД (SAN/NAS)", count: 4 },
      { title: "Инженер виртуализации (VMware/KVM)", count: 4 },
      { title: "Инженер резервного копирования", count: 3 },
    ],
  },

  // ===== Site1 — R&D-центр: разработка, облако, R&D =====
  {
    id: "cloud",
    name: "Облако и DevOps",
    description: "Публичные/частные облака, CI/CD, IaC, Kubernetes, SRE-практики.",
    locationId: "site1",
    supportTrackId: "mechanics",
    positions: [
      { title: "Руководитель Cloud/DevOps", count: 1 },
      { title: "Cloud Architect", count: 2 },
      { title: "DevOps-инженер", count: 5 },
      { title: "SRE-инженер", count: 3 },
      { title: "Kubernetes-инженер", count: 4 },
    ],
  },
  {
    id: "dev",
    name: "Разработка и интеграция ПО",
    description: "Backend/Frontend/Mobile, интеграция с 1C/ERP, QA-автоматизация.",
    locationId: "site1",
    cycleStageId: "concentration",
    positions: [
      { title: "Руководитель разработки", count: 1 },
      { title: "Tech Lead", count: 2 },
      { title: "Backend-разработчик", count: 8 },
      { title: "Frontend-разработчик", count: 4 },
      { title: "Mobile-разработчик", count: 2 },
      { title: "QA Engineer", count: 4 },
      { title: "Интегратор 1C / ERP", count: 4 },
    ],
  },
  {
    id: "rnd",
    name: "R&D-лаборатория",
    description: "Прикладные исследования: ML/AI, IoT/Edge, прототипирование новых решений.",
    locationId: "site1",
    cycleStageId: "concentration",
    positions: [
      { title: "Руководитель R&D", count: 1 },
      { title: "Research Engineer", count: 4 },
      { title: "ML / AI инженер", count: 3 },
      { title: "IoT / Edge инженер", count: 3 },
      { title: "Стажёр-исследователь", count: 2 },
    ],
  },

  // ===== HQ — Операционный блок (office) =====
  {
    id: "coo-office",
    name: "Офис COO",
    description: "Операционная стратегия, KPI сервисных подразделений, эскалации.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "COO — Операционный директор", count: 1 },
      { title: "Operations Analyst", count: 1 },
    ],
  },
  {
    id: "pmo",
    name: "Проектный офис (PMO)",
    description: "Управление портфелем проектов внедрения, методология, отчётность.",
    locationId: "hq",
    cycleStageId: "smelting",
    positions: [
      { title: "Руководитель PMO", count: 1 },
      { title: "Senior Project Manager", count: 4 },
      { title: "Project Manager", count: 3 },
      { title: "Project Coordinator", count: 2 },
    ],
  },

  // ===== Industrial — Сервисный хаб =====
  {
    id: "deployment",
    name: "Внедрение и монтаж",
    description: "Монтаж СКС, серверного и сетевого оборудования на площадках клиентов.",
    locationId: "industrial",
    cycleStageId: "washing",
    positions: [
      { title: "Руководитель внедрения", count: 1 },
      { title: "Бригадир монтажников", count: 3 },
      { title: "Инженер по СКС", count: 12 },
      { title: "Электромонтажник слаботочных систем", count: 8 },
    ],
  },
  {
    id: "servicedesk",
    name: "Service Desk (L1–L2)",
    description: "Единая точка приёма заявок клиентов, инцидент-менеджмент, эскалации.",
    locationId: "industrial",
    cycleStageId: "sales",
    positions: [
      { title: "Руководитель Service Desk", count: 1 },
      { title: "Диспетчер 1-й линии", count: 6 },
      { title: "Инженер поддержки L2", count: 12 },
      { title: "Координатор инцидентов / Major Incident Mgr", count: 3 },
    ],
  },
  {
    id: "warehouse",
    name: "Склад и логистика",
    description: "Хранение оборудования, ЗИП, комплектование заказов, доставка к клиенту.",
    locationId: "industrial",
    cycleStageId: "transport",
    positions: [
      { title: "Руководитель склада и логистики", count: 1 },
      { title: "Кладовщик", count: 5 },
      { title: "Логист", count: 4 },
      { title: "Водитель-экспедитор", count: 4 },
    ],
  },
  {
    id: "physsec",
    name: "Физ. безопасность и режим",
    description: "СКУД, видеонаблюдение и охрана офисов NETS и клиентских объектов.",
    locationId: "industrial",
    supportTrackId: "security",
    positions: [
      { title: "Начальник физической безопасности", count: 1 },
      { title: "Охранник КПП", count: 4 },
      { title: "Оператор СКУД / видеонаблюдения", count: 2 },
    ],
  },

  // ===== NOC / SOC 24×7 =====
  {
    id: "noc",
    name: "NOC 24×7",
    description: "Круглосуточный мониторинг сети и инфраструктуры клиентов, capacity-планирование.",
    locationId: "shou",
    cycleStageId: "sales",
    positions: [
      { title: "Руководитель NOC", count: 1 },
      { title: "Дежурный инженер NOC (смена)", count: 8 },
      { title: "Инженер систем мониторинга (Zabbix/Prometheus)", count: 4 },
      { title: "Capacity Engineer", count: 1 },
    ],
  },
  {
    id: "soc",
    name: "SOC 24×7",
    description: "Мониторинг событий ИБ (SIEM), threat hunting, реагирование на инциденты.",
    locationId: "shou",
    cycleStageId: "sales",
    positions: [
      { title: "Руководитель SOC", count: 1 },
      { title: "SOC-аналитик L1", count: 6 },
      { title: "SOC-аналитик L2 / Threat Hunter", count: 3 },
      { title: "Incident Response инженер", count: 2 },
    ],
  },

  // ===== CSO office =====
  {
    id: "cso-office",
    name: "Офис CSO",
    description: "Стратегия ИБ, политика безопасности, взаимодействие с регуляторами.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "CSO — Директор по безопасности", count: 1 },
      { title: "Security Program Manager", count: 1 },
    ],
  },
  {
    id: "audit",
    name: "Аудит и compliance",
    description: "Внутренний и внешний аудит ИБ, ISO 27001, тестирование на проникновение.",
    locationId: "hq",
    supportTrackId: "security",
    positions: [
      { title: "Руководитель аудита и compliance", count: 1 },
      { title: "Аудитор ИБ (ISO 27001)", count: 3 },
      { title: "Pentester / Red Team", count: 2 },
    ],
  },

  // ===== HQ — Коммерческий блок =====
  {
    id: "sales",
    name: "Продажи корп. клиентам",
    description: "Работа с enterprise-клиентами, госсектором и СМБ, ведение сделок.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "CRO — Коммерческий директор", count: 1 },
      { title: "Руководитель отдела продаж", count: 1 },
      { title: "Account Manager (Enterprise)", count: 5 },
      { title: "Account Manager (SMB / гос)", count: 3 },
    ],
  },
  {
    id: "marketing",
    name: "Маркетинг",
    description: "Бренд, лидогенерация, мероприятия, контент и PR.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "CMO — Директор по маркетингу", count: 1 },
      { title: "Performance-маркетолог", count: 2 },
      { title: "Контент-менеджер", count: 1 },
      { title: "PR-менеджер", count: 1 },
    ],
  },
  {
    id: "partners",
    name: "Партнёрства и вендоры",
    description: "Cisco, HPE, Microsoft, Huawei, Fortinet и др.: статусы, сертификации, спецусловия.",
    locationId: "hq",
    supportTrackId: "admin",
    positions: [
      { title: "Руководитель партнёрств", count: 1 },
      { title: "Вендор-менеджер (Cisco / HPE)", count: 1 },
      { title: "Вендор-менеджер (Microsoft / Fortinet)", count: 2 },
      { title: "Сертификационный координатор", count: 1 },
    ],
  },

  // ===== Field — выездные инженеры =====
  {
    id: "servicemobile",
    name: "Выездные инженерные бригады",
    description: "Field engineers: монтаж, ТО и аварийные выезды по площадкам клиентов.",
    locationId: "water",
    supportTrackId: "water",
    positions: [
      { title: "Руководитель выездных бригад", count: 1 },
      { title: "Выездной инженер (универсал)", count: 8 },
      { title: "Водитель сервис-кар", count: 3 },
    ],
  },
];

export function totalHeadcount(): number {
  return departments.reduce((sum, d) => sum + d.positions.reduce((s, p) => s + p.count, 0), 0);
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

export function getSupportTrack(id: SupportTrackId): SupportTrackInfo {
  return supportTracks.find((s) => s.id === id)!;
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
