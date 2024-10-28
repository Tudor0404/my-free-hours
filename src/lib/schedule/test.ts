import dayjs from 'dayjs';
import Schedule from './Schedule';
import DayOfWeekBlock from './values/DayOfWeekBlock';
import DateBlock from './values/DateBlock';
import ConditionBlock from './ConditionBlock';
import DayBlock from './values/DayBlock';
import TimeBlock from './values/TimeBlock';
import ValueBlock from './values/ValueBlock';

export default function test() {
	const s = new Schedule();

	const c = new ConditionBlock('AND');
	c.add_rule(new DayOfWeekBlock('BETWEEN', [0, 4]));
	c.add_rule(new DateBlock('BETWEEN', [0, 15]));

	const c2 = new ConditionBlock('OR');
	c2.add_rule(new TimeBlock({ hours: 9, minutes: 0 }, { hours: 13, minutes: 0 }));
	c2.add_rule(new TimeBlock({ hours: 14, minutes: 0 }, { hours: 17, minutes: 0 }));

	c.add_rule(c2);
	c.add_rule(new TimeBlock({ hours: 10, minutes: 0 }, { hours: 16, minutes: 0 }));

	s.root = c;

	const res = s.get_times_within(dayjs(), dayjs().add(1, 'year'));
}
