import type { Field } from '$types/Schedule.Field';
import type { Operator } from '$types/Schedule.Operator';
import type { ValueBlockInterface } from '$types/Schedule.ValueBlock';
import type { TimeRange } from '$types/TimeRange';
import dayjs, { type Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export default abstract class ValueBlock<V> implements ValueBlockInterface<V> {
	field: Field;
	operator: Operator;
	values: V[];
	uuid: string;

	constructor(field: Field, operator: Operator, value: V[]) {
		this.field = field;
		this.operator = operator;
		this.values = value;
		this.uuid = uuidv4();
	}

	abstract verify_date(value: Dayjs): boolean;

	verify_values(): boolean {
		switch (this.operator) {
			case 'IN':
				if (this.values.length == 0) {
					throw new Error('At least one value must be supplied');
				}
				break;
			case 'BETWEEN':
				if (this.values.length != 2) {
					throw new Error('Two values must be supplied with the between operator');
				}
				if (this.values[0] instanceof dayjs.Dayjs && this.values[1] instanceof dayjs.Dayjs) {
					if (this.values[0].isAfter(this.values[1])) {
						throw new Error('The first value must be smaller or equal to the second');
					}
				} else if (this.values[0] > this.values[1]) {
					throw new Error('The first value must be smaller or equal to the second');
				}
				break;
		}
		return true;
	}

	get_object(): Object {
		return {
			field: this.field,
			operator: this.operator,
			values: this.values
		};
	}

	toString(): string {
		return JSON.stringify(this.get_object(), null);
	}
}
