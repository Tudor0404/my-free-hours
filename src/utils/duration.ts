import type { Booking } from 'types/Booking';
import type { Duration } from 'types/Duration';

export function durationToString(duration: Duration): string {
	let buffer = '';

	if (duration.hours > 0) {
		buffer += duration.hours + 'hr';
	}
	if (duration.minutes > 0) {
		buffer += duration.minutes + (duration.hours > 0 ? '' : 'min');
	}

	return buffer;
}

export function getAllPossibleDurations(bookings: Booking[]): Duration[] {
	let durations: Duration[] = [];

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

export function areDurationsEqual(a: Duration, b: Duration): boolean {
	return a.hours == b.hours && a.minutes == b.minutes;
}
