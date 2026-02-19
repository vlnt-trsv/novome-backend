import { SERVICE_CATEGORY } from "@prisma/client"

export const SERVICE_CATEGORY_CONST = {
  [SERVICE_CATEGORY.CONSULTATION]: {
    name: "Консультации",
    description: "Первичные, повторные, онлайн-консультации",
  },
  [SERVICE_CATEGORY.DIAGNOSTICS]: {
    name: "Диагностика",
    description: "УЗИ, анализы перед операцией, 3D-моделирование",
  },
  [SERVICE_CATEGORY.SURGERY_FACE]: {
    name: "Хирургия лица",
    description: "Ринопластика, блефаропластика, фейслифт",
  },
  [SERVICE_CATEGORY.SURGERY_BODY]: {
    name: "Хирургия тела",
    description: "Маммопластика, абдоминопластика",
  },
  [SERVICE_CATEGORY.SURGERY_RECONSTRUCTIVE]: {
    name: "Реконструктивная хирургия",
    description: "Микрохирургия и восстановление",
  },
  [SERVICE_CATEGORY.COSMETOLOGY_INJECTABLE]: {
    name: "Инъекционная косметология",
    description: "Филлеры, ботокс, мезотерапия",
  },
  [SERVICE_CATEGORY.COSMETOLOGY_HARDWARE]: {
    name: "Аппаратная косметология",
    description: "Лазерные методики, SMAS-лифтинг",
  },
  [SERVICE_CATEGORY.AESTHETIC_MEDICINE]: {
    name: "Эстетическая медицина",
    description: "Пилинги, профессиональные уходы",
  },
  [SERVICE_CATEGORY.REHABILITATION]: {
    name: "Реабилитация",
    description: "Послеоперационный уход, перевязки",
  },
  [SERVICE_CATEGORY.ANALYSIS]: {
    name: "Лабораторные исследования",
    description: "Сдача анализов и тестов",
  },
  [SERVICE_CATEGORY.OTHER]: {
    name: "Прочее",
    description: "Другие медицинские услуги",
  },
} as const
