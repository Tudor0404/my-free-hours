import dayjs from 'dayjs';
import Schedule from './Schedule';
import DayOfWeekBlock from './values/DayOfWeekBlock';
import DateBlock from './values/DateBlock';
import ConditionBlock from './ConditionBlock';
import DayBlock from './values/DayBlock';

export default function test() {
	let s = new Schedule();

	s.root.add_rule(new DayOfWeekBlock('BETWEEN', [1, 5]));
	s.root.add_rule(new DateBlock('BETWEEN', [1, 15]));

	let c = new ConditionBlock('NOT');
	c.add_rule(new DayBlock('IN', [dayjs('5 11 2024', 'D M YYYY', true)]));

	s.root.add_rule(c);

	const allowed = s.get_dates(dayjs(), dayjs().add(1, 'year'));

	console.log(JSON.stringify(s.root.get_object(), null, 2));

	for (let i = 0; i < allowed.length; i++) {
		const element = allowed[i];
		console.log(element.format('ddd D/M/YYYY'));
	}
}
