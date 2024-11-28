import dayjs, { type Dayjs } from 'dayjs';
import ConditionBlock from './ConditionBlock';
import type { TimeRange } from '$types/TimeRange';
import TimeBlock from './values/TimeBlock';
import DayBlock from './values/DayBlock';
import { createTime, getAbsoluteTime, timeMath, timeOp } from '$lib/utils/time';
import type { HoursMinutes } from '$types/HoursMinutes';
import type { DaySlotTimes } from '$types/DaySlotTimes';

export default class Schedule {
	root: ConditionBlock;

	constructor() {
		this.root = new ConditionBlock();
	}

	public get_times_within_days(
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

	public get_times_at_day(day: Dayjs): TimeRange[] {
		return this.root.evaluate(day.startOf('day'));
	}

	public get_time_slots_within(start: Dayjs, end: Dayjs, interval: HoursMinutes): DaySlotTimes[] {
		let buffer: DaySlotTimes[] = [];

		// construct new schedule
		const newSchedule = new Schedule();

		// root AND
		const rootAnd = new ConditionBlock('AND');

		// original schedule
		rootAnd.add_rule(this.root);

		// start datetime restriction
		// If startday, must be within startTime and end of day
		// X -> Y === ¬ X ∨ Y
		const startRestriction = new ConditionBlock('OR', [
			new ConditionBlock('NOT', [new DayBlock('IN', [start])]),
			new TimeBlock(createTime(start.hour(), start.minute()), TimeBlock.LATEST_TIME)
		]);
		rootAnd.add_rule(startRestriction);

		// end datetime restriction
		// If endDay, must be within start of day and endTime
		const endRestriction = new ConditionBlock('OR', [
			new ConditionBlock('NOT', [new DayBlock('IN', [end])]),
			new TimeBlock(TimeBlock.EARLIEST_TIME, createTime(end.hour(), end.minute()))
		]);
		rootAnd.add_rule(endRestriction);

		newSchedule.root = rootAnd;

		const timeRanges = newSchedule.get_times_within_days(start, end);

		for (let i = 0; i < timeRanges.length; i++) {
			let dayBuffer: { start: HoursMinutes; maxDuration: number }[] = [];

			for (let j = 0; j < timeRanges[i].times.length; j++) {
				let curTime: HoursMinutes | false = timeRanges[i].times[j].start;
				// set curTime to the next interval available
				if (curTime.minutes !== 0) {
					curTime = timeMath(curTime, '+', {
						hours: 0,
						minutes: getAbsoluteTime(interval) - (curTime.minutes % getAbsoluteTime(interval))
					});
				}

				if (!curTime) break;

				const endTime = timeRanges[i].times[j].end;

				while (timeOp(curTime, '<', endTime)) {
					const duration = timeMath(endTime, '-', curTime);

					if (!duration) break;

					dayBuffer.push({ start: curTime, maxDuration: getAbsoluteTime(duration) });

					const newTime = timeMath(curTime, '+', interval);

					if (!newTime) break;

					curTime = newTime;
				}
			}

			buffer.push({ day: timeRanges[i].day.toDate(), times: dayBuffer });
		}

		return buffer;
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
