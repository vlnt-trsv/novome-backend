import { SERVICE_CATEGORY } from "@prisma/client"

export const SERVICE_CATEGORY_CONST = {
  [SERVICE_CATEGORY.CONSULTATION]: "Консультации (первичные, повторные, онлайн)",
  [SERVICE_CATEGORY.DIAGNOSTICS]: "Диагностика (УЗИ, анализы перед операцией, 3D-моделирование)",
  [SERVICE_CATEGORY.SURGERY_FACE]: "Хирургия лица (рино, блефаро, фейслифт)",
  [SERVICE_CATEGORY.SURGERY_BODY]: "Хирургия тела (маммопластика, абдоминопластика)",
  [SERVICE_CATEGORY.SURGERY_RECONSTRUCTIVE]: "Реконструктивная и микрохирургия",
  [SERVICE_CATEGORY.COSMETOLOGY_INJECTABLE]: "Инъекционная косметология (филлеры, ботокс)",
  [SERVICE_CATEGORY.COSMETOLOGY_HARDWARE]: "Аппаратная косметология (лазер, SMAS)",
  [SERVICE_CATEGORY.AESTHETIC_MEDICINE]: "Эстетические процедуры (пилинги, уходы)",
  [SERVICE_CATEGORY.REHABILITATION]: "Реабилитация (послеоперационный уход, перевязки)",
  [SERVICE_CATEGORY.ANALYSIS]: "Лабораторные исследования",
  [SERVICE_CATEGORY.OTHER]: "Прочее",
} as const
