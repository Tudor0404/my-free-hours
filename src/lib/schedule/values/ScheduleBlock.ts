import type TimeBlock from './TimeBlock';

export default class ScheduleBlock {
	field: string = 'SCHEDULE';
	id: number;

	constructor(id: number) {
		this.id = id;
	}

	public static decode_json(obj: Record<string, any>): ScheduleBlock {
		return new ScheduleBlock(-1);
	}
}
