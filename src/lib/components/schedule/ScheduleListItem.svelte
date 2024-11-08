<script lang="ts">
	import Schedule from '$lib/schedule/Schedule';
	import type { Database } from '$types/database.types';
	import Icon from '@iconify/svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	export let data: Database['public']['Tables']['schedule']['Row'];

	const modal: ModalSettings = {
		type: 'component',
		component: 'SchedulePreview',
		meta: {
			schedule: Schedule.decode_json(JSON.parse((data.schedule as string).toString())),
			name: data.name,
			description: data.description,
			created_at: data.created_at,
			id: data.id
		}
	};

	const modalStore = getModalStore();
</script>

<div class="p-2 w-full card grid grid-cols-[1fr_auto] gap-2 break-inside-avoid mb-2">
	<span class="font-semibold">{data.name}</span>
	<button
		on:click={() => modalStore.trigger(modal)}
		class="p-2 btn btn-sm variant-ghost-surface w-fit aspect-square"
		type="button"><Icon icon="tabler:dots-vertical" /></button
	>
	{#if data.description}
		<div class="col-span-2 line-clamp-2">{data.description}</div>
	{/if}
</div>
