import type { Condition } from '$types/Schedule.Condition';
import dayjs, { type Dayjs } from 'dayjs';
import ValueBlock from './values/ValueBlock';
import type { TimeRange } from '$types/TimeRange';
import TimeBlock from './values/TimeBlock';

type Rule = ConditionBlock | ValueBlock<any> | string | TimeBlock;

export default class ConditionBlock {
	private condition: Condition;
	rules: Rule[];
	private cached_rules: Rule[] | null = null;

	/**
	 * Returns the rules array such that ValueBlocks are prioritised (quicker to evaluate)
	 */
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

	constructor(condition?: Condition) {
		if (condition === undefined) {
			this.condition = 'AND';
		} else {
			this.condition = condition;
		}

		this.rules = [];
	}

	public add_rule(rule: Rule): boolean {
		if (this.condition == 'NOT' && this.rules.length == 1) {
			return false;
		}

		this.rules.push(rule);
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

					if (r instanceof ConditionBlock) {
						const evaluatedRanges = r.evaluate(date);

						if (validRanges.length == 0) {
							validRanges = evaluatedRanges;
						} else {
							validRanges = TimeBlock.time_disjunction(validRanges, evaluatedRanges);
						}
					} else if (r instanceof ValueBlock) {
						if (r.verify_date(date)) {
							validRanges = [TimeBlock.FULL_TIME_RANGE];
						}
					} else if (r instanceof TimeBlock) {
						if (validRanges.length == 0) {
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

					if (r instanceof ConditionBlock) {
						const evaluatedRanges = r.evaluate(date);

						if (evaluatedRanges.length == 0) {
							return [];
						} else {
							if (validRanges.length == 0) {
								validRanges = evaluatedRanges;
							} else {
								validRanges = TimeBlock.time_conjunction(validRanges, evaluatedRanges);
							}
						}
					} else if (r instanceof ValueBlock) {
						if (!r.verify_date(date)) {
							return [];
						} else {
							if (validRanges.length == 0) {
								validRanges = [TimeBlock.FULL_TIME_RANGE];
							} else {
								validRanges = validRanges;
							}
						}
					} else if (r instanceof TimeBlock) {
						if (validRanges.length == 0) {
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

				if (r instanceof ConditionBlock) {
					const evaluatedRanges = r.evaluate(date);

					if (evaluatedRanges.length == 0) {
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

	public get_object(): Object {
		return {
			condition: this.condition,
			rules: this.rules.map((r) => {
				if (r instanceof ConditionBlock || r instanceof ValueBlock) {
					return r.get_object();
				} else {
					return {
						schedule_id: r
					};
				}
			})
		};
	}
}
