import type { Dayjs } from 'dayjs';
import ConditionBlock from './ConditionBlock';

export default class Schedule {
	root: ConditionBlock;

	constructor() {
		this.root = new ConditionBlock();
	}

	public get_dates(start: Dayjs, end: Dayjs): Dayjs[] {
		start = start.startOf('day');
		end = end.startOf('day');

		let allowedDates: Dayjs[] = [];

		while (start.isSameOrBefore(end)) {
			if (this.root.evaluate(start)) {
				allowedDates.push(start);
			}
			start = start.add(1, 'day');
		}

		return allowedDates;
	}

	public get_object(): Object {
		return this.root.get_object();
	}
}
