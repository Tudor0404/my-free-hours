<script lang="ts">
	import type { BookingTypeWithDurations } from '$types/BookingTypeWithDurations';
	import { absoluteTimeToObject, durationToString } from '$lib/utils/time';
	import Icon from '@iconify/svelte';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import MasonaryCard from '../container/MasonaryCard.svelte';
	import { invalidate } from '$app/navigation';

	export let data: BookingTypeWithDurations;
	export let editCallback: (() => void) | null = null;

	const toastStore = getToastStore();

	const deleteModal: ModalSettings = {
		type: 'confirm',
		title: 'Confirm Delete',
		body: 'Are you sure you want to delete this meeting type? All bookings that reference this meeting type will also be deleted.',
		response: async (r: boolean) => {
			if (!r) return;

			const res = await fetch('/api/booking/type/delete/' + data.id, {
				method: 'DELETE'
			});

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
	<div class="grid grid-cols-[1fr_auto] gap-2">
		<div class="flex flex-col gap-2 justify-start">
			<span class="mb-1 font-medium">{data.name}</span>
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
						<span>{durationToString(absoluteTimeToObject(duration.duration))}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-3 gap-1 grid-rows-[auto_auto] h-fit">
			<button
				class="p-1.5 btn btn-sm aspect-square variant-glass-error hover:variant-filled-error"
				type="button"
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
				href={`/dashboard/booking/types/${data.id}`}
			>
				<Icon icon="tabler:external-link" />
			</a>

			<div class="col-span-3">
				<button
					class={`w-full btn btn-sm ${slideActive ? 'variant-glass-success' : 'variant-glass-error'}`}
					on:click={() => (slideActive = !slideActive)}
				>
					{slideActive ? 'Active' : 'Disabled'}
				</button>
			</div>
		</div>
	</div>

	<!-- <div class="grid grid-cols-2 gap-1 mt-2">
		<button
			class="col-span-2 chip variant-outline-secondary active:hover:variant-filled-secondary"
			type="button"
			disabled={!data.description}
			on:click={() => modalStore.trigger(descriptionModal)}
		>
			<span>Description</span>
		</button>
		<button
			class="chip variant-outline-secondary"
			type="button"
			disabled={!data.pre_notification}
			on:click={() => modalStore.trigger(preModal)}
		>
			<span>Pre-notif</span>
		</button>
		<button
			class="chip variant-outline-secondary"
			type="button"
			disabled={!data.post_notification}
			on:click={() => modalStore.trigger(postModal)}
		>
			<span>Post-notif</span>
		</button>
	</div> -->
</MasonaryCard>
