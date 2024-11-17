<script lang="ts">
	import type { BookingTypeWithDurations } from '$types/BookingTypeWithDurations';
	import { durationToString, minutesToDuration } from '$utils/time';
	import Icon from '@iconify/svelte';
	import {
		getModalStore,
		getToastStore,
		SlideToggle,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import MasonaryCard from '../container/MasonaryCard.svelte';
	import { invalidate } from '$app/navigation';

	export let data: BookingTypeWithDurations;

	const toastStore = getToastStore();

	const descriptionModal: ModalSettings = {
		type: 'component',
		component: 'Text',
		meta: {
			text: data.description,
			title: 'Description'
		}
	};

	const preModal: ModalSettings = {
		type: 'component',
		component: 'Text',
		meta: {
			text: data.pre_notification,
			title: 'Pre-notification'
		}
	};

	const postModal: ModalSettings = {
		type: 'component',
		component: 'Text',
		meta: {
			text: data.post_notification,
			title: 'Post-notification'
		}
	};

	const deleteModal: ModalSettings = {
		type: 'confirm',
		title: 'Confirm Delete',
		body: 'Are you sure you want to delete this meeting type? All bookings that reference this meeting type will also be deleted.',
		response: async (r: boolean) => {
			if (!r) return;

			const res = await fetch('/api/booking/type/delete/' + data.id, {
				method: 'DELETE'
			});

			console.log(res);

			if (res.status == 200) {
				toastStore.trigger({
					message: 'Meeting type deleted successfully!',
					background: 'variant-filled-success'
				});
				invalidate('supabase:db:booking_type');

				modalStore.close();
			} else {
				toastStore.trigger({
					message: await res.text(),
					background: 'variant-filled-error'
				});
			}
		}
	};

	const modalStore = getModalStore();

	let slideActive: boolean = data.active;

	async function setActive(checked: boolean) {
		const res = await fetch('/api/booking/type/update/active/' + data.id + '?checked=' + checked, {
			method: 'PATCH'
		});

		if (res.status == 200) {
			data.active = checked;
			slideActive = checked;
		} else {
			toastStore.trigger({
				message: 'Unable to update active status of booking type',
				background: 'variant-filled-error'
			});
			slideActive = data.active;
		}
	}

	$: {
		if (slideActive != data.active) {
			setActive(slideActive);
		}
	}
</script>

<MasonaryCard>
	<div class="flex flex-row gap-2 justify-start items-center">
		<span class="flex-grow font-medium">{data.name}</span>
		<SlideToggle
			name="slide"
			bind:checked={slideActive}
			background="variant-filled-error"
			active="variant-filled-success"
			size="sm"
		/>
		<button
			class="p-0 btn-icon btn-icon-sm variant-outline-error hover:variant-filled-error"
			type="button"
			on:click={() => modalStore.trigger(deleteModal)}
		>
			<Icon icon="tabler:trash" />
		</button>
	</div>
	<div class="flex flex-row gap-2">
		{#if data.online}
			<div class="space-x-2 cursor-default chip variant-outline-success">
				<Icon icon="tabler:check" class="text-success-700-200-token" /> <span>online</span>
			</div>
		{:else}
			<div class="space-x-2 cursor-default chip variant-outline-error">
				<Icon icon="tabler:x" class="text-error-700-200-token" /><span>online</span>
			</div>
		{/if}

		{#if data.in_person}
			<div class="space-x-2 cursor-default chip variant-outline-success">
				<Icon icon="tabler:check" class="text-success-700-200-token" /> <span>in person</span>
			</div>
		{:else}
			<div class="space-x-2 cursor-default chip variant-outline-error">
				<Icon icon="tabler:x" class="text-error-700-200-token" /> <span>in person</span>
			</div>
		{/if}
	</div>

	<div class="flex flex-row gap-2">
		{#each data.durations || [] as duration}
			<div class="cursor-default chip variant-outline-primary">
				<span>{durationToString(minutesToDuration(duration.duration))}</span>
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-2 gap-1 mt-2">
		<button
			class={'col-span-2 chip ' +
				(data.description
					? 'variant-outline-secondary hover:variant-filled-secondary'
					: 'variant-outline-surface cursor-default')}
			type="button"
			on:click={() => modalStore.trigger(descriptionModal)}
		>
			<span>Description</span>
		</button>
		<button
			class={'chip ' +
				(data.pre_notification
					? 'variant-outline-secondary hover:variant-filled-secondary'
					: 'variant-outline-surface cursor-default')}
			type="button"
			on:click={() => modalStore.trigger(preModal)}
		>
			<span>Pre-notif</span>
		</button>
		<button
			class={'chip ' +
				(data.post_notification
					? 'variant-outline-secondary hover:variant-filled-secondary'
					: 'variant-outline-surface cursor-default')}
			type="button"
			on:click={() => modalStore.trigger(postModal)}
		>
			<span>Post-notif</span>
		</button>
	</div>
</MasonaryCard>
