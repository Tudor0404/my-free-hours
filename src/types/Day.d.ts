import type { HoursMinutes } from './Duration';
import type { DayTimeRange } from './timeSection';

export type Day = {
	day: Date;
	workHours: DayTimeRange;
	unavailability: DayTimeRange[];
	online: Boolean;
	inPerson: Boolean;
	availableTimes: HoursMinutes[];
};
