<script lang="ts">
	import type TimeBlock from '$lib/schedule/values/TimeBlock';
	import type { HoursMinutes } from '$types/HoursMinutes';
	import { timeToMilitaryString } from '$utils/time';
	import FieldContainer from './FieldContainer.svelte';
	import Time from './time-select/Time.svelte';

	export let block: TimeBlock;
	export let onDelete: () => void;
	export let readOnly: boolean = false;
	let start: HoursMinutes = block.start;
	let end: HoursMinutes = block.end;
</script>

<FieldContainer field="Time" operatorChangeable={false} operator="BETWEEN" {onDelete} {readOnly}>
	<Time bind:value={start} maxValue={end} {readOnly} />

	<span>and</span>

	<Time bind:value={end} minValue={start} {readOnly} />
</FieldContainer>
