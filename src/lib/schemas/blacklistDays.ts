import dayjs from "dayjs";
import { z } from "zod";

export const blacklistDays = z.object({
  days: z.array(z.string(), { message: "Invalid date format" }).refine(
    (e) => {
      return e.every((d) => dayjs(d).isValid());
    },
    "Invalid date formats",
  ),
  deleteMeetings: z.boolean().default(false),
});
