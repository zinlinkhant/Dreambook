import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseNumberArrayPipe implements PipeTransform<number[]> {
    constructor(
        private readonly valueName: string,
    ) { }

    transform(value: number[]): number[] {
        try {
            if (!value) {
                return;
            }
            const parsedValue = Array.isArray(value) ? value : JSON.parse(value);
            if (!Array.isArray(parsedValue)) {
                throw new Error(`Invalid array format of ${this.valueName}`);
            }

            if (parsedValue.length === 0) {
                return;
            }

            const numberArray = parsedValue.map((item: any) => {
                const parsedNumber = parseFloat(item);
                if (isNaN(parsedNumber)) {
                    throw new Error(`Invalid number value: ${item} of ${this.valueName}`);
                }
                return parsedNumber;
            });

            return numberArray;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}