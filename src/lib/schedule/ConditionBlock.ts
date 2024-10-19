import type { Condition } from '$types/Schedule.Condition';
import type { Dayjs } from 'dayjs';
import ValueBlock from './values/ValueBlock';

export default class ConditionBlock {
	private condition: Condition;
	private rules: (ConditionBlock | ValueBlock<any> | string)[];
	private cached_rules: (ConditionBlock | ValueBlock<any> | string)[] | null = null;

	/**
	 * Returns the rules array such that ValueBlocks are prioritised (quicker to evaluate)
	 */
	get sorted_rules(): (ConditionBlock | ValueBlock<any> | string)[] {
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

	public add_rule(rule: ConditionBlock | ValueBlock<any>): boolean {
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

		this.rules = [...this.rules.slice(0, index), ...this.rules.slice(index + 1, this.rules.length)];
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

	public evaluate(date: Dayjs): boolean {
		switch (this.condition) {
			case 'OR':
				for (let i = 0; i < this.sorted_rules.length; i++) {
					const r = this.sorted_rules[i];

					if (r instanceof ConditionBlock) {
						if (r.evaluate(date)) {
							return true;
						}
					} else if (r instanceof ValueBlock) {
						if (r.verify_date(date)) {
							return true;
						}
					} else {
						throw new Error('Not yet implemented');
					}
				}

				return false;

			case 'AND':
				for (let i = 0; i < this.sorted_rules.length; i++) {
					const r = this.sorted_rules[i];

					if (r instanceof ConditionBlock) {
						if (!r.evaluate(date)) {
							return false;
						}
					} else if (r instanceof ValueBlock) {
						if (!r.verify_date(date)) {
							return false;
						}
					} else {
						throw new Error('Not yet implemented');
					}
				}

				return true;

			case 'NOT':
				if (this.rules.length > 1) {
					throw new Error(`NOT condition can only have one element within`);
				} else if (this.rules.length == 0) {
					return true;
				}

				const r = this.rules[0];

				if (r instanceof ConditionBlock) {
					return !r.evaluate(date);
				} else if (r instanceof ValueBlock) {
					return !r.verify_date(date);
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
