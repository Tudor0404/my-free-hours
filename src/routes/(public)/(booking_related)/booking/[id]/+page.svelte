<svelte:head>
	<title>MFH: Booking with {data.bookingInfo.host_name}</title>
</svelte:head>

<script lang="ts">
	import HorizontalRule from '$lib/components/misc/HorizontalRule.svelte';
	import { absoluteTimeToObject, durationToString } from '$lib/utils/time';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import dayjs from 'dayjs';

	export let data;

	const startTime = dayjs(data.bookingInfo.start_time);

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const deleteModal: ModalSettings = {
		type: 'confirm',
		title: 'Confirm Cancel',
		body: 'Are you sure you want to cancel this meeting type?',
		response: async (r: boolean) => {
			if (!r) return;

			const res = await fetch('/api/booking/delete/public/' + data.urlID, {
				method: 'DELETE'
			});

			if (res.status == 200) {
				toastStore.trigger({
					message: 'Booking deleted successfully!',
					background: 'variant-filled-success'
				});
				modalStore.close();
			} else {
				toastStore.trigger({
					message: (await res.json()).message,
					background: 'variant-filled-error'
				});
			}
		}
	};
</script>

<div class="flex flex-col justify-center w-full">
	<div class="px-6 py-8 w-full bg-primary-700">
		<h1 class="text-center text-on-primary-token">Meeting with {data.bookingInfo.host_name}</h1>
	</div>

	<div class="flex flex-col gap-4 items-center px-10 py-8 w-full">
		<h3 class="text-center">
			{startTime.format('dddd, DD MMMM YYYY')}, {startTime.format('HH:mm')} to {startTime
			.add(data.bookingInfo.duration, 'minute')
			.format('HH:mm')}
		</h3>
		<HorizontalRule />
		<div class="grid grid-cols-2 gap-x-4 w-fit">
			<h4 class="text-left"><strong>Meeting type</strong></h4>
			<h4 class="text-right">{data.bookingInfo.meeting_name}</h4>

			<h4 class="text-left"><strong>Duration</strong></h4>
			<h4 class="text-right">
				{durationToString(absoluteTimeToObject(data.bookingInfo.duration), true)}
			</h4>

			<h4 class="text-left"><strong>Meeting method</strong></h4>
			<h4 class="text-right">
				{data.bookingInfo.meeting_method.replace('_', ' ')}
			</h4>
		</div>

		{#if data.bookingInfo.meeting_description}
			<HorizontalRule />
			<p><strong>Meeting description: </strong> {data.bookingInfo.meeting_description}</p>
		{/if}
		<HorizontalRule />

		<p class="max-w-lg text-center">This meeting that can be cancelled at any time before the start of it. Press the
			'copy link' button to save the website link to your clipboard.</p>

		<div class="flex flex-col gap-2 items-center">


			<div class="flex flex-row gap-2">


				{#if data.bookingInfo.meeting_url}
					<a
						class="btn variant-filled-primary"
						href={data.bookingInfo.meeting_url}
						target="_blank">Open Meeting</a
					>
				{/if}
				<button
					class="btn variant-filled-primary"
					type="button"
					on:click={() => {window.navigator.clipboard.writeText(window.location.href);}}>
					Copy link
				</button>

				<form action="https://yufhojeffwwthvabyuxm.supabase.co/functions/v1/get-single-ics" method="post">
					<!-- Replace with your dynamic booking id if needed -->
					<input type="hidden" name="id" value={data.urlID}>
					<button class="btn variant-filled-primary" type="submit">Download ICS File</button>
				</form>

			</div>
			<button
				class="btn variant-filled-error w-fit"
				type="button"
				on:click={() => modalStore.trigger(deleteModal)}>Cancel meeting
			</button
			>
		</div>
	</div>

</div>
