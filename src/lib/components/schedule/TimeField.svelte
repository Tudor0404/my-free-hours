<script lang="ts">
	import type TimeBlock from '$lib/schedule/values/TimeBlock';
	import type { HoursMinutes } from '$types/HoursMinutes';
	import { timeToMilitaryString } from '$utils/time';
	import FieldContainer from './FieldContainer.svelte';
	import Time from './time-select/Time.svelte';

	export let block: TimeBlock;
	export let onDelete: () => void;
	let start: HoursMinutes = block.start;
	let end: HoursMinutes = block.end;

	let inputStart: string;
	let inputEnd: string;

	// function

	// $: {
	// 	const inpSplit = inputStart.split(":");
	// 	start = {hours: Number.parseInt(inpSplit[0]), minutes: Number.parseInt(inpSplit[1])}
	// }

	// $: {
	// 	const inpSplit = inputEnd.split(":");
	// 	end = {hours: Number.parseInt(inpSplit[0]), minutes: Number.parseInt(inpSplit[1])}
	// }
</script>

<FieldContainer field="Time" operatorChangeable={false} operator="BETWEEN" {onDelete}>
	<Time bind:value={start} maxValue={end} />
	<!-- <input
		class="px-0.5 py-0 h-7 text-sm input w-fit variant-form"
		type="time"
		bind:value={inputStart}
	/> -->
	<span>and</span>
	<!-- <input class="px-0.5 py-0 h-7 text-sm input w-fit variant-form" type="time" /> -->
	<Time bind:value={end} minValue={start} />
</FieldContainer>
