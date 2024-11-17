import type { Database } from './database.types';

export type BookingTypeWithDurations = Database['public']['Tables']['booking_type']['Row'] & {
	durations: Array<{
		id: number;
		duration: number;
	}>;
};
