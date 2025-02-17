import { z } from 'zod';

const domainListRegex = /^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\s*,\s*[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/;

export const createDetails = z
	.object({
		active: z.boolean(),
		requires_email: z.boolean(),
		required_email_domains: z.string().nullable(),
		pre_notification: z.preprocess(
			(val) => {
				if (!val || val === '') {
					return null;
				}

				return val;
			},
			z
				.string()
				.max(1000, {
					message: 'Notification messages cannot be more than 1000 characters in length'
				})
				.nullable()
		),
		post_notification: z.preprocess(
			(val) => {
				if (!val || val === '') {
					return null;
				}

				return val;
			},
			z
				.string()
				.max(1000, {
					message: 'Notification messages cannot be more than 1000 characters in length'
				})
				.nullable()
		),
		pre_notification_time: z
			.number()
			.min(0, { message: 'Pre-meeting notifications can only be sent in advance' })
			.max(32767, {
				message: 'Pre-meeting notifications can only be sent up to 22 days in advance'
			}),
		post_notification_time: z
			.number()
			.min(0, { message: 'Post-meeting notifications can only be sent in the future' })
			.max(32767, {
				message: 'Post-meeting notifications can only be sent up to 22 days in the future'
			}),
		time_increment: z
			.number()
			.min(1, { message: 'Time increment of meetings must be at least 1 minute' })
			.max(60, { message: 'Time increment of meetings can only go up to 60 minutes' }),
		minimum_lead: z
			.number()
			.min(0, { message: 'Minimum lead time cannot be below 0 minutes' })
			.max(525600, { message: 'Minimum lead time must be below 1 year' }),
		maximum_lead: z
			.number()
			.min(0, { message: 'Maximum lead time cannot be below 0 minutes' })
			.max(525960, { message: 'Maximum lead time must be below 1 year' }),
		inperson_schedule: z.number().nullable(),
		online_schedule: z.number().nullable()
	})
	.refine((data) => data.maximum_lead > data.minimum_lead, {
		message: 'The maximum lead time must be above the minimum lead time',
		path: ['maximum_lead']
	})
	.refine(
		(data) => {
			if (data.required_email_domains) {
				return data.required_email_domains.match(domainListRegex);
			}

			return true;
		},
		{
			message: 'Invalid email domain format',
			path: ['required_email_domains']
		}
	)
	.refine(
		(data) => {
			if (data.active) {
				return data.online_schedule !== null && data.inperson_schedule !== null;
			}
			return true;
		},
		{
			message: 'Both schedules must be set when activating the booking page',
			path: ['active']
		}
	);
