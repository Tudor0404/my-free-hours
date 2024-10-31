import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const schema = z
	.object({
		active: z.boolean().default(true),
		requiresEmail: z.boolean().default(false),
		emailDomains: z
			.array(z.string().regex(domainRegex, { message: 'Invalid domain format' }))
			.nullable(),
		preNotifMessage: z
			.string()
			.max(1000, { message: 'Notification messages cannot be more than 1000 characters in length' })
			.nullable(),
		preNotifTime: z
			.number()
			.min(0, { message: 'Pre-meeting notifications can only be sent in advance' })
			.max(32767, {
				message: 'Pre-meeting notifications can only be sent up to 22 days in advance'
			}),
		postNotifTime: z
			.number()
			.min(0, { message: 'Post-meeting notifications can only be sent in the future' })
			.max(32767, {
				message: 'Post-meeting notifications can only be sent up to 22 days in the future'
			}),
		postNotifMessage: z
			.string()
			.max(1000, { message: 'Notification messages cannot be more than 1000 characters in length' })
			.nullable(),
		timeIncrement: z
			.number()
			.min(1, { message: 'Time increment of meetings must be at least 1 minute' })
			.max(60, { message: 'Time increment of meetings can only go up to 1 hour' }),
		minimumLead: z
			.number()
			.min(0, { message: 'Minimum lead time cannot be below 0 minutes' })
			.max(525600, { message: 'Minimum lead time must be below 1 year' }),
		maximumLead: z
			.number()
			.min(0, { message: 'Maximum lead time cannot be below 0 minutes' })
			.max(525600, { message: 'Maximum lead time must be below 1 year' }),
		schedule: z.number().nullable()
	})
	.refine((data) => data.maximumLead > data.minimumLead, {
		message: 'The maximum lead time must be above the minimum lead time',
		path: ['maximumLead']
	});

export const load = async () => {
	const form = await superValidate(zod(schema));

	return { form };
};

export const actions = {};
