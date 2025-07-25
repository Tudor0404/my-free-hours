import type { Condition } from '$types/Schedule.Condition';
import { type Dayjs } from 'dayjs';
import ValueBlock from './values/ValueBlock';
import type { TimeRange } from '$types/TimeRange';
import TimeBlock from './values/TimeBlock';
import type { Field } from '$types/Schedule.Field';
import DateBlock from './values/DateBlock';
import ScheduleBlock from './values/ScheduleBlock';
import DayOfWeekBlock from './values/DayOfWeekBlock';
import MonthBlock from './values/MonthBlock';
import DayBlock from './values/DayBlock';

export type Rule = ConditionBlock | ValueBlock<any> | ScheduleBlock | TimeBlock;

export default class ConditionBlock {
	condition: Condition;
	rules: Rule[];
	private cached_rules: Rule[] | null = null;

	constructor(condition: Condition = 'AND', rules: Rule[] = []) {
		this.condition = condition;
		this.rules = rules;
	}

	//Returns the rules array such that ValueBlocks are prioritised (quicker to evaluate)
	private get sorted_rules(): Rule[] {
		if (this.cached_rules == null) {
			this.cached_rules = this.rules.toSorted((item1, item2) => {
				if (item1 instanceof ValueBlock) {
					return -1;
				} else if (item2 instanceof ValueBlock) {
					return 1;
				}
				return 0;
			});
		}

		return this.cached_rules;
	}

	public clone() {
		return new ConditionBlock(
			this.condition,
			this.rules.map((r): Rule => r.clone())
		);
	}

	public add_rule(rule: Rule, index: number | undefined = undefined): boolean {
		if (this.condition == 'NOT' && this.rules.length == 1) {
			return false;
		}

		if (index && index >= 0 && index < this.rules.length) {
			this.rules.splice(index, 0, rule);
		} else {
			this.rules.push(rule);
		}

		this.cached_rules = null;
		return true;
	}

	public delete_rule(index: number): boolean {
		if (index >= this.rules.length) {
			return false;
		}

		this.rules.splice(index, 1);
		this.cached_rules = null;
		return true;
	}

	public set_condition(condition: Condition): boolean {
		if (condition == 'NOT' && this.rules.length > 1) {
			return false;
		}

		this.condition = condition;
		return true;
	}

	public evaluate(date: Dayjs): TimeRange[] {
		let validRanges: TimeRange[] = [];
		switch (this.condition) {
			case 'OR':
				if (this.rules.length == 0) {
					return [];
				}

				for (let i = 0; i < this.sorted_rules.length; i++) {
					const r = this.sorted_rules[i];

					if (r instanceof ConditionBlock || r instanceof ScheduleBlock) {
						const evaluatedRanges = r.evaluate(date);

						if (validRanges.length === 0) {
							validRanges = evaluatedRanges;
						} else {
							validRanges = TimeBlock.time_disjunction(validRanges, evaluatedRanges);
						}
					} else if (r instanceof ValueBlock) {
						if (r.verify_date(date)) {
							validRanges = [TimeBlock.FULL_TIME_RANGE];
						}
					} else if (r instanceof TimeBlock) {
						if (validRanges.length === 0 && i === 0) {
							validRanges = [r.timeRange];
						} else {
							validRanges = TimeBlock.time_disjunction(validRanges, [r.timeRange]);
						}
					} else {
						throw new Error('Not yet implemented');
					}
				}

				return validRanges;

			case 'AND':
				if (this.rules.length == 0) {
					return [TimeBlock.FULL_TIME_RANGE];
				}

				for (let i = 0; i < this.sorted_rules.length; i++) {
					const r = this.sorted_rules[i];

					if (r instanceof ConditionBlock || r instanceof ScheduleBlock) {
						const evaluatedRanges = r.evaluate(date);

						if (evaluatedRanges.length === 0) {
							return [];
						} else {
							if (validRanges.length === 0 && i === 0) {
								validRanges = evaluatedRanges;
							} else {
								validRanges = TimeBlock.time_conjunction(validRanges, evaluatedRanges);
							}
						}
					} else if (r instanceof ValueBlock) {
						if (!r.verify_date(date)) {
							return [];
						} else {
							if (validRanges.length === 0) {
								validRanges = [TimeBlock.FULL_TIME_RANGE];
							} else {
								validRanges = validRanges;
							}
						}
					} else if (r instanceof TimeBlock) {
						if (validRanges.length === 0) {
							validRanges = [r.timeRange];
						} else {
							validRanges = TimeBlock.time_conjunction(validRanges, [r.timeRange]);
						}
					} else {
						throw new Error('Not yet implemented');
					}
				}

				return validRanges;

			case 'NOT':
				if (this.rules.length > 1) {
					throw new Error(`NOT condition can only have one element within`);
				} else if (this.rules.length == 0) {
					return [TimeBlock.FULL_TIME_RANGE];
				}

				const r = this.rules[0];

				if (r instanceof ConditionBlock || r instanceof ScheduleBlock) {
					const evaluatedRanges = r.evaluate(date);

					if (evaluatedRanges.length === 0) {
						return [TimeBlock.FULL_TIME_RANGE];
					} else {
						return TimeBlock.time_negation(evaluatedRanges);
					}
				} else if (r instanceof ValueBlock) {
					if (!r.verify_date(date)) {
						return [TimeBlock.FULL_TIME_RANGE];
					} else {
						return [];
					}
				} else if (r instanceof TimeBlock) {
					return TimeBlock.time_negation([r.timeRange]);
				} else {
					throw new Error('Not yet implemented');
				}

			default:
				throw new Error(`Condition ${this.condition} is not handled properly`);
		}
	}

	public verify(): boolean {
		for (let i = 0; i < this.rules.length; i++) {
			const rule = this.rules[i];
			if (
				rule instanceof ValueBlock ||
				rule instanceof TimeBlock ||
				rule instanceof ConditionBlock ||
				rule instanceof ScheduleBlock
			) {
				if (!rule.verify()) {
					return false;
				}
			} else {
				return false;
			}
		}

		return true;
	}

	public encode_json(): Record<string, any> {
		return {
			condition: this.condition,
			rules: this.rules.map((r) => {
				return r.encode_json();
			})
		};
	}

	public static decode_json(obj: Record<string, any>): ConditionBlock {
		let c = new ConditionBlock();

		// get condition
		if (obj.hasOwnProperty('condition')) {
			if (['AND', 'OR', 'NOT'].includes(obj['condition'] as Condition)) {
				c.condition = obj['condition'];
			} else {
				throw new Error("Condition in condition block is not 'AND', 'OR', or 'NOT'");
			}
		} else {
			throw new Error("Condition block does not have 'condition' field");
		}

		// get rules
		let rules: Rule[] = [];
		if (obj.hasOwnProperty('rules') && obj['rules'] instanceof Array) {
			for (let i = 0; i < obj['rules'].length; i++) {
				const rule = obj['rules'][i];

				if (rule.hasOwnProperty('field')) {
					switch (rule['field'] as Field) {
						case 'DATE':
							rules.push(DateBlock.decode_json(rule));
							break;
						case 'DAY_OF_WEEK':
							rules.push(DayOfWeekBlock.decode_json(rule));
							break;
						case 'MONTH':
							rules.push(MonthBlock.decode_json(rule));
							break;
						case 'DAY':
							rules.push(DayBlock.decode_json(rule));
							break;
						case 'TIME':
							rules.push(TimeBlock.decode_json(rule));
							break;
						case 'SCHEDULE':
							rules.push(ScheduleBlock.decode_json(rule));
							break;
					}
				} else if (rule.hasOwnProperty('condition')) {
					rules.push(ConditionBlock.decode_json(rule));
				} else {
					throw new Error('Unrecognised rule');
				}
			}
		} else {
			throw new Error('Condition block does not have a rules array');
		}

		c.rules = rules;

		return c;
	}
}
