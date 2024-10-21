import type { HoursMinutes } from '$types/HoursMinutes';
import type { TimeRange } from '$types/TimeRange';
import { areTimeRangesDisjoint, getAbsoluteTime, isTimeRangeWithin, timeOp } from '$utils/time';
import { v4 as uuidv4 } from 'uuid';

export default class TimeBlock {
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

	constructor(
		start: HoursMinutes = { hours: 0, minutes: 0 },
		end: HoursMinutes = { hours: 24, minutes: 0 }
	) {
		this.uuid = uuidv4();
		this.start = start;
		this.end = end;
	}

	get timeRange(): TimeRange {
		return {
			start: this.start,
			end: this.end
		};
	}

	public static time_conjunction(left: TimeRange[], right: TimeRange[]): TimeRange[] {
		if (left.length == 0) {
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
				}
				// fully surrounding (other is smaller than exisitng)
				else if (isTimeRangeWithin(l, r)) {
					newRanges.push(r);
				}
				// disjoint
				else if (areTimeRangesDisjoint(l, r)) {
					continue;
				}
				// overlap
				else {
					console.log('overlap');
					console.log(l, r);
					if (timeOp(l.start, '>=', r.start) && timeOp(l.start, '<=', r.end)) {
						newRanges.push({
							start: l.start,
							end: r.end
						});
					} else {
						newRanges.push({
							start: r.start,
							end: l.end
						});
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
			results.push({
				start: { hours: 0, minutes: 0 },
				end: ranges[0].start
			});
		}

		// gaps
		for (let i = 0; i < ranges.length - 1; i++) {
			const curEnd = ranges[i].end;
			const nextStart = ranges[i + 1].start;

			if (timeOp(curEnd, '<', nextStart)) {
				results.push({ start: curEnd, end: nextStart });
			}
		}

		//end
		const lastRange = ranges[ranges.length - 1];
		if (timeOp(lastRange.end, '!=', { hours: 24, minutes: 0 })) {
			ranges.push({
				start: lastRange.end,
				end: { hours: 24, minutes: 0 }
			});
		}

		return ranges;
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
					reducedTimes.push({ start: times[curStart].start, end: times[passedOver[0]].end });
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
}
