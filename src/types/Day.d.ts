import type { HoursMinutes } from './HoursMinutes';
import type { TimeRange } from './TimeRange';

export type Day = {
	day: Date;
	workHours: TimeRange;
	unavailability: TimeRange[];
	online: Boolean;
	inPerson: Boolean;
	availableTimes: HoursMinutes[];
};
