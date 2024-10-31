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
		const v = DayOfWeekBlock.normalise_monday(dayjs(value).day());
		switch (this.operator) {
			case 'IN':
				if (this.values.findIndex((d) => DayOfWeekBlock.normalise_monday(d) == v) != -1) {
					return true;
				}
				return false;
			case 'BETWEEN':
				if (
					DayOfWeekBlock.normalise_monday(this.values[0]) <= v &&
					v <= DayOfWeekBlock.normalise_monday(this.values[1])
				) {
					return true;
				}
				return false;
		}
	}

	verify_block(): boolean {
		for (let i = 0; i < this.values.length; i++) {
			const dayOfWeek = this.values[i];
			if (dayOfWeek < 0 || dayOfWeek > 6) {
				throw new Error('Days of week must be within the range 0 and 6');
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

				if (
					DayOfWeekBlock.normalise_monday(this.values[0]) >
					DayOfWeekBlock.normalise_monday(this.values[1])
				) {
					throw new Error(
						"The first value must be smaller or equal to the second when using the 'BETWEEN' operator"
					);
				}

				break;
		}

		return true;
	}

	public static decode_json(obj: Record<string, any>): DayOfWeekBlock {
		if (
			!(obj.hasOwnProperty('operator') && (obj['operator'] == 'BETWEEN' || obj['operator'] == 'IN'))
		) {
			throw new Error('A day of week block should have an operator with a value of BETWEEN or IN');
		}

		let d = new DayOfWeekBlock(obj['operator'], []);

		if (obj.hasOwnProperty('values') && obj['values'] instanceof Array) {
			if (d.operator == 'BETWEEN') {
				if (obj['values'].length == 2) {
					d.values = [obj['values'][0] as number, obj['values'][1] as number];
				} else {
					throw new Error('The length of a values array should be 2, if the operator is BETWEEN');
				}
			} else {
				for (let i = 0; i < obj['values'].length; i++) {
					d.values.push(obj['values'][i] as number);
				}
			}
		} else {
			throw new Error('No values field found on month block');
		}

		return d;
	}

	private static normalise_monday(day: number) {
		return (day + 6) % 7;
	}
}
