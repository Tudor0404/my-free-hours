import type { Operator } from '$types/Schedule.Operator';
import dayjs, { type Dayjs } from 'dayjs';
import ValueBlock from './ValueBlock';

export default class DateBlock extends ValueBlock<number> {
	constructor(operator: 'IN', values: number[]);
	constructor(operator: 'BETWEEN', values: [number, number]);
	constructor(operator: Operator, values: number[]) {
		values.forEach((v) => {
			if (v < 1 && v > 31) {
				throw new Error('Supplied values must be within the range 1 to 31');
			}
		});

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
