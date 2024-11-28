import { z } from 'zod';

export const user = z.object({
	display_name: z.string().max(40).nullable()
});
