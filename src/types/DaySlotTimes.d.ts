export type DaySlotTimes = {
	day: Date;
	times: {
		start: HoursMinutes;
		maxDuration: number;
	}[];
};
