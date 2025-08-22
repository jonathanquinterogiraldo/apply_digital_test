import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

interface DateRangeObject {
  startDate?: string | Date;
  endDate?: string | Date;
}

export function IsValidDateRange(validationOptions?: ValidationOptions) {
  return function <T extends { new (...args: any[]): object }>(target: T) {
    registerDecorator({
      name: 'IsValidDateRange',
      target,
      propertyName: '',
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as DateRangeObject;

          if (!obj.startDate || !obj.endDate) return true;

          return new Date(obj.startDate) <= new Date(obj.endDate);
        },
        defaultMessage() {
          return 'startDate must be less than or equal to endDate';
        },
      },
    });
  };
}
