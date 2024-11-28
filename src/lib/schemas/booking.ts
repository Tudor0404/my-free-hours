import dayjs from 'dayjs';
import { z } from 'zod';

export const booking = z.object({
	guest_email: z.string().nullable(),
	type_id: z.number().min(0, 'Incorrect type id'),
	duration: z.number().min(0, 'Meeting durations must be larger than 0'),
	meeting_method: z.enum(['online', 'in_person'], { message: 'Incorrect meeting method selected' }),
	date: z.string().refine((e) => dayjs(e).isValid(), 'Incorrect date format'),
	time: z
		.string()
		.min(1, 'No time has been selected')
		.regex(/\d{2}:\d{2}/, 'Incorrect time format')
		.refine((e) => {
			const [hoursString, minutesString] = e.split(':');

			const hours = Number.parseInt(hoursString);
			const minutes = Number.parseInt(minutesString);

			return !(
				hours < 0 ||
				hours > 24 ||
				minutes < 0 ||
				minutes > 60 ||
				(hours == 24 && minutes !== 0)
			);
		}, 'Incorrect time format'),
	guest_name: z.string().min(3, 'Name must be at least 3 characters long')
});
