import dayjs from 'dayjs';
import Schedule, { ScheduleDebug } from './Schedule';
import ConditionBlock from './ConditionBlock';
import DayBlock from './values/DayBlock';
import TimeBlock from './values/TimeBlock';
import { createTime } from '$lib/utils/time';

export default function test() {
	const jsonS =
		'{"condition":"AND","rules":[{"field":"DAY_OF_WEEK","operator":"IN","values":[1,2,4]},{"field":"TIME","operator":"BETWEEN","values":[{"hours":7,"minutes":0},{"hours":13,"minutes":0}]}]}';
	const s = Schedule.decode_json(JSON.parse(jsonS));

	const start = dayjs().add(30, 'minutes');
	const end = dayjs().add(262980, 'minutes');

	const newSchedule = new Schedule();

	// root AND
	const rootAnd = new ConditionBlock('AND');

	// original schedule
	rootAnd.add_rule(s.root);

	const startRestriction = new ConditionBlock('OR', [
		new ConditionBlock('NOT', [new DayBlock('IN', [start])]),
		new TimeBlock(createTime(start.hour(), start.minute()), TimeBlock.LATEST_TIME)
	]);
	rootAnd.add_rule(startRestriction);

	const endRestriction = new ConditionBlock('OR', [
		new ConditionBlock('NOT', [new DayBlock('IN', [end])]),
		new TimeBlock(TimeBlock.EARLIEST_TIME, createTime(end.hour(), end.minute()))
	]);
	rootAnd.add_rule(endRestriction);

	newSchedule.root = rootAnd;

	const data = ScheduleDebug.evaluateSubgraphs(newSchedule, dayjs().startOf('day'));

	console.log(JSON.stringify(data));
}
