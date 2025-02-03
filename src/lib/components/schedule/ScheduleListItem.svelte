<script lang="ts">
	import Schedule from '$lib/schedule/Schedule';
	import type { Database } from '$types/database.types';
	import Icon from '@iconify/svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import MasonaryCard from '../container/MasonaryCard.svelte';
	import { invalidate } from '$app/navigation';

	export let data: Database['public']['Tables']['schedule']['Row'];
	export let editCallback: (() => void) | null = null;

	const toastStore = getToastStore();

	const deleteModal: ModalSettings = {
		type: 'confirm',
		title: 'Confirm Delete',
		body: 'Are you sure you want to delete this schedule?',
		response: async (r: boolean) => {
			if (!r) return;

			const res = await fetch('/api/schedule/delete/' + data.id, {
				method: 'DELETE'
			});

			if (res.status == 200) {
				toastStore.trigger({
					message: 'Schedule deleted successfully!',
					background: 'variant-filled-success'
				});
				invalidate('supabase:db:schedule');

				modalStore.close();
			} else {
				toastStore.trigger({
					message: (await res.json()).message,
					background: 'variant-filled-error'
				});
			}
		}
	};

	const modalStore = getModalStore();
</script>

<MasonaryCard>
	<div class="flex flex-row gap-1 justify-start items-center">
		<span class="flex-grow font-medium">{data.name}</span>
		<button
			class="p-1.5 btn btn-sm aspect-square variant-glass-error enabled:hover:variant-filled-error"
			type="button"
			disabled={!data.user_id}
			on:click={() => modalStore.trigger(deleteModal)}
		>
			<Icon icon="tabler:trash" />
		</button>
		<button
			class="p-1.5 btn btn-sm aspect-square variant-glass-warning enabled:hover:variant-filled-warning"
			on:click={editCallback}
			disabled={!editCallback}
		>
			<Icon icon="tabler:edit" />
		</button>

		<a
			class="p-1.5 btn btn-sm aspect-square variant-glass-success hover:variant-filled-success"
			href={`/dashboard/schedules/${data.id}`}
		>
			<Icon icon="tabler:external-link" />
		</a>
	</div>

	{#if data.description}
		<p class="mt-1 font-light line-clamp-3">{data.description}</p>
	{/if}
</MasonaryCard>
