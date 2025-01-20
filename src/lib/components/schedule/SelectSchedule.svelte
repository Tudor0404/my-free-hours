<script lang="ts">
	import type { Database } from '$types/database.types';
	import { flip } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Fuse from 'fuse.js';
	import ScheduleSelectListItem from './ScheduleSelectListItem.svelte';
	import { onMount } from 'svelte';

	export let schedules: Database['public']['Tables']['schedule']['Row'][];
	export let sendScheduleID: (id: number) => void;
	export let initialID: number | null = null;
	export let small: boolean = false;
	export let tertiaryOutline: boolean = false;
	export let disabled: boolean = false;

	let selectedSchedule: Database['public']['Tables']['schedule']['Row'] | null = null;
	let scheduleSearch: string = '';
	let isOpen: boolean = false;

	onMount(() => {
		if (initialID) {
			selectedSchedule = schedules.find((e) => e.id == initialID) || null;
		}
	});

	const target = 'schedulePopup' + Math.random();

	const schedulePopup: PopupSettings = {
		event: 'click',
		target: target,
		placement: 'bottom',
		middleware: { flip },
		closeQuery: '.schedule-search-list-item',
		state: (s) => {
			isOpen = s.state;
		}
	};

	$: fuse = new Fuse(schedules, {
		keys: [{ name: 'name', weight: 3 }, 'description']
	});

	$: scheduleSearchResults = fuse.search(scheduleSearch);

	function setSchedule(s: Database['public']['Tables']['schedule']['Row']) {
		selectedSchedule = s;

		sendScheduleID(s.id);
	}
</script>

<button
	class={`flex flex-row justify-between btn ${small ? 'py-0.5 px-1' : ''} ${tertiaryOutline ? 'variant-outline-tertiary' : 'variant-outline-surface'}`}
	use:popup={schedulePopup}
	type="button"
	{disabled}
>
	<span>{selectedSchedule?.name ?? 'Select a schedule'}</span>
	<Icon
		icon="tabler:chevron-down"
		class={'h-full duration-200 ' + (isOpen ? 'rotate-180' : 'rotate-0')}
	/>
</button>

<div class="z-10 p-2 py-2 w-72 shadow-xl card" data-popup={target}>
	<div class="flex flex-row gap-2 w-full">
		<input
			class="input"
			placeholder="Search for a schedule..."
			type="text"
			bind:value={scheduleSearch}
			{disabled}
		/>
		<button
			class="btn btn-sm variant-filled-surface"
			type="button"
			on:click={() => (scheduleSearch = '')}>Clear</button
		>
	</div>

	<div class="overflow-y-auto py-2 space-y-2 w-full h-60 z-100">
		{#if schedules.length == 0}
			<div class="flex justify-center items-center h-full">
				<Icon icon="tabler:loader-2" class="w-7 h-7 animate-spin text-surface-800" />
			</div>
		{:else if scheduleSearchResults.length == 0}
			{#if scheduleSearch.length == 0}
				{#each schedules as schedule}
					<ScheduleSelectListItem
						data={schedule}
						scheduleCallback={() => setSchedule(schedule)}
						selected={selectedSchedule?.id === schedule.id}
					/>
				{/each}
			{:else}
				<div class="flex justify-center items-center h-full">
					<span class="text-surface-700">Try another search query!</span>
				</div>
			{/if}
		{:else}
			{#each scheduleSearchResults as schedule}
				<ScheduleSelectListItem
					data={schedule.item}
					scheduleCallback={() => setSchedule(schedule.item)}
					selected={selectedSchedule?.id === schedule.item.id}
				/>
			{/each}
		{/if}
	</div>

	<div class="arrow bg-surface-100-800-token" />
</div>
