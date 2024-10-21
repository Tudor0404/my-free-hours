import type { Operator } from '$types/Schedule.Operator';
import dayjs, { type Dayjs } from 'dayjs';
import ValueBlock from './ValueBlock';
import type { TimeRange } from '$types/TimeRange';

export default class MonthBlock extends ValueBlock<number> {
	constructor(operator: 'IN', values: number[]);
	constructor(operator: 'BETWEEN', values: [number, number]);
	constructor(operator: Operator, values: number[]) {
		values.forEach((v) => {
			if (v < 0 && v > 11) {
				throw new Error('Supplied values must be within the range 0 to 11');
			}
		});

		super('MONTH', operator, values);
	}

	verify_date(value: Dayjs): boolean {
		const v = dayjs(value).month();
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
