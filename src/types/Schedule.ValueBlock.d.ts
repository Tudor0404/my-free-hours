import type { Field } from './Schedule.Field';
import type { Operator } from './Schedule.Operator';

export interface ValueBlockInterface<V> {
	field: Field;
	operator: Operator;
	values: V[];

	verify_date(value: Dayjs): boolean;
	verify_values(): boolean;
	get_object(): Object;
	toString(): string;
}
