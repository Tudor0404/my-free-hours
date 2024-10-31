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

	constructor(field: Field, operator: Operator, value: V[], uuid: string = uuidv4()) {
		this.field = field;
		this.operator = operator;
		this.values = value;
		this.uuid = uuid;
	}

	abstract verify_date(value: Dayjs): boolean;

	abstract verify_block(): boolean;

	encode_json(): Record<string, any> {
		return {
			field: this.field,
			operator: this.operator,
			values: this.values
		};
	}

	toString(): string {
		return JSON.stringify(this.encode_json(), null);
	}
}
