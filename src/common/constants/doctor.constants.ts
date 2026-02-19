import { SPECIALIZATION } from "@prisma/client"

export const SPECIALIZATION_CONST = {
  FACIAL_AESTHETIC_SURGERY: {
    name: "Эстетическая хирургия лица",
    items: {
      [SPECIALIZATION.RHINOPLASTY]: {
        title: "Ринопластика",
        description: "Пластика носа для изменения формы, размера или исправления дефектов",
      },
      [SPECIALIZATION.BLEPHAROPLASTY]: {
        title: "Блефаропластика",
        description: "Пластика век для устранения избытка кожи и жировых грыж",
      },
      [SPECIALIZATION.FACELIFT]: {
        title: "Фейслифтинг",
        description: "Подтяжка лица для устранения возрастных изменений и морщин",
      },
      [SPECIALIZATION.FOREHEAD_LIFT]: {
        title: "Подтяжка лба",
        description: "Коррекция морщин на лбу и поднятие бровей",
      },
      [SPECIALIZATION.CHEEK_AUGMENTATION]: {
        title: "Увеличение скул",
        description: "Коррекция формы и объёма скул имплантами или филлерами",
      },
      [SPECIALIZATION.CHIN_AUGMENTATION]: {
        title: "Увеличение подбородка",
        description: "Коррекция формы и размера подбородка для гармонии лица",
      },
      [SPECIALIZATION.OTOPLASTY]: {
        title: "Отопластика",
        description: "Пластика ушей для коррекции формы и устранения лопоухости",
      },
      [SPECIALIZATION.LIP_AUGMENTATION]: {
        title: "Увеличение губ",
        description: "Коррекция объёма и формы губ филлерами или имплантами",
      },
      [SPECIALIZATION.NECK_LIFT]: {
        title: "Подтяжка шеи",
        description: "Устранение избытка кожи и жира на шее (второй подбородок)",
      },
    },
  },

  BODY_AESTHETIC_SURGERY: {
    name: "Эстетическая хирургия тела",
    items: {
      [SPECIALIZATION.MAMMOPLASTY]: {
        title: "Маммопластика",
        description: "Комплексная пластика груди любой направленности",
      },
      [SPECIALIZATION.BREAST_AUGMENTATION]: {
        title: "Увеличение груди",
        description: "Аугментация молочных желез имплантами или липофилингом",
      },
      [SPECIALIZATION.BREAST_REDUCTION]: {
        title: "Уменьшение груди",
        description: "Редукция молочных желез при гипермастии",
      },
      [SPECIALIZATION.BREAST_LIFT]: {
        title: "Подтяжка груди",
        description: "Мастопексия для коррекции птоза (опущения) груди",
      },
      [SPECIALIZATION.LIPOSUCTION]: {
        title: "Липосакция",
        description: "Удаление избыточного жира из проблемных зон",
      },
      [SPECIALIZATION.ABDOMINOPLASTY]: {
        title: "Абдоминопластика",
        description: "Пластика живота с удалением избытка кожи и подтяжкой мышц",
      },
      [SPECIALIZATION.BUTTOCK_AUGMENTATION]: {
        title: "Увеличение ягодиц",
        description: "Глютеопластика имплантами или липофилингом",
      },
      [SPECIALIZATION.BUTTOCK_LIFT]: {
        title: "Подтяжка ягодиц",
        description: "Коррекция формы и упругости ягодиц",
      },
      [SPECIALIZATION.THIGH_LIFT]: {
        title: "Подтяжка бёдер",
        description: "Устранение избытка кожи на внутренней поверхности бёдер",
      },
      [SPECIALIZATION.ARM_LIFT]: {
        title: "Подтяжка рук",
        description: "Брахиопластика для коррекции дряблости кожи рук",
      },
    },
  },

  RECONSTRUCTIVE_SURGERY: {
    name: "Реконструктивная хирургия",
    items: {
      [SPECIALIZATION.BURN_RECONSTRUCTION]: {
        title: "Реконструкция после ожогов",
        description: "Восстановление тканей после термических и химических ожогов",
      },
      [SPECIALIZATION.TRAUMA_RECONSTRUCTION]: {
        title: "Реконструкция после травм",
        description: "Восстановление повреждённых тканей после травм и аварий",
      },
      [SPECIALIZATION.CANCER_RECONSTRUCTION]: {
        title: "Онкореконструкция",
        description: "Восстановление после удаления злокачественных новообразований",
      },
      [SPECIALIZATION.CLEFT_LIP_PALATE]: {
        title: "Расщелина губы и нёба",
        description: "Хирургическое лечение врождённой расщелины",
      },
      [SPECIALIZATION.CONGENITAL_DEFORMITIES]: {
        title: "Врождённые деформации",
        description: "Коррекция аномалий развития различной локализации",
      },
    },
  },

  MICROSURGERY: {
    name: "Микрохирургия",
    items: {
      [SPECIALIZATION.MICROSURGERY]: {
        title: "Микрохирургия",
        description: "Операции с использованием микроскопа и прецизионных техник",
      },
      [SPECIALIZATION.TISSUE_TRANSPLANTATION]: {
        title: "Пересадка тканей",
        description: "Автотрансплантация тканей с микрососудистым анастомозом",
      },
      [SPECIALIZATION.FLAP_SURGERY]: {
        title: "Хирургия лоскутов",
        description: "Перемещение сложных тканевых комплексов с сосудистой ножкой",
      },
    },
  },

  HAND_SURGERY: {
    name: "Хирургия кисти",
    items: {
      [SPECIALIZATION.HAND_SURGERY]: {
        title: "Хирургия кисти",
        description: "Лечение заболеваний и травм кисти и пальцев",
      },
      [SPECIALIZATION.HAND_RECONSTRUCTION]: {
        title: "Реконструкция кисти",
        description: "Восстановление функции и формы кисти после травм",
      },
      [SPECIALIZATION.TENDON_REPAIR]: {
        title: "Восстановление сухожилий",
        description: "Хирургическое лечение повреждений сухожилий кисти",
      },
    },
  },

  MAXILLOFACIAL_SURGERY: {
    name: "Челюстно-лицевая хирургия",
    items: {
      [SPECIALIZATION.MAXILLOFACIAL_SURGERY]: {
        title: "ЧЛХ",
        description: "Лечение заболеваний челюстей, лица и шейного отдела",
      },
      [SPECIALIZATION.JAW_CORRECTION]: {
        title: "Коррекция челюсти",
        description: "Ортогнатическая хирургия для исправления прикуса",
      },
      [SPECIALIZATION.FACIAL_FRACTURE]: {
        title: "Переломы лица",
        description: "Остеосинтез костей скелета лица при травмах",
      },
    },
  },

  DERMATOLOGY_COSMETOLOGY: {
    name: "Дерматология и косметология",
    items: {
      [SPECIALIZATION.DERMABRASION]: {
        title: "Дермабразия",
        description: "Механическое шлифование кожи для обновления эпидермиса",
      },
      [SPECIALIZATION.CHEMICAL_PEEL]: {
        title: "Химический пилинг",
        description: "Очищение кожи кислотными растворами разной глубины",
      },
      [SPECIALIZATION.LASER_SURGERY]: {
        title: "Лазерная хирургия",
        description: "Лазерная шлифовка, удаление новообразований и омоложение",
      },
      [SPECIALIZATION.SCAR_REVISION]: {
        title: "Коррекция рубцов",
        description: "Хирургическое и лазерное улучшение рубцов и шрамов",
      },
    },
  },

  GENITAL_PLASTIC_SURGERY: {
    name: "Генитальная пластическая хирургия",
    items: {
      [SPECIALIZATION.LABIAPLASTY]: {
        title: "Лабиопластика",
        description: "Пластика малых половых губ",
      },
      [SPECIALIZATION.VAGINOPLASTY]: {
        title: "Вагинопластика",
        description: "Укрепление стенок влагалища и восстановление тонуса",
      },
      [SPECIALIZATION.PENILE_AUGMENTATION]: {
        title: "Фаллопластика",
        description: "Увеличение полового члена и коррекция его формы",
      },
    },
  },

  GENERAL_PLASTIC_SURGERY: {
    name: "Общая пластическая хирургия",
    items: {
      [SPECIALIZATION.GENERAL_PLASTIC_SURGERY]: {
        title: "Общая пластика",
        description: "Широкий спектр пластических операций различной направленности",
      },
      [SPECIALIZATION.COSMETIC_SURGERY]: {
        title: "Косметическая хирургия",
        description: "Эстетические операции для улучшения внешности",
      },
      [SPECIALIZATION.RECONSTRUCTIVE_SURGERY]: {
        title: "Реконструктивная хирургия",
        description: "Восстановление формы и функций тканей",
      },
    },
  },
} as const
