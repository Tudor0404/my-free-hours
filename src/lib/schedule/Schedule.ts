import dayjs, { type Dayjs } from 'dayjs';
import ConditionBlock from './ConditionBlock';
import type { TimeRange } from '$types/TimeRange';

export default class Schedule {
	root: ConditionBlock;

	constructor() {
		this.root = new ConditionBlock();
	}

	public get_times_within(
		start: Dayjs,
		end: Dayjs,
		showEmpty = false
	): { day: Dayjs; times: TimeRange[] }[] {
		start = start.startOf('day');
		end = end.startOf('day');

		let allowedDates: { day: Dayjs; times: TimeRange[] }[] = [];

		while (start.isSameOrBefore(end)) {
			const res = this.root.evaluate(start);
			if (res.length > 0) {
				allowedDates.push({
					day: start,
					times: res
				});
			} else if (showEmpty) {
				allowedDates.push({
					day: start,
					times: []
				});
			}
			start = start.add(1, 'day');
		}

		return allowedDates;
	}

	public get_times_at(day: Dayjs): TimeRange[] {
		return this.root.evaluate(day.startOf('day'));
	}

	public get_object(): Object {
		return this.root.get_object();
	}
}
