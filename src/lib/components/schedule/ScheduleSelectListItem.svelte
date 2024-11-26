<script lang="ts">
	import type { Database } from '$types/database.types';
	import Icon from '@iconify/svelte';

	export let data: Database['public']['Tables']['schedule']['Row'];

	export let scheduleCallback: () => void;
	export let selected: boolean = false;
</script>

<div
	class="grid w-full rounded-md overflow-clip shadow-sm cursor-pointer grid-cols-[1fr_auto_auto] h-8 box-border"
>
	<button
		class="flex items-center pl-2 w-full h-full duration-100 bg-surface-300 hover:bg-surface-400 schedule-search-list-item"
		on:click={scheduleCallback}
		type="button"
	>
		<span
			class={'max-w-full text-ellipsis text-start ' +
				(selected ? 'font-semibold text-primary-600' : '')}>{data.name}</span
		>
	</button>

	{#if data.user_id}
		<div class="p-2 cursor-default variant-filled-error" aria-details="private schedule">
			<Icon icon="tabler:lock" />
		</div>
	{:else}
		<div class="p-2 cursor-default variant-filled-success" aria-details="public schedule">
			<Icon icon="tabler:lock-open" />
		</div>
	{/if}

	<a
		class="p-2 h-full variant-filled-primary aspect-square"
		type="button"
		href={'/dashboard/schedules/' + data.id}
		target="_blank"
	>
		<Icon icon="tabler:eye" />
	</a>
</div>
