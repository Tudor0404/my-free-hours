import type { Operator } from '$types/Schedule.Operator';
import dayjs, { type Dayjs } from 'dayjs';
import ValueBlock from './ValueBlock';

export default class DateBlock extends ValueBlock<number> {
	constructor(operator: 'IN', values: number[]);
	constructor(operator: 'BETWEEN', values: [number, number]);
	constructor(operator: Operator, values: number[]) {
		if (values.length == 0) {
			throw new Error('At least one value must be supplied');
		}

		values.forEach((v) => {
			if (v < 1 && v > 31) {
				throw new Error('Supplied values must be within the range 1 to 31');
			}
		});

		switch (operator) {
			case 'IN':
				if (values.length == 0) {
					throw new Error('At least one value must be supplied');
				}
				break;
			case 'BETWEEN':
				if (values.length != 2) {
					throw new Error('Two values must be supplied with the between operator');
				}
				if (values[0] > values[1]) {
					throw new Error('The first value must be smaller or equal to the second');
				}
				break;
		}

		super('DATE', operator, values);
	}

	verify_date(value: Dayjs): boolean {
		const v = dayjs(value).date();
		switch (this.operator) {
			case 'IN':
				if (this.values.indexOf(v) != -1) {
					return true;
				}
				return false;
			case 'BETWEEN':
				if (this.values[0] <= v && v <= this.values[1]) {
					return true;
				}
				return false;
		}
	}
}
