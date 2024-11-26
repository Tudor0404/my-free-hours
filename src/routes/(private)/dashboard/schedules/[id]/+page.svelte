<script lang="ts">
	import RootSchedule from '$lib/components/schedule/RootSchedule.svelte';
	import Schedule from '$lib/schedule/Schedule';

	export let data;

	const s = data.schedule?.schedule as string;
</script>

{#if !data.schedule}
	<span>Unable to retrieve schedule!</span>
{:else}
	<h4>{data.schedule.name}</h4>

	<p>{data.schedule.description}</p>

	<RootSchedule readOnly schedule={Schedule.decode_json(JSON.parse(s.toString()))} />
{/if}
