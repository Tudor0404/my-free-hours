import dayjs, { type Dayjs } from 'dayjs';
import ConditionBlock from './ConditionBlock';
import type { TimeRange } from '$types/TimeRange';
import { z } from 'zod';
import type TimeBlock from './values/TimeBlock';

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

	public encode_json(): Record<string, any> {
		return this.root.encode_json();
	}

	public verify() {
		return this.root.verify_condition();
	}

	public static decode_json(obj: Record<string, any>): Schedule {
		let s = new Schedule();

		s.root = ConditionBlock.decode_json(obj);

		return s;
	}
}
