import { goto } from '$app/navigation';
import type { Booking } from 'types/Booking';
import type { HoursMinutes } from 'types/Duration';

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

export function getAllPossibleDurations(bookings: Booking[]): HoursMinutes[] {
	let durations: HoursMinutes[] = [];

	bookings.forEach((b) => {
		b.durations.forEach((d) => {
			if (
				durations.findIndex((other) => other.hours == d.hours && other.minutes == d.minutes) == -1
			) {
				durations.push(d);
			}
		});
	});

	durations.sort((a, b) => a.hours * 60 + a.minutes - (b.hours * 60 + b.minutes));

	return durations;
}

export function areDurationsEqual(a: HoursMinutes, b: HoursMinutes): boolean {
	return a.hours == b.hours && a.minutes == b.minutes;
}

export function timeToString(time: HoursMinutes) {
	let suffix = time.hours >= 12 ? 'pm' : 'am';
	let hours = String(time.hours == 0 ? 12 : time.hours);
	let minutes = String(time.minutes).padStart(2, '0');
	return `${hours}:${minutes} ${suffix}`;
}

export function singleOrFirstDayjs(date: Date | Date[]) {
	return Array.isArray(date) ? date[0] : date;
}
