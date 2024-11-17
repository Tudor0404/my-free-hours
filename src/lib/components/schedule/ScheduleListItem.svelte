<script lang="ts">
	import Schedule from '$lib/schedule/Schedule';
	import type { Database } from '$types/database.types';
	import Icon from '@iconify/svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import MasonaryCard from '../container/MasonaryCard.svelte';
	import { invalidate } from '$app/navigation';

	export let data: Database['public']['Tables']['schedule']['Row'];

	const toastStore = getToastStore();

	const previewModal: ModalSettings = {
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

	const deleteModal: ModalSettings = {
		type: 'confirm',
		title: 'Confirm Delete',
		body: 'Are you sure you want to delete this schedule?',
		response: async (r: boolean) => {
			if (!r) return;

			const res = await fetch('/api/schedule/delete/' + data.id, {
				method: 'DELETE'
			});

			console.log(res);

			if (res.status == 200) {
				toastStore.trigger({
					message: 'Schedule deleted successfully!',
					background: 'variant-filled-success'
				});
				invalidate('supabase:db:schedule');

				modalStore.close();
			} else {
				toastStore.trigger({
					message: await res.text(),
					background: 'variant-filled-error'
				});
			}
		}
	};

	const descriptionModal: ModalSettings = {
		type: 'component',
		component: 'Text',
		meta: {
			text: data.description,
			title: 'Description'
		}
	};

	const modalStore = getModalStore();
</script>

<MasonaryCard>
	<div class="flex flex-row justify-start items-center">
		<span class="flex-grow font-medium">{data.name}</span>

		<button
			class="p-0 btn-icon btn-icon-sm variant-outline-error hover:variant-filled-error"
			type="button"
			on:click={() => modalStore.trigger(deleteModal)}
		>
			<Icon icon="tabler:trash" />
		</button>
	</div>

	<div class="flex flex-col gap-1">
		<button
			class={'chip variant-outline-secondary hover:variant-filled-secondary'}
			on:click={() => modalStore.trigger(previewModal)}
			type="button"
		>
			<span>Schedule</span>
		</button>
		<button
			class={'chip ' +
				(data.description
					? 'variant-outline-secondary hover:variant-filled-secondary'
					: 'variant-outline-surface cursor-default')}
			type="button"
			on:click={() => modalStore.trigger(descriptionModal)}
		>
			<span>Description</span>
		</button>
	</div>
</MasonaryCard>
