import type { HoursMinutes } from '$types/HoursMinutes';
import type { TimeRange } from '$types/TimeRange';
import {
	areTimeRangesDisjoint,
	createRange,
	getAbsoluteTime,
	isTimeRangeWithin,
	ObjectToTime,
	timeOp
} from '$lib/utils/time';
import { v4 as uuidv4 } from 'uuid';

export default class TimeBlock {
	field = 'TIME';
	start: HoursMinutes;
	end: HoursMinutes;
	uuid: string;

	static FULL_TIME_RANGE: TimeRange = {
		start: {
			hours: 0,
			minutes: 0
		},
		end: {
			hours: 24,
			minutes: 0
		}
	};

	static get EARLIEST_TIME() {
		return {
			hours: 0,
			minutes: 0
		};
	}

	static get LATEST_TIME() {
		return {
			hours: 24,
			minutes: 0
		};
	}

	constructor(
		start: HoursMinutes = TimeBlock.EARLIEST_TIME,
		end: HoursMinutes = TimeBlock.LATEST_TIME,
		uuid: string = uuidv4()
	) {
		this.start = start;
		this.end = end;
		this.uuid = uuid;
	}

	get timeRange(): TimeRange {
		return createRange(this.start, this.end);
	}

	public clone() {
		return new TimeBlock(this.start, this.end);
	}

	public static time_conjunction(left: TimeRange[], right: TimeRange[]): TimeRange[] {
		if (left.length === 0 || right.length === 0) {
			return [];
		}

		let validRanges: TimeRange[] = [];

		for (let i = 0; i < right.length; i++) {
			const r = right[i];
			let newRanges: TimeRange[] = [];

			for (let j = 0; j < left.length; j++) {
				const l = left[j];

				// fully within (exisiting is smaller than other)
				if (isTimeRangeWithin(r, l)) {
					newRanges.push(l);
				} // fully surrounding (other is smaller than exisitng)
				else if (isTimeRangeWithin(l, r)) {
					newRanges.push(r);
				} // disjoint
				else if (areTimeRangesDisjoint(l, r)) {
				} // overlap
				else {
					if (timeOp(l.start, '>=', r.start) && timeOp(l.start, '<=', r.end)) {
						newRanges.push(createRange(l.start, r.end));
					} else {
						newRanges.push(createRange(r.start, l.end));
					}
				}
			}

			validRanges.push(...newRanges);
		}

		return this.time_simplification(validRanges);
	}

	public static time_disjunction(left: TimeRange[], right: TimeRange[]): TimeRange[] {
		left.push(...right);
		return TimeBlock.time_simplification(left);
	}

	public static time_negation(ranges: TimeRange[]): TimeRange[] {
		if (ranges.length == 0) return [this.FULL_TIME_RANGE];

		// algorithm requires the times to be disjoint
		ranges = this.time_simplification(ranges).toSorted(
			(r1, r2) => getAbsoluteTime(r1.start) - getAbsoluteTime(r2.end)
		);

		let results: TimeRange[] = [];

		// start
		if (getAbsoluteTime(ranges[0].start) != 0) {
			results.push(createRange(this.EARLIEST_TIME, ranges[0].start));
		}

		// gaps
		for (let i = 0; i < ranges.length - 1; i++) {
			const curEnd = ranges[i].end;
			const nextStart = ranges[i + 1].start;

			if (timeOp(curEnd, '<', nextStart)) {
				results.push(createRange(curEnd, nextStart));
			}
		}

		//end
		const lastRange = ranges[ranges.length - 1];
		if (timeOp(lastRange.end, '!=', { hours: 24, minutes: 0 })) {
			results.push(createRange(lastRange.end, this.LATEST_TIME));
		}

		return results;
	}

	public static time_simplification(times: TimeRange[]): TimeRange[] {
		if (times.length == 0) return [];

		const sortedTimes = times
			.filter((r) => timeOp(r.start, '!=', r.end))
			.flatMap((e, i) => [
				{ id: i, time: e.start, type: 'start' },
				{ id: i, time: e.end, type: 'end' }
			])
			.toSorted((e1, e2) => getAbsoluteTime(e1.time) - getAbsoluteTime(e2.time));

		if (sortedTimes.length == 0) {
			return [];
		}

		if (sortedTimes[0].type == 'end') {
			throw new Error('Invalid time ranges');
		}

		let reducedTimes: TimeRange[] = [];
		let curStart: number = -1;
		let passedOver: number[] = [];

		for (let i = 0; i < sortedTimes.length; i++) {
			const time = sortedTimes[i];

			// check for ranges that start one after another
			if (i != 0 && i + 1 < sortedTimes.length) {
				if (
					sortedTimes[i].type == 'end' &&
					sortedTimes[i + 1].type == 'start' &&
					timeOp(sortedTimes[i].time, '=', sortedTimes[i + 1].time)
				) {
					passedOver.splice(
						passedOver.findIndex((e) => e == time.id),
						1
					);
					continue;
				}
			}

			if (time.type == 'start') {
				if (curStart == -1) {
					curStart = time.id;
				}
				passedOver.push(time.id);
			}

			if (time.type == 'end') {
				if (passedOver.length == 1) {
					reducedTimes.push(createRange(times[curStart].start, times[passedOver[0]].end));
					curStart = -1;
					passedOver = [];
				} else {
					passedOver.splice(
						passedOver.findIndex((e) => e == time.id),
						1
					);
				}
			}
		}

		return reducedTimes;
	}

	public verify(): boolean {
		if (
			timeOp(this.start, '<', TimeBlock.EARLIEST_TIME) ||
			timeOp(this.start, '>', TimeBlock.LATEST_TIME) ||
			timeOp(this.end, '<', TimeBlock.EARLIEST_TIME) ||
			timeOp(this.end, '>', TimeBlock.LATEST_TIME)
		) {
			throw new Error('Times must be within 00:00 and 24:00');
		}

		if (timeOp(this.start, '>', this.end)) {
			throw new Error('The start time must be the same or before the end time');
		}

		return true;
	}

	public encode_json(): Record<string, any> {
		return {
			field: 'TIME',
			operator: 'BETWEEN',
			values: [this.start, this.end]
		};
	}

	public static decode_json(obj: Record<string, any>): TimeBlock {
		let t = new TimeBlock();

		if (!(obj.hasOwnProperty('operator') && obj['operator'] == 'BETWEEN')) {
			throw new Error('A time block should have an operator with a value of BETWEEN');
		}

		if (obj.hasOwnProperty('values') && obj['values'] instanceof Array) {
			if (obj['values'].length == 2) {
				t.start = ObjectToTime(obj['values'][0]);
				t.end = ObjectToTime(obj['values'][1]);
			} else {
				throw new Error('Only 2 values must be in the values field in a time block');
			}
		} else {
			throw new Error('No values field found in time block');
		}

		return t;
	}
}
