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

	verify_block(): boolean {
		for (let i = 0; i < this.values.length; i++) {
			const date = this.values[i];
			if (date < 0 || date > 31) {
				throw new Error('Dates must be within the range 0 and 31');
			}
		}

		switch (this.operator) {
			case 'IN':
				if (new Set(this.values).size !== this.values.length) {
					throw new Error("When using the 'IN' operator, values must be unique");
				}

				break;
			case 'BETWEEN':
				if (this.values.length != 2) {
					throw new Error("When using the 'BETWEEN' operator, there must be 2 values");
				}

				if (this.values[0] > this.values[1]) {
					throw new Error(
						"The first value must be smaller or equal to the second when using the 'BETWEEN' operator"
					);
				}

				break;
		}

		return true;
	}

	public static decode_json(obj: Record<string, any>): DateBlock {
		if (
			!(obj.hasOwnProperty('operator') && (obj['operator'] == 'BETWEEN' || obj['operator'] == 'IN'))
		) {
			throw new Error('A date block should have an operator with a value of BETWEEN or IN');
		}

		let m = new DateBlock(obj['operator'], []);

		if (obj.hasOwnProperty('values') && obj['values'] instanceof Array) {
			if (m.operator == 'BETWEEN') {
				if (obj['values'].length == 2) {
					m.values = [obj['values'][0] as number, obj['values'][1] as number];
				} else {
					throw new Error('The length of a values array should be 2, if the operator is BETWEEN');
				}
			} else {
				for (let i = 0; i < obj['values'].length; i++) {
					m.values.push(obj['values'][i] as number);
				}
			}
		} else {
			throw new Error('No values field found on month block');
		}

		return m;
	}
}
