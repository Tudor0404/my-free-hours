import type { TimeSection } from './timeSection';

export type Day = {
	day: Date;
	workHours: TimeSection;
	unavailability: TimeSection[];
	onlineOnly: Boolean;
};
