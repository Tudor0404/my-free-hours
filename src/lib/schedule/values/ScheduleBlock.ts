import type { TimeRange } from "$types/TimeRange";
import type { Dayjs } from "dayjs";
import { schedulesStore } from "$lib/stores/schedules";
import Schedule from "../Schedule";

export default class ScheduleBlock {
	field: string = "SCHEDULE";
	id: number;
	cachedSchedule: Schedule | null = null;

	constructor(id: number) {
		this.id = id;
	}

	public evaluate(date: Dayjs): TimeRange[] {
		if (this.cachedSchedule === null) {
			const s = schedulesStore.getSchedule(this.id);

			if (s === null) {
				throw new Error("Schedule not found");
			}

			this.cachedSchedule = Schedule.decode_json(
				JSON.parse((s.schedule as string).toString()),
			);
		}

		return this.cachedSchedule.root.evaluate(date);
	}

	public set_schedule(id: number) {
		this.id = id;
		this.cachedSchedule = null;
	}

	public verify(): boolean {
		return schedulesStore.getSchedule(this.id) !== null;
	}

	public encode_json(): Record<string, any> {
		return {
			field: "SCHEDULE",
			operator: "IN",
			values: [this.id],
		};
	}

	public static decode_json(obj: Record<string, any>): ScheduleBlock {
		let s: ScheduleBlock;

		if (!(obj.hasOwnProperty("operator") && obj["operator"] == "IN")) {
			throw new Error(
				"A schedule block should have an operator with a value of IN",
			);
		}

		if (obj.hasOwnProperty("values") && obj["values"] instanceof Array) {
			if (obj["values"].length == 1) {
				const id = Number.parseInt(obj["values"][0]);
				if (id === Number.NaN) {
					throw new Error("Value in values field must be a number");
				}
				s = new ScheduleBlock(id);
			} else {
				throw new Error(
					"Only 1 value must be in the values field on a schedule block",
				);
			}
		} else {
			throw new Error("No values field found in schedule block");
		}

		return s;
	}
}
