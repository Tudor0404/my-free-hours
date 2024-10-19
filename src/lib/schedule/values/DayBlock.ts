import type { Operator } from '$types/Schedule.Operator';
import dayjs, { Dayjs } from 'dayjs';
import ValueBlock from './ValueBlock';

export default class DayBlock extends ValueBlock<Dayjs> {
	constructor(operator: 'IN', values: Dayjs[]);
	constructor(operator: 'BETWEEN', values: [Dayjs, Dayjs]);
	constructor(operator: Operator, values: Dayjs[]) {
		if (values.length == 0) {
			throw new Error('At least one value must be supplied');
		}

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
				if (v.isBetween(this.values[0], this.values[1], 'day')) {
					return true;
				}
				return false;
		}
	}
}
