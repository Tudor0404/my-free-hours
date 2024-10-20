import type { Operator } from '$types/Schedule.Operator';
import dayjs, { type Dayjs } from 'dayjs';
import ValueBlock from './ValueBlock';

export default class DayBlock extends ValueBlock<Dayjs> {
	constructor(operator: 'IN', values: Dayjs[]);
	constructor(operator: 'BETWEEN', values: [Dayjs, Dayjs]);
	constructor(operator: Operator, values: Dayjs[]) {
		super(
			'DAY',
			operator,
			values.map((d) => d.startOf('day'))
		);
	}

	verify_date(value: Dayjs): boolean {
		const v = value.startOf('day');
		switch (this.operator) {
			case 'IN':
				if (this.values.findIndex((d) => d.isSame(v, 'day')) != -1) {
					return true;
				}
				return false;
			case 'BETWEEN':
				if (v.isBetween(this.values[0], this.values[1], 'day', '[]')) {
					return true;
				}
				return false;
		}
	}
}
