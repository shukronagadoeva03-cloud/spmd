import type { CycleStageId } from "./orgStructure";

export type GlossaryCategory = "product" | "equipment" | "process" | "geology";

export interface GlossaryTerm {
  id: string;
  term: string;
  category: GlossaryCategory;
  short: string;
  full: string;
  synonyms?: string[];
  units?: string;
  relatedDeptIds?: string[];
  relatedStageIds?: CycleStageId[];
}

// Категории переосмыслены под IT-интегратор:
// product = Услуги / решения · equipment = Оборудование и ПО ·
// process = Процессы и методологии · geology = Стандарты и среда
export const glossaryCategories: { id: GlossaryCategory; title: string; color: string }[] = [
  { id: "product", title: "Услуги и решения", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "equipment", title: "Оборудование и ПО", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "process", title: "Процессы и методологии", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "geology", title: "Стандарты и среда", color: "bg-stone-100 text-stone-800 border-stone-300" },
];

export const glossary: GlossaryTerm[] = [
  // ===== УСЛУГИ / РЕШЕНИЯ =====
  {
    id: "si",
    term: "Системная интеграция",
    category: "product",
    short: "Объединение разнородных IT-систем заказчика в единое решение.",
    full: "Комплекс услуг по проектированию, поставке, монтажу и интеграции аппаратно-программных компонентов. NETS делает интеграцию под ключ — от ТЗ и пресейла до передачи в эксплуатацию и поддержки по SLA.",
    synonyms: ["SI", "system integration"],
    relatedDeptIds: ["presale", "pmo", "deployment"],
    relatedStageIds: ["exploration", "preparation", "smelting"],
  },
  {
    id: "tko",
    term: "ТКП",
    category: "product",
    short: "Технико-коммерческое предложение клиенту.",
    full: "Документ, описывающий предлагаемое решение, его архитектуру, спецификацию оборудования и ПО, сроки внедрения и стоимость. Готовится пресейл-командой по итогам обследования.",
    synonyms: ["RFP response", "коммерческое предложение"],
    relatedDeptIds: ["presale", "sales"],
    relatedStageIds: ["exploration"],
  },
  {
    id: "sla",
    term: "SLA",
    category: "product",
    short: "Соглашение об уровне сервиса с клиентом.",
    full: "Service Level Agreement — формальный контракт, фиксирующий целевые показатели сервиса: время реакции, время восстановления, доступность (например, 99,9%). Базовый документ для Service Desk, NOC и SOC.",
    synonyms: ["Service Level Agreement"],
    relatedDeptIds: ["servicedesk", "noc", "soc"],
    relatedStageIds: ["sales"],
  },
  {
    id: "scs",
    term: "СКС",
    category: "product",
    short: "Структурированная кабельная система здания.",
    full: "Иерархическая кабельная инфраструктура (медь + оптика), объединяющая рабочие места, серверные и точки доступа. Один из базовых продуктов системного интегратора: проектирование, монтаж и сертификация.",
    synonyms: ["structured cabling"],
    relatedDeptIds: ["deployment"],
    relatedStageIds: ["washing"],
  },
  {
    id: "managed",
    term: "Managed Services",
    category: "product",
    short: "Передача эксплуатации IT-инфраструктуры внешнему провайдеру.",
    full: "Долгосрочный сервис, при котором NETS берёт на себя администрирование сети, серверов, ИБ или рабочих мест клиента 24×7, обеспечивая фиксированные SLA и предсказуемую стоимость.",
    synonyms: ["MSP", "аутсорсинг IT"],
    relatedDeptIds: ["noc", "soc", "servicedesk"],
    relatedStageIds: ["sales"],
  },

  // ===== ОБОРУДОВАНИЕ / ПО =====
  {
    id: "sdwan",
    term: "SD-WAN",
    category: "equipment",
    short: "Программно-определяемая глобальная сеть.",
    full: "Технология, при которой управление WAN-каналами (MPLS, интернет, LTE) централизовано и выполняется по политикам приложений. Снижает стоимость WAN и повышает отказоустойчивость распределённых сетей.",
    synonyms: ["Software-Defined WAN"],
    relatedDeptIds: ["network", "presale"],
    relatedStageIds: ["preparation", "washing"],
  },
  {
    id: "mpls",
    term: "MPLS",
    category: "equipment",
    short: "Магистральная технология коммутации операторских сетей.",
    full: "Multi-Protocol Label Switching — способ передачи трафика по меткам поверх IP. Используется операторами для построения L2/L3 VPN. Часто заменяется или дополняется SD-WAN.",
    relatedDeptIds: ["network"],
    relatedStageIds: ["preparation"],
  },
  {
    id: "siem",
    term: "SIEM",
    category: "equipment",
    short: "Платформа сбора и корреляции событий ИБ.",
    full: "Security Information and Event Management — система, агрегирующая логи источников (сетевое оборудование, серверы, приложения), коррелирующая события и поднимающая инциденты для SOC-аналитиков.",
    synonyms: ["Splunk", "QRadar", "Wazuh"],
    relatedDeptIds: ["soc"],
    relatedStageIds: ["sales"],
  },
  {
    id: "edr",
    term: "EDR / XDR",
    category: "equipment",
    short: "Защита конечных точек с расширенным детектированием.",
    full: "Endpoint / Extended Detection & Response — агент на рабочих станциях и серверах, отслеживающий поведение процессов и реагирующий на угрозы автоматически или по команде SOC.",
    relatedDeptIds: ["soc"],
    relatedStageIds: ["sales"],
  },
  {
    id: "firewall",
    term: "NGFW",
    category: "equipment",
    short: "Межсетевой экран нового поколения.",
    full: "Next-Generation Firewall — комбинация классического firewall с IPS, контролем приложений, SSL-инспекцией и URL-фильтрацией. Базовый компонент периметра корпоративной сети.",
    synonyms: ["Fortinet", "Palo Alto", "Check Point"],
    relatedDeptIds: ["network", "soc"],
    relatedStageIds: ["washing"],
  },
  {
    id: "k8s",
    term: "Kubernetes",
    category: "equipment",
    short: "Оркестратор контейнеризированных приложений.",
    full: "Открытая платформа автоматического развёртывания, масштабирования и эксплуатации контейнеров. Стандарт де-факто для cloud-native приложений; обслуживается командой Cloud/DevOps.",
    synonyms: ["k8s", "K8s"],
    relatedDeptIds: ["cloud", "dev"],
    relatedStageIds: ["concentration"],
  },
  {
    id: "vmware",
    term: "Виртуализация (VMware/KVM)",
    category: "equipment",
    short: "Запуск множества виртуальных серверов на одном физическом хосте.",
    full: "Технология гипервизоров (VMware vSphere, KVM, Hyper-V) для консолидации серверной нагрузки, отказоустойчивости и быстрого развёртывания сред. Основа классической инфраструктуры ЦОД.",
    relatedDeptIds: ["datacenter"],
    relatedStageIds: ["washing"],
  },
  {
    id: "san",
    term: "СХД (SAN/NAS)",
    category: "equipment",
    short: "Сетевая система хранения данных.",
    full: "Storage Area Network (блочный доступ по Fibre Channel/iSCSI) или Network Attached Storage (файловый доступ NFS/SMB). Используется для хранения данных виртуальных машин, БД и резервных копий.",
    relatedDeptIds: ["datacenter"],
    relatedStageIds: ["washing"],
  },
  {
    id: "backup",
    term: "Резервное копирование",
    category: "equipment",
    short: "Системы Veeam / Commvault / Bacula для бэкапа и DR.",
    full: "Программно-аппаратные решения для регулярного копирования данных и приложений с возможностью восстановления (RPO/RTO). Обязательный элемент любой корпоративной инфраструктуры.",
    synonyms: ["Veeam", "backup&restore", "DR"],
    relatedDeptIds: ["datacenter"],
    relatedStageIds: ["washing"],
  },

  // ===== ПРОЦЕССЫ / МЕТОДОЛОГИИ =====
  {
    id: "itil",
    term: "ITIL",
    category: "process",
    short: "Библиотека лучших практик управления IT-услугами.",
    full: "ITIL v4 — методологическая база Service Desk и NOC: управление инцидентами, проблемами, изменениями, конфигурациями. NETS использует ITIL как стандарт сервисных процессов.",
    synonyms: ["ITSM"],
    relatedDeptIds: ["servicedesk", "noc", "pmo"],
    relatedStageIds: ["sales", "smelting"],
  },
  {
    id: "devops",
    term: "DevOps / CI/CD",
    category: "process",
    short: "Культура и практики ускорения доставки ПО.",
    full: "Практика автоматизации сборки, тестирования и развёртывания: GitLab CI, Jenkins, Argo CD. Включает Infrastructure as Code (Terraform, Ansible) и наблюдаемость.",
    relatedDeptIds: ["cloud", "dev"],
    relatedStageIds: ["concentration"],
  },
  {
    id: "agile",
    term: "Agile / Scrum",
    category: "process",
    short: "Итеративный подход к управлению проектами и разработкой.",
    full: "Гибкая методология: спринты по 1–2 недели, demo, ретро. NETS применяет Scrum для R&D и продуктовой разработки; для интеграционных проектов — гибрид с водопадными вехами.",
    relatedDeptIds: ["dev", "rnd", "pmo"],
  },
  {
    id: "incident",
    term: "Управление инцидентами",
    category: "process",
    short: "Процесс восстановления сервиса при сбое.",
    full: "Регистрация, классификация, эскалация и устранение инцидентов с фиксацией времени реакции и восстановления (TTR). Major-инциденты разбираются в Post-Mortem с RCA.",
    synonyms: ["incident management", "RCA", "post-mortem"],
    relatedDeptIds: ["servicedesk", "noc", "soc"],
    relatedStageIds: ["sales"],
  },
  {
    id: "change",
    term: "Управление изменениями",
    category: "process",
    short: "Контролируемое внесение изменений в инфраструктуру.",
    full: "Процесс CAB (Change Advisory Board): оценка рисков, окно работ, план отката, согласование. Минимизирует риск аварий при апгрейдах и реконфигурациях.",
    relatedDeptIds: ["noc", "datacenter", "network"],
  },
  {
    id: "uat",
    term: "UAT",
    category: "process",
    short: "Приёмочное тестирование пользователями.",
    full: "User Acceptance Testing — финальный этап перед передачей в эксплуатацию, когда заказчик проверяет соответствие решения требованиям ТЗ. После подписания акта UAT — переход в SLA.",
    relatedDeptIds: ["dev", "pmo"],
    relatedStageIds: ["concentration", "smelting"],
  },
  {
    id: "pentest",
    term: "Пентест",
    category: "process",
    short: "Тестирование на проникновение по согласованной программе.",
    full: "Контролируемая попытка взлома инфраструктуры или приложения с целью найти уязвимости до злоумышленника. Делится на black-box, grey-box и white-box; результат — отчёт с CVSS-оценками.",
    synonyms: ["penetration test", "ethical hacking"],
    relatedDeptIds: ["audit"],
  },

  // ===== СТАНДАРТЫ / СРЕДА =====
  {
    id: "iso27001",
    term: "ISO 27001",
    category: "geology",
    short: "Международный стандарт системы управления ИБ (ISMS).",
    full: "Стандарт ISO/IEC 27001 описывает требования к ISMS: оценка рисков, политики, контроли (Annex A). Сертификация подтверждает зрелость процессов ИБ перед клиентами.",
    relatedDeptIds: ["audit", "cso-office"],
  },
  {
    id: "tier3",
    term: "ЦОД Tier III",
    category: "geology",
    short: "Уровень отказоустойчивости дата-центра по Uptime Institute.",
    full: "Tier III обеспечивает обслуживание без остановки (concurrently maintainable): резервированные системы питания, охлаждения и связи. Доступность — 99,982% (около 1,6 ч простоя в год).",
    synonyms: ["Tier 3", "Uptime Institute"],
    relatedDeptIds: ["datacenter"],
  },
  {
    id: "gdpr",
    term: "ПДн / GDPR",
    category: "geology",
    short: "Защита персональных данных по нац. и международному регулированию.",
    full: "Закон РТ «О персональных данных» и европейский GDPR требуют классифицировать ПДн, ограничивать доступ, обеспечивать удаление по запросу. Влияет на архитектуру всех клиентских систем.",
    relatedDeptIds: ["audit", "hr"],
  },
  {
    id: "tco",
    term: "TCO / ROI",
    category: "geology",
    short: "Совокупная стоимость владения и возврат инвестиций.",
    full: "TCO — все затраты на решение за жизненный цикл (CAPEX + OPEX). ROI — отношение полученной выгоды к этим затратам. Базовые финансовые метрики при обосновании проектов клиентам.",
    relatedDeptIds: ["presale", "sales", "finance"],
  },
  {
    id: "rfp",
    term: "RFI / RFP / RFQ",
    category: "geology",
    short: "Формы запроса предложений от клиента.",
    full: "RFI (Request for Information) — сбор информации о рынке; RFP (Proposal) — запрос комплексного предложения; RFQ (Quotation) — запрос цены на конкретный перечень. Цикл закупок enterprise-клиентов всегда проходит через эти документы.",
    relatedDeptIds: ["presale", "sales", "procurement"],
    relatedStageIds: ["exploration", "extraction"],
  },
  {
    id: "ckd",
    term: "СКУД",
    category: "geology",
    short: "Система контроля и управления доступом в помещения.",
    full: "Комплекс контроллеров, считывателей и СПО для управления входом сотрудников и посетителей в офис, ЦОД, NOC/SOC. Часто интегрируется с видеонаблюдением и кадровой системой.",
    relatedDeptIds: ["physsec"],
  },
];

export function getGlossaryCategory(id: GlossaryCategory) {
  return glossaryCategories.find((c) => c.id === id)!;
}

export function getGlossaryTerm(id: string) {
  return glossary.find((g) => g.id === id);
}
