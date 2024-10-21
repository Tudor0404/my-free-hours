import type { Field } from './Schedule.Field';
import type { Operator } from './Schedule.Operator';
import type { TimeRange } from './TimeRange';

export interface ValueBlockInterface<V> {
	field: Field;
	operator: Operator;
	values: V[];
	uuid: string;

	verify_date(value: Dayjs): TimeRange[] | boolean;
	verify_values(): boolean;
	get_object(): Object;
	toString(): string;
}
