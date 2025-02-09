<svelte:head>
	<title>MFH: '{data.schedule?.name}' Schedule</title>
</svelte:head>

<script lang="ts">
	import RootSchedule from '$lib/components/schedule/RootSchedule.svelte';
	import Schedule from '$lib/schedule/Schedule';
	import { schedulesStore } from '$lib/stores/schedules.js';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let data;

	onMount(async () => {
		await schedulesStore.refresh();
	});

	const s = data.schedule?.schedule as string;
</script>

<div>
	<h3>
		<a href="/dashboard/schedules" class="flex flex-row gap-2 justify-start items-center"
		>
			<Icon icon="tabler:arrow-left" />
			Back to all schedules</a
		>
	</h3>
</div>

<div class="flex flex-col gap-2 mt-4">
	{#if !data.schedule}
		<p>Unable to retrieve schedule!</p>
	{:else}
		<h4 class="font-medium">{data.schedule.name}</h4>

		<p class="font-light">{data.schedule.description}</p>

		{#if Object.keys($schedulesStore).length > 0}
			<RootSchedule readOnly schedule={Schedule.decode_json(JSON.parse(s.toString()))} />
		{/if}
	{/if}
</div>
