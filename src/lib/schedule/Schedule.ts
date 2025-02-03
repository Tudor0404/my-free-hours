import dayjs, { type Dayjs } from "dayjs";
import ConditionBlock from "./ConditionBlock";
import type { TimeRange } from "$types/TimeRange";
import TimeBlock from "./values/TimeBlock";
import DayBlock from "./values/DayBlock";
import {
	createTime,
	getAbsoluteTime,
	timeMath,
	timeOp,
	timeToMilitaryString,
} from "$lib/utils/time";
import type { HoursMinutes } from "$types/HoursMinutes";
import type { DaySlotTimes } from "$types/DaySlotTimes";
import type { Condition } from "$types/Schedule.Condition";

export default class Schedule {
	root: ConditionBlock;

	constructor(root?: ConditionBlock) {
		if (root) {
			this.root = root;
		} else {
			this.root = new ConditionBlock();
		}
	}

	public set_restrictions(
		blacklistedDays: Dayjs[],
		bookingSlots: { start: Dayjs; end: Dayjs }[],
	) {
		if (bookingSlots.length === 0 && blacklistedDays.length === 0) {
			return;
		}

		const newRoot = new ConditionBlock("AND", [this.root]);

		if (bookingSlots.length > 0) {
			const booked_slots = bookingSlots.reduce(
				(
					acc: {
						date: dayjs.Dayjs;
						times: { start: dayjs.Dayjs; end: dayjs.Dayjs }[];
					}[],
					slot,
				) => {
					const dateStr = slot.start.format("YYYY-MM-DD");
					const existingDay = acc.find((day) =>
						day.date.format("YYYY-MM-DD") === dateStr
					);

					if (existingDay) {
						existingDay.times.push(slot);
					} else {
						acc.push({
							date: dayjs(dateStr),
							times: [slot],
						});
					}

					return acc;
				},
				[],
			)
				.sort((a, b) => a.date.valueOf() - b.date.valueOf());

			for (let i = 0; i < booked_slots.length; i++) {
				const element = booked_slots[i];

				// start datetime restriction
				// If date, must be outside time section
				// X -> ¬ Y === ¬ X ∨ ¬ Y
				const bookingRestriction = new ConditionBlock("OR", [
					new ConditionBlock("NOT", [new DayBlock("IN", [element.date])]),
					new ConditionBlock("NOT", [
						new ConditionBlock(
							"OR",
							element.times.map((e) =>
								new TimeBlock(
									createTime(e.start.hour(), e.start.minute()),
									createTime(e.end.hour(), e.end.minute()),
								)
							),
						),
					]),
				]);
				newRoot.add_rule(bookingRestriction);
			}
		}

		if (blacklistedDays.length > 0) {
			newRoot.add_rule(
				new ConditionBlock("NOT", [new DayBlock("IN", blacklistedDays)]),
			);
		}

		this.root = newRoot;
	}

	public get_times_within_days(
		start: Dayjs,
		end: Dayjs,
		showEmpty = false,
	): { day: Dayjs; times: TimeRange[] }[] {
		start = start.startOf("day");
		end = end.startOf("day");

		let allowedDates: { day: Dayjs; times: TimeRange[] }[] = [];

		while (start.isSameOrBefore(end)) {
			const res = this.root.evaluate(start);
			if (res.length > 0) {
				allowedDates.push({
					day: start,
					times: res,
				});
			} else if (showEmpty) {
				allowedDates.push({
					day: start,
					times: [],
				});
			}
			start = start.add(1, "day");
		}

		return allowedDates;
	}

	public get_times_at_day(day: Dayjs): TimeRange[] {
		return this.root.evaluate(day.startOf("day"));
	}

	public get_time_slots_within(
		start: Dayjs,
		end: Dayjs,
		interval: HoursMinutes,
	): DaySlotTimes[] {
		let buffer: DaySlotTimes[] = [];

		// construct new schedule
		const newSchedule = new Schedule();

		// root AND
		const rootAnd = new ConditionBlock("AND");

		// original schedule
		rootAnd.add_rule(this.root);

		// start datetime restriction
		// If startday, must be within startTime and end of day
		// X -> Y === ¬ X ∨ Y
		const startRestriction = new ConditionBlock("OR", [
			new ConditionBlock("NOT", [new DayBlock("IN", [start])]),
			new TimeBlock(
				createTime(start.hour(), start.minute()),
				TimeBlock.LATEST_TIME,
			),
		]);
		rootAnd.add_rule(startRestriction);

		// end datetime restriction
		// If endDay, must be within start of day and endTime
		const endRestriction = new ConditionBlock("OR", [
			new ConditionBlock("NOT", [new DayBlock("IN", [end])]),
			new TimeBlock(
				TimeBlock.EARLIEST_TIME,
				createTime(end.hour(), end.minute()),
			),
		]);
		rootAnd.add_rule(endRestriction);

		newSchedule.root = rootAnd;

		const timeRanges = newSchedule.get_times_within_days(start, end);

		for (let i = 0; i < timeRanges.length; i++) {
			let dayBuffer: { start: HoursMinutes; maxDuration: number }[] = [];

			for (let j = 0; j < timeRanges[i].times.length; j++) {
				let curTime: HoursMinutes | false = timeRanges[i].times[j].start;
				// set curTime to the next interval available
				if (curTime.minutes % getAbsoluteTime(interval) !== 0) {
					curTime = timeMath(curTime, "+", {
						hours: 0,
						minutes: getAbsoluteTime(interval) -
							(curTime.minutes % getAbsoluteTime(interval)),
					});
				}

				if (!curTime) break;

				const endTime = timeRanges[i].times[j].end;

				while (timeOp(curTime, "<", endTime)) {
					const duration = timeMath(endTime, "-", curTime);

					if (!duration) break;

					dayBuffer.push({
						start: curTime,
						maxDuration: getAbsoluteTime(duration),
					});

					const newTime = timeMath(curTime, "+", interval);

					if (!newTime) break;

					curTime = newTime;
				}
			}

			buffer.push({ day: timeRanges[i].day.toDate(), times: dayBuffer });
		}

		return buffer;
	}

	public encode_json(): Record<string, any> {
		return this.root.encode_json();
	}

	public verify() {
		return this.root.verify();
	}

	public static decode_json(obj: Record<string, any>): Schedule {
		let s = new Schedule();

		s.root = ConditionBlock.decode_json(obj);

		return s;
	}
}

interface SubgraphEvaluation {
	id: string;
	condition: Condition;
	schedule: Schedule;
	times: TimeRange[];
}

interface SubgraphReturn {
	id: string;
	condition: Condition;
	times: string[];
	rules?: SubgraphReturn[];
}

export class ScheduleDebug {
	static evaluateSubgraphs(schedule: Schedule, date: Dayjs): SubgraphReturn {
		const root = this.buildSubgraphHierarchy(schedule.root, "1");
		return this.evaluateHierarchy(root, date);
	}

	private static formatTimeRange(timeRange: TimeRange): string {
		return `${timeToMilitaryString(timeRange.start)} - ${
			timeToMilitaryString(timeRange.end)
		}`;
	}

	private static buildSubgraphHierarchy(
		block: ConditionBlock,
		id: string,
	): SubgraphEvaluation & { rules?: SubgraphEvaluation[] } {
		const schedule = new Schedule(block);
		const node: SubgraphEvaluation & { rules?: SubgraphEvaluation[] } = {
			id,
			condition: block.condition,
			schedule,
			times: [],
		};

		const childBlocks = block.rules
			.map((rule, index) =>
				rule instanceof ConditionBlock
					? this.buildSubgraphHierarchy(rule, `${id}.${index + 1}`)
					: null
			)
			.filter((x): x is SubgraphEvaluation => x !== null);

		if (childBlocks.length > 0) {
			node.rules = childBlocks;
		}

		return node;
	}

	private static evaluateHierarchy(
		node: SubgraphEvaluation & { rules?: SubgraphEvaluation[] },
		date: Dayjs,
	): SubgraphReturn {
		const result: SubgraphReturn = {
			id: node.id,
			condition: node.condition,
			times: node.schedule.get_times_at_day(date).map((time) =>
				this.formatTimeRange(time)
			),
		};

		if (node.rules) {
			result.rules = node.rules.map((child) =>
				this.evaluateHierarchy(child, date)
			);
		}

		return result;
	}
}
