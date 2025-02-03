<script lang="ts">
	import type ScheduleBlock from '$lib/schedule/values/ScheduleBlock';
	import FieldContainer from './FieldContainer.svelte';
	import SelectSchedule from '$lib/components/schedule/SelectSchedule.svelte';
	import type { Database } from '$types/database.types';
	import { schedulesStore } from '$lib/stores/schedules';

	export let block: ScheduleBlock;
	export let onDelete: () => void;
	export let readOnly: boolean = false;
	export let schedules: Database['public']['Tables']['schedule']['Row'][] | null;

	let scheduleID: number = block.id;

	$: {
		block.set_schedule(scheduleID);
		block.id = block.id;
	}
</script>

<FieldContainer
	field="Schedule ID"
	operatorChangeable={false}
	operator="IN"
	{onDelete}
	{readOnly}
	showOperator={false}
>
	<SelectSchedule
		schedules={(schedules?.length || 0 > 0 ? schedules : schedulesStore.getAsArray()) || []}
		sendScheduleID={(id) => {
			scheduleID = id;
		}}
		initialID={block.id}
		small
		tertiaryOutline
		disabled={readOnly}
	/>
</FieldContainer>
