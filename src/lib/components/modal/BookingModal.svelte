<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import dayjs, { type Dayjs } from 'dayjs';
	import HorizontalRule from '../misc/HorizontalRule.svelte';
	import { absoluteTimeToObject, durationToString } from '$lib/utils/time';
	import { invalidate } from '$app/navigation';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const startTime: Dayjs | undefined = $modalStore[0].meta.startTime;
	const duration: number | undefined = $modalStore[0].meta.duration;
	const guestName: string = $modalStore[0].meta.guestName;
	const meetingType: string | undefined = $modalStore[0].meta.meetingType;
	const id: string | undefined = $modalStore[0].meta.id;
	const meetingMethod: string | undefined = $modalStore[0].meta.meetingMethod;
	const createdAt: string | undefined = $modalStore[0].meta.createdAt;

	const invalid =
		id === undefined ||
		meetingType === undefined ||
		guestName === undefined ||
		duration === undefined ||
		startTime === undefined ||
		meetingMethod === undefined ||
		createdAt === undefined;

	const guestEmail: string | undefined = $modalStore[0].meta.guestEmail;
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-2 p-4 card max-h-[90vh] overflow-y-auto min-w-fit max-w-[80%]">
		{#if invalid}
			<span>Invalid meeting selected</span>
		{:else}
			<div class="flex gap-20 justify-between items-center">
				<h3>
					<span class="font-semibold">{meetingType}</span> with
					<span class="font-semibold">{guestName}</span>
				</h3>

				<div class="cursor-default chip variant-outline-primary h-fit">
					<span class="font-bold">{meetingMethod.replace('_', ' ')}</span>
				</div>
			</div>

			<HorizontalRule />
			<div>
				<h5>
					{startTime.format('dddd, DD MMMM YYYY')}
				</h5>

				<h5>
					{startTime.format('HH:mm')} to {startTime.add(duration, 'minute').format('HH:mm')}

					({durationToString(absoluteTimeToObject(duration))})
				</h5>
			</div>

			<HorizontalRule />

			<div>
				<p>
					<strong class="select-none">Created at: </strong>{dayjs(createdAt).format(
						'DD/MM/YYYY, HH:mm'
					)}
				</p>
				<p>
					<strong class="select-none">Guest's email: </strong>{guestEmail
						? guestEmail
						: 'none given'}
				</p>
			</div>
		{/if}

		<div class="self-end">
			<button
				class="btn variant-filled-error"
				tabindex="-1"
				type="button"
				on:click={async () => {
					const res = await fetch('/api/booking/delete/private/' + id, {
						method: 'DELETE'
					});

					if (res.status == 200) {
						toastStore.trigger({
							message: 'Booking deleted successfully!',
							background: 'variant-filled-success'
						});
						// invalidate('supabase:db:booking_calendar');

						if ($modalStore[0].response) $modalStore[0].response(true);

						modalStore.close();
					} else {
						toastStore.trigger({
							message: await res.text(),
							background: 'variant-filled-error'
						});
					}
				}}
			>
				Delete
			</button>

			<button
				class="btn variant-filled w-fit"
				tabindex="0"
				type="button"
				on:click={() => modalStore.close()}>Close</button
			>
		</div>
	</div>
{/if}
