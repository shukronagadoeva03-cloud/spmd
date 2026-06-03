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

export const glossaryCategories: { id: GlossaryCategory; title: string; color: string }[] = [
  {
    id: "product",
    title: "Продукт / материал",
    color: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: "equipment",
    title: "Оборудование",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: "process",
    title: "Процессы",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "geology",
    title: "Геология / участок",
    color: "bg-stone-100 text-stone-800 border-stone-300",
  },
];

export const glossary: GlossaryTerm[] = [
  // PRODUCT
  {
    id: "shlikh",
    term: "Шлих",
    category: "product",
    short: "Тяжёлая фракция, остающаяся после промывки песков.",
    full: "Шлих — концентрат тяжёлых минералов, полученный гравитационным обогащением песков на промывочных приборах. Содержит свободное золото, магнетит, ильменит, гранат и другие тяжёлые минералы. Подлежит дальнейшей доводке на ШОУ.",
    synonyms: ["чёрный шлих"],
    units: "кг",
    relatedDeptIds: ["site1-wash", "site2-wash", "shou-mgmt"],
    relatedStageIds: ["washing", "concentration"],
  },
  {
    id: "shlikhovoe-zoloto",
    term: "Шлиховое золото",
    category: "product",
    short: "Золото в составе шлиха до плавки.",
    full: "Природное россыпное золото, выделенное из шлиха в виде крупинок, чешуек и самородков. Чистота обычно 700–950 пробы. Передаётся на плавку для получения сплава Доре.",
    units: "г",
    relatedDeptIds: ["shou-lab", "smelting"],
    relatedStageIds: ["concentration", "smelting"],
  },
  {
    id: "concentrate",
    term: "Концентрат",
    category: "product",
    short: "Обогащённый материал с повышенным содержанием золота.",
    full: "Продукт первичного обогащения на ППМ или отсадочных машинах. Содержание золота на порядки выше, чем в исходных песках. Поступает на доводочные операции в ШОУ.",
    units: "кг",
    relatedDeptIds: ["site1-wash", "site2-wash"],
    relatedStageIds: ["washing"],
  },
  {
    id: "efelya",
    term: "Эфеля",
    category: "product",
    short: "Хвосты промывки — отработанный песок без золота.",
    full: "Мелкая фракция, сбрасываемая с промывочного прибора после извлечения тяжёлых минералов. Складируется в отвалы или используется для рекультивации. Контролируется экологической службой.",
    synonyms: ["хвосты", "галя-эфеля"],
    units: "м³",
    relatedDeptIds: ["ecology", "site1-wash", "site2-wash"],
    relatedStageIds: ["washing"],
  },
  {
    id: "peski",
    term: "Пески",
    category: "product",
    short: "Золотоносный пласт, поступающий на промывку.",
    full: "Рыхлая порода (галечно-песчаная смесь) с промышленным содержанием золота. Залегает на плотике под вскрышей. Добывается экскаваторами и доставляется самосвалами на ППМ.",
    units: "м³",
    relatedDeptIds: ["site1-extract", "site2-extract"],
    relatedStageIds: ["extraction"],
  },
  {
    id: "vskrysha",
    term: "Вскрыша",
    category: "product",
    short: "Пустая порода над золотоносным пластом.",
    full: "Верхний слой грунта, не содержащий золота, который необходимо снять, чтобы добраться до песков. Складируется в отдельные отвалы для последующей рекультивации.",
    units: "м³",
    relatedDeptIds: ["site1-prep", "site2-prep"],
    relatedStageIds: ["preparation"],
  },
  {
    id: "dore",
    term: "Сплав Доре",
    category: "product",
    short: "Чёрновой сплав золота и серебра после плавки.",
    full: "Слитки чернового золота (обычно 70–90% Au + Ag), полученные плавкой шлихового золота. Передаются на аффинажный завод для очистки до 999,9 пробы.",
    synonyms: ["Doré"],
    units: "г",
    relatedDeptIds: ["smelting", "sales"],
    relatedStageIds: ["smelting", "sales"],
  },

  // EQUIPMENT
  {
    id: "ppm5",
    term: "ППМ-5",
    category: "equipment",
    short: "Передвижной промывочный модуль производительностью 5 м³/час по золоту.",
    full: "Промывочный прибор модульного типа: бункер-питатель, скруббер-бутара (грохот), шлюзы глубокого и мелкого наполнения. Установлен у уреза воды; обслуживается бригадой из 6–8 человек. У компании 8 единиц ППМ-5 — по 4 на каждом участке.",
    synonyms: ["промприбор"],
    units: "шт.",
    relatedDeptIds: ["site1-wash", "site2-wash"],
    relatedStageIds: ["washing"],
  },
  {
    id: "shou",
    term: "ШОУ",
    category: "equipment",
    short: "Шлихообогатительная установка — доводка концентратов.",
    full: "Стационарный комплекс для доводки шлиха: концентрационные столы, отсадочные машины, магнитные сепараторы, сушильный шкаф. Работает в режиме закрытой охраняемой зоны. Здесь выделяется шлиховое золото перед плавкой.",
    synonyms: ["шлихообогатительная установка", "ШОФ"],
    relatedDeptIds: ["shou-mgmt", "shou-lab"],
    relatedStageIds: ["concentration"],
  },
  {
    id: "butara",
    term: "Бутара",
    category: "equipment",
    short: "Барабанный грохот для дезинтеграции и классификации песков.",
    full: "Вращающийся перфорированный барабан, в котором пески размываются водой и разделяются по крупности. Надрешётный продукт (галя) сбрасывается, подрешётный поступает на шлюзы. Часть скруббер-бутары на ППМ-5.",
    synonyms: ["скруббер-бутара", "грохот"],
    relatedDeptIds: ["site1-wash", "site2-wash"],
    relatedStageIds: ["washing"],
  },
  {
    id: "shlyuz",
    term: "Шлюз",
    category: "equipment",
    short: "Наклонный жёлоб с трафаретами для улавливания золота.",
    full: "Главный гравитационный аппарат: тяжёлые частицы золота оседают на резиновых ковриках и трафаретах, лёгкая порода смывается водой. Периодически проводится съёмка (промывка) шлюзов для сбора концентрата.",
    relatedDeptIds: ["site1-wash", "site2-wash"],
    relatedStageIds: ["washing"],
  },
  {
    id: "otsadka",
    term: "Отсадочная машина",
    category: "equipment",
    short: "Гравитационный аппарат с пульсирующим потоком воды.",
    full: "Используется на ШОУ для доводки шлиха. Пульсация воды разделяет минералы по плотности — золото уходит в нижний слой (подрешётный продукт).",
    relatedDeptIds: ["shou-mgmt"],
    relatedStageIds: ["concentration"],
  },
  {
    id: "concentrator",
    term: "Центробежный концентратор",
    category: "equipment",
    short: "Аппарат типа Knelson/Knudsen для извлечения тонкого золота.",
    full: "Центробежная сила в десятки g прижимает тяжёлые частицы к стенкам конусной чаши. Эффективен для извлечения мелкого (<0,2 мм) золота, которое уходит со шлюзов.",
    synonyms: ["Кнельсон", "Knelson"],
    relatedDeptIds: ["shou-mgmt"],
    relatedStageIds: ["concentration"],
  },
  {
    id: "magnit-separator",
    term: "Магнитный сепаратор",
    category: "equipment",
    short: "Удаляет магнетит из шлиха перед плавкой.",
    full: "Постоянный или электромагнит на ШОУ. Отбирает магнитную фракцию (магнетит, ильменит), очищая шлиховое золото от тяжёлых железистых минералов.",
    relatedDeptIds: ["shou-mgmt"],
    relatedStageIds: ["concentration"],
  },
  {
    id: "furnace",
    term: "Плавильная печь",
    category: "equipment",
    short: "Индукционная или муфельная печь для получения сплава Доре.",
    full: "Плавка шлихового золота с флюсами (бура, сода, кремнезём) при 1100–1200 °C. На выходе — чёрновой слиток (Доре) и шлак. Помещение печи — режимная зона с двойным контролем.",
    relatedDeptIds: ["smelting"],
    relatedStageIds: ["smelting"],
  },
  {
    id: "excavator",
    term: "Экскаватор",
    category: "equipment",
    short: "Основная горная машина для добычи песков и вскрыши.",
    full: "Гидравлический экскаватор с ёмкостью ковша 1,5–3 м³. Работает в карьере, грузит породу в самосвалы. На каждом участке — несколько единиц для вскрыши и для добычи песков.",
    relatedDeptIds: ["site1-extract", "site2-extract", "site1-prep", "site2-prep"],
    relatedStageIds: ["extraction", "preparation"],
  },
  {
    id: "bulldozer",
    term: "Бульдозер",
    category: "equipment",
    short: "Зачистка полигона, формирование отвалов, планировка площадок.",
    full: "Гусеничный бульдозер используется на вскрышных работах, при перемещении песков к ППМ, формировании дамб и эфельных отвалов, а также для рекультивации отработанных участков.",
    relatedDeptIds: ["site1-prep", "site2-prep"],
    relatedStageIds: ["preparation"],
  },
  {
    id: "dumper",
    term: "Самосвал",
    category: "equipment",
    short: "Карьерный самосвал для транспортировки песков и вскрыши.",
    full: "Самосвалы грузоподъёмностью 25–40 тонн перевозят пески от забоя к ППМ, вскрышу — в отвалы. Парк обслуживается автотранспортным подразделением.",
    relatedDeptIds: ["transport"],
    relatedStageIds: ["transport"],
  },

  // PROCESS
  {
    id: "vskryshnye",
    term: "Вскрышные работы",
    category: "process",
    short: "Снятие пустой породы над пластом песков.",
    full: "Комплекс работ по удалению верхнего слоя грунта до кровли продуктивного пласта. Выполняется бульдозерами и экскаваторами в опережающем режиме перед добычей.",
    relatedDeptIds: ["site1-prep", "site2-prep"],
    relatedStageIds: ["preparation"],
  },
  {
    id: "promyvka",
    term: "Промывка",
    category: "process",
    short: "Гравитационное обогащение песков на ППМ.",
    full: "Основной производственный процесс: пески размываются водой, проходят бутару и шлюзы, тяжёлая фракция оседает в виде концентрата, эфеля уходит в отвал.",
    relatedDeptIds: ["site1-wash", "site2-wash"],
    relatedStageIds: ["washing"],
  },
  {
    id: "dovodka",
    term: "Доводка",
    category: "process",
    short: "Очистка шлиха до шлихового золота на ШОУ.",
    full: "Последовательность операций (отсадка, центробежное концентрирование, магнитная сепарация, сушка, ручная отборка) для получения чистого шлихового золота из чёрного шлиха.",
    relatedDeptIds: ["shou-mgmt", "shou-lab"],
    relatedStageIds: ["concentration"],
  },
  {
    id: "affinage",
    term: "Аффинаж",
    category: "process",
    short: "Очистка сплава Доре до банковского золота 999,9 пробы.",
    full: "Химико-металлургический процесс на аффинажном заводе (вне предприятия). Компания поставляет сплав Доре, получает обратно слитки чистого золота и серебра.",
    relatedDeptIds: ["sales"],
    relatedStageIds: ["sales"],
  },
  {
    id: "amalgamation",
    term: "Амальгамация",
    category: "process",
    short: "Извлечение золота ртутью — ЗАПРЕЩЁНО на предприятии.",
    full: "Исторический способ извлечения золота с использованием ртути. На современных производствах не применяется по экологическим и санитарным соображениям; в РТ запрещён. Здесь приведён только как термин из учебников.",
    relatedDeptIds: ["ecology"],
  },
  {
    id: "oprobovanie",
    term: "Опробование",
    category: "process",
    short: "Отбор и анализ проб для оценки содержания золота.",
    full: "Систематический отбор проб песков, шлиха и хвостов с последующим лабораторным анализом (пробирная плавка). Основа геолого-маркшейдерского учёта и контроля извлечения.",
    relatedDeptIds: ["geology", "shou-lab"],
    relatedStageIds: ["exploration"],
  },

  // GEOLOGY
  {
    id: "rossyp",
    term: "Россыпь",
    category: "geology",
    short: "Месторождение золота во вторичных рыхлых отложениях.",
    full: "Аллювиальное (речное) или террасовое скопление золота, образовавшееся в результате разрушения коренных месторождений. Шугновский участок — типичная аллювиальная россыпь поймы реки.",
    synonyms: ["россыпное месторождение"],
    relatedDeptIds: ["geology"],
    relatedStageIds: ["exploration"],
  },
  {
    id: "poyma",
    term: "Пойма",
    category: "geology",
    short: "Часть долины реки, заливаемая в половодье.",
    full: "Современная аллювиальная равнина вдоль реки Шугнов. Основное место залегания продуктивных песков. Работы здесь ведутся в межень — при низком уровне воды.",
    relatedDeptIds: ["geology", "site1-mgmt", "site2-mgmt"],
  },
  {
    id: "terrasa",
    term: "Терраса",
    category: "geology",
    short: "Древний уровень речной долины над современной поймой.",
    full: "Ступенчатые площадки на склонах долины — следы прежнего положения реки. Часто содержат богатые золотоносные пески. На террасе расположен центральный штаб (безопасное от паводка место).",
    relatedDeptIds: ["ceo", "ahc"],
  },
  {
    id: "plotik",
    term: "Плотик",
    category: "geology",
    short: "Кровля коренных пород под россыпью — нижняя граница песков.",
    full: "Скальное или плотное глинистое основание, на котором лежат золотоносные пески. При добыче необходимо тщательно зачищать плотик, потому что в его трещинах сосредоточено самое крупное золото.",
    relatedDeptIds: ["site1-extract", "site2-extract"],
    relatedStageIds: ["extraction"],
  },
  {
    id: "marksheideria",
    term: "Маркшейдерия",
    category: "geology",
    short: "Горно-геометрические измерения и учёт объёмов.",
    full: "Служба, отвечающая за съёмку карьеров, подсчёт вскрытых и отработанных объёмов, контроль соблюдения проектных контуров. Работает в связке с геологией.",
    relatedDeptIds: ["geology"],
    relatedStageIds: ["exploration"],
  },
  {
    id: "karyer",
    term: "Карьер",
    category: "geology",
    short: "Открытая горная выработка для добычи песков.",
    full: "Совокупность уступов, забоев и съездов, образованных при разработке россыпи открытым способом. У компании — два карьера (по числу участков).",
    relatedDeptIds: ["site1-extract", "site2-extract"],
    relatedStageIds: ["extraction"],
  },
  {
    id: "polygon",
    term: "Полигон",
    category: "geology",
    short: "Участок россыпи, подготовленный к промывочному сезону.",
    full: "Оконтуренный и вскрытый блок месторождения, на котором ведутся добыча и промывка в текущем сезоне. Имеет паспорт с запасами, проектным извлечением и сроками отработки.",
    relatedDeptIds: ["site1-mgmt", "site2-mgmt"],
  },
];

export function getGlossaryCategory(id: GlossaryCategory) {
  return glossaryCategories.find((c) => c.id === id)!;
}

export function getGlossaryTerm(id: string) {
  return glossary.find((g) => g.id === id);
}