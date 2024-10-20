import type { Operator } from '$types/Schedule.Operator';
import dayjs, { type Dayjs } from 'dayjs';
import ValueBlock from './ValueBlock';

export default class DayOfWeekBlock extends ValueBlock<number> {
	constructor(operator: 'IN', values: number[]);
	constructor(operator: 'BETWEEN', values: [number, number]);
	constructor(operator: Operator, values: number[]) {
		values.forEach((v) => {
			if (v < 0 && v > 6) {
				throw new Error('Supplied values must be within the range 0 to 6');
			}
		});

		super('DAY_OF_WEEK', operator, values);
	}

	verify_date(value: Dayjs): boolean {
		const v = dayjs(value).day();
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
