import dayjs from 'dayjs';
import Schedule from './Schedule';
import DayOfWeekBlock from './values/DayOfWeekBlock';

export default function test() {
	let s = new Schedule();

	let mon_tue = new DayOfWeekBlock('IN', [1, 2]);

	s.root.add_rule(mon_tue);

	const allowed = s.get_dates(dayjs(), dayjs().add(1, 'month'));

	console.log(allowed);
}
