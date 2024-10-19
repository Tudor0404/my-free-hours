import type { Field } from '$types/Schedule.Field';
import type { Operator } from '$types/Schedule.Operator';
import type { ValueBlockInterface } from '$types/Schedule.ValueBlock';
import type { Dayjs } from 'dayjs';

export default abstract class ValueBlock<V> implements ValueBlockInterface<V> {
	field: Field;
	operator: Operator;
	values: V[];

	constructor(field: Field, operator: Operator, value: V[]) {
		this.field = field;
		this.operator = operator;
		this.values = value;
	}

	abstract verify_date(value: Dayjs): boolean;

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
