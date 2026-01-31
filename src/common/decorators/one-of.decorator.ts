import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator"

@ValidatorConstraint({ name: "oneOf", async: false })
export class OneOfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object
    const fields = args.constraints

    const count = fields.filter(
      (field: string) => object[field] !== undefined && object[field] !== null,
    ).length

    return count === 1
  }

  defaultMessage(args: ValidationArguments) {
    const fields = args.constraints
    return `Должно быть заполнено ровно одно из полей: ${fields.join(", ")}`
  }
}

export function OneOf(fields: string[], validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function (object: Function) {
    registerDecorator({
      target: object,
      propertyName: "",
      options: validationOptions,
      constraints: fields,
      validator: OneOfConstraint,
    })
  }
}
