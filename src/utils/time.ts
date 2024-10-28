import { goto } from '$app/navigation';
import type { TimeRange } from '$types/TimeRange';
import type { Booking } from '$types/Booking';
import type { HoursMinutes } from '$types/HoursMinutes';

export function durationToString(duration: HoursMinutes): string {
	let buffer = '';

	if (duration.hours > 0) {
		buffer += duration.hours + 'hr';
	}
	if (duration.minutes > 0) {
		buffer += duration.minutes + (duration.hours > 0 ? '' : 'min');
	}

	return buffer;
}

export function getAllPossibleTimes(bookings: Booking[]): HoursMinutes[] {
	let durations: HoursMinutes[] = [];

	bookings.forEach((b) => {
		b.durations.forEach((d) => {
			if (durations.findIndex((other) => timeOp(other, '=', d)) == -1) {
				durations.push(d);
			}
		});
	});

	durations.sort((a, b) => getAbsoluteTime(a) - getAbsoluteTime(b));

	return durations;
}

export function getAbsoluteTime(time: HoursMinutes): number {
	return time.hours * 60 + time.minutes;
}

export function timeOp(a: HoursMinutes, op: '=' | '>' | '<' | '<=' | '>=' | '!=', b: HoursMinutes) {
	const absA = getAbsoluteTime(a);
	const absB = getAbsoluteTime(b);

	switch (op) {
		case '=':
			return absA == absB;
		case '>':
			return absA > absB;
		case '<':
			return absA < absB;
		case '<=':
			return absA <= absB;
		case '>=':
			return absA >= absB;
		case '!=':
			return absA != absB;
	}
}

export function timeToString(time: HoursMinutes) {
	let suffix = time.hours >= 12 ? 'pm' : 'am';
	let hours = String(time.hours == 0 ? 12 : time.hours);
	let minutes = String(time.minutes).padStart(2, '0');
	return `${hours}:${minutes} ${suffix}`;
}
export function timeToMilitaryString(time: HoursMinutes) {
	return time.hours.toString().padStart(2, '0') + ':' + time.minutes.toString().padStart(2, '0');
}

export function singleOrFirstDate(date: Date | Date[]) {
	return Array.isArray(date) ? date[0] : date;
}

export function areTimeRangesEqual(r1: TimeRange, r2: TimeRange) {
	return timeOp(r1.start, '=', r2.start) && timeOp(r1.end, '=', r2.end);
}

export function isTimeRangeWithin(outer: TimeRange, inner: TimeRange): boolean {
	const startOuter = getAbsoluteTime(outer.start);
	const endOuter = getAbsoluteTime(outer.end);
	const startInner = getAbsoluteTime(inner.start);
	const endInner = getAbsoluteTime(inner.end);
	return startOuter <= startInner && endOuter >= endInner;
}

export function areTimeRangesDisjoint(a: TimeRange, b: TimeRange) {
	const startA = getAbsoluteTime(a.start);
	const endA = getAbsoluteTime(a.end);
	const startB = getAbsoluteTime(b.start);
	const endB = getAbsoluteTime(b.end);

	return endA < startB || endB < startA;
}

export function createTime(hours: number, minutes: number): HoursMinutes {
	if (hours < 0 || hours > 24) {
		throw new Error('Hours must be within the 0 to 24 range');
	} else if (minutes < 0 || minutes > 59) {
		throw new Error('Minutes must be within the 0 to 59 range');
	} else if (hours == 24 && minutes != 0) {
		throw new Error('When the hours is set to 24, minutes must be 0');
	}

	return {
		hours: hours,
		minutes: minutes
	};
}

export function createRange(start: HoursMinutes, end: HoursMinutes): TimeRange {
	if (timeOp(start, '>', end)) {
		throw new Error('The start must be smaller or equal than the end');
	}

	return { start: start, end: end };
}
