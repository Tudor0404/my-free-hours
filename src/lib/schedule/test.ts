import dayjs from "dayjs";
import Schedule, { ScheduleDebug } from "./Schedule";
import ConditionBlock from "./ConditionBlock";
import DayBlock from "./values/DayBlock";
import TimeBlock from "./values/TimeBlock";
import { createTime } from "$lib/utils/time";

export default function test() {
	const schedule = Schedule.decode_json(
		JSON.parse(
			'{"condition":"AND","rules":[{"condition":"AND","rules":[{"condition":"AND","rules":[{"field":"SCHEDULE","operator":"IN","values":[63]},{"field":"SCHEDULE","operator":"IN","values":[46]}]},{"condition":"OR","rules":[{"condition":"NOT","rules":[{"field":"DAY","operator":"IN","values":["2025-01-22T00:00:00.000Z"]}]},{"condition":"NOT","rules":[{"condition":"OR","rules":[{"field":"TIME","operator":"BETWEEN","values":[{"hours":10,"minutes":45},{"hours":11,"minutes":30}]}]}]}]}]},{"condition":"OR","rules":[{"condition":"NOT","rules":[{"field":"DAY","operator":"IN","values":["2025-01-16T00:00:00.000Z"]}]},{"field":"TIME","operator":"BETWEEN","values":[{"hours":17,"minutes":5},{"hours":24,"minutes":0}]}]},{"condition":"OR","rules":[{"condition":"NOT","rules":[{"field":"DAY","operator":"IN","values":["2025-07-17T23:00:00.000Z"]}]},{"field":"TIME","operator":"BETWEEN","values":[{"hours":0,"minutes":0},{"hours":8,"minutes":35}]}]}]}',
		),
	);

	const data = ScheduleDebug.evaluateSubgraphs(
		schedule,
		dayjs().startOf("day").set("date", 21),
	);

	console.log(JSON.stringify(data));
}
