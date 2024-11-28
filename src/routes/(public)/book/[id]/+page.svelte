<script lang="ts">
	import { onMount } from 'svelte';
	import { appBarSubTitle } from '$stores/appbar';
	import { getToastStore, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { fieldProxy, superForm } from 'sveltekit-superforms';
	import { absoluteTimeToObject, durationToString, timeToMilitaryString } from '$lib/utils/time';
	import type { DaySlotTimes } from '$types/DaySlotTimes.js';
	import SveltyPicker from 'svelty-picker';
	import dayjs from 'dayjs';
	import Icon from '@iconify/svelte';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';

	export let data;

	onMount(() => {
		if (data.display_name) {
			appBarSubTitle.set(`Book a meeting with ${data.display_name}`);
		}

		return () => {
			appBarSubTitle.set('');
		};
	});

	const toastStore = getToastStore();

	const { form, enhance, errors } = superForm(data.form, {
		taintedMessage: true,
		onResult: ({ result }) => {
			if (result.type == 'success') {
				toastStore.trigger({
					message: 'Booking successfully created!',
					background: 'variant-filled-success'
				});
			} else {
				toastStore.trigger({
					message: 'Booking unsuccessfully created!',
					background: 'variant-filled-error'
				});
			}
		},
		invalidateAll: 'force'
	});

	$: selectableDurations = data.meetingTypes.find((e) => e.id == $form.type_id)?.durations;

	const meetingTypeProxy = fieldProxy(form, 'type_id');
	const durationProxy = fieldProxy(form, 'duration');
	const dateProxy = fieldProxy(form, 'date');
	const meetingMethodProxy = fieldProxy(form, 'meeting_method');
	const timeProxy = fieldProxy(form, 'time');

	let inpersonSlots: DaySlotTimes[] = [];
	let onlineSlots: DaySlotTimes[] = [];
	let availableDates = [
		...new Set(
			data.inpersonSlots
				.map((e) => dayjs(e.day).format('YYYY-MM-DD'))
				.concat(data.onlineSlots.map((e) => dayjs(e.day).format('YYYY-MM-DD')))
		)
	].toSorted((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());

	let refreshKey = 0;
	$: selectedDateString = dayjs($form.date).format('dddd, DD MMMM YYYY');
	let currentInpersonIndex: number;
	let currentOnlineIndex: number;

	$: {
		if ($form.date) {
			currentInpersonIndex = inpersonSlots.findIndex((e) => dayjs(e.day).isSame(dayjs($form.date)));
			currentOnlineIndex = onlineSlots.findIndex((e) => dayjs(e.day).isSame(dayjs($form.date)));
		}
	}

	meetingTypeProxy.subscribe((v) => {
		durationProxy.set(data.meetingTypes.find((e) => e.id == v)?.durations[0] || -1);
	});

	durationProxy.subscribe((d) => {
		if (!$form.type_id) return;

		let buffer: DaySlotTimes[] = [];

		data.inpersonSlots.forEach((slot) => {
			const newSlots = slot.times.filter((t) => t.maxDuration >= d);

			if (newSlots.length > 0) {
				buffer.push({
					day: slot.day,
					times: newSlots
				});
			}
		});

		inpersonSlots = buffer;

		buffer = [];

		data.onlineSlots.forEach((slot) => {
			const newSlots = slot.times.filter((t) => t.maxDuration >= d);

			if (newSlots.length > 0) {
				buffer.push({
					day: slot.day,
					times: newSlots
				});
			}
		});

		onlineSlots = buffer;
		timeProxy.set('');
		refreshKey += 1;
	});

	meetingMethodProxy.subscribe(() => {
		timeProxy.set('');
	});

	function getFirstDate(): Date | undefined {
		const firstOnline = onlineSlots.length > 0 ? dayjs(onlineSlots[0]?.day) : false;
		const firstInperson = inpersonSlots.length > 0 ? dayjs(inpersonSlots[0]?.day) : false;

		if (firstOnline === false && firstInperson === false) {
			return undefined;
		} else if (firstOnline === false) {
			meetingMethodProxy.set('in_person');
			//@ts-ignore
			selectedDate = firstInperson.format('YYYY-MM-DD');
			//@ts-ignore
			return firstInperson.toDate();
		} else if (firstInperson === false) {
			meetingMethodProxy.set('online');
			//@ts-ignore
			selectedDate = firstOnline.format('YYYY-MM-DD');
			//@ts-ignore
			return firstOnline.toDate();
		} else {
			if (firstInperson.isBefore(firstOnline)) {
				meetingMethodProxy.set('in_person');
				dateProxy.set(firstInperson.format('YYYY-MM-DD'));
				return firstInperson.toDate();
			} else {
				meetingMethodProxy.set('online');
				dateProxy.set(firstOnline.format('YYYY-MM-DD'));
				return firstOnline.toDate();
			}
		}
	}

	function getLastDate(): Date | undefined {
		const lastOnline =
			onlineSlots.length > 0 ? dayjs(onlineSlots[onlineSlots.length - 1]?.day) : false;
		const lastInperson =
			inpersonSlots.length > 0 ? dayjs(inpersonSlots[inpersonSlots.length - 1]?.day) : false;

		if (lastOnline === false && lastInperson === false) {
			return undefined;
		} else if (lastOnline === false) {
			//@ts-ignore
			return lastInperson.toDate();
		} else if (lastInperson === false) {
			//@ts-ignore
			return lastOnline.toDate();
		} else {
			if (lastInperson.isAfter(lastOnline)) {
				return lastInperson.toDate();
			} else {
				return lastOnline.toDate();
			}
		}
	}

	function nextDate() {
		const curIndex = availableDates.findIndex((e) => e == $form.date);

		if (curIndex != -1 && curIndex < availableDates.length - 1) {
			dateProxy.set(availableDates[curIndex + 1]);
			timeProxy.set('');
		}
	}

	function previousDate() {
		const curIndex = availableDates.findIndex((e) => e == $form.date);

		if (curIndex != -1 && curIndex > 0) {
			dateProxy.set(availableDates[curIndex - 1]);
			timeProxy.set('');
		}
	}
</script>

<form use:enhance method="post" action="?/createBooking" class="space-y-16 w-full lg:space-y-8">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<label class="space-y-4 label">
			<h3 class="text-center lg:text-left">Meeting type</h3>

			<RadioGroup
				class="[&>*]:select-none w-full"
				flexDirection="flex-col"
				active="variant-filled-tertiary"
				hover="hover:variant-soft-tertiary"
			>
				{#each data.meetingTypes as type}
					<RadioItem
						bind:group={$form.type_id}
						name="type_id"
						value={type.id}
						class="text-lg"
						padding="p-2">{type.name}</RadioItem
					>
				{/each}
			</RadioGroup>
		</label>

		<label class="flex flex-col space-y-4 h-full label">
			<h3 class="text-center lg:text-left">Duration of meeting</h3>

			{#if selectableDurations}
				<RadioGroup
					class="[&>*]:select-none w-full"
					flexDirection="flex-col"
					active="variant-filled-tertiary"
					hover="hover:variant-soft-tertiary"
				>
					{#each selectableDurations as duration}
						<RadioItem
							bind:group={$form.duration}
							name="duration"
							value={duration}
							padding="p-2"
							class="text-lg">{durationToString(absoluteTimeToObject(duration), true)}</RadioItem
						>
					{/each}
				</RadioGroup>
			{:else}
				<span
					class="flex justify-center items-center p-4 h-full text-lg text-center text-surface-800"
					>Select a meeting type to view duration options</span
				>
			{/if}
		</label>

		{#if $form.type_id}
			{@const selectedType = data.meetingTypes.find((e) => e.id == $form.type_id)}
			{#if selectedType?.description}
				<div class="flex flex-col col-span-full pl-2 border-l-2 border-secondary-600">
					<h5 class="font-semibold">'{selectedType.name}' information</h5>
					{selectedType.description}
				</div>
			{/if}
		{/if}

		<ErrorMessage error={$errors.type_id} />
		<ErrorMessage error={$errors.duration} />
	</div>

	<hr class="w-full h-1 rounded bg-surface-300" />

	<div class="space-y-4">
		<h3 class="text-center lg:text-left">Select date and time</h3>
		{#if inpersonSlots.length > 0 || onlineSlots.length > 0}
			<div class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-4 items-stretch">
				{#key refreshKey}
					<div class="place-self-center">
						<SveltyPicker
							disableDatesFn={(date) =>
								inpersonSlots.findIndex((e) => dayjs(e.day).isSame(dayjs(date), 'day')) == -1 &&
								onlineSlots.findIndex((e) => dayjs(e.day).isSame(dayjs(date), 'day')) == -1}
							pickerOnly
							todayBtn={false}
							startDate={getFirstDate()}
							endDate={getLastDate()}
							clearBtn={false}
							initialDate={getFirstDate()}
							bind:value={$form.date}
							clearToggle={false}
							name="date"
						/>
					</div>

					<div class="flex flex-col gap-2 w-full">
						<div class="flex flex-row justify-between w-full">
							<button
								class="p-2 btn-icon btn-icon-sm variant-filled-secondary"
								type="button"
								on:click={previousDate}
								disabled={availableDates.indexOf($form.date) <= 0}
								><Icon
									icon="tabler:chevron-left"
									class="w-full h-full text-on-tertiary-token"
								/></button
							>
							<h4 class="underline decoration-secondary-600 underline-offset-3 decoration-2">
								{selectedDateString}
								{$form.time ? ' at ' + $form.time : ''}
							</h4>
							<button
								class="p-2 btn-icon btn-icon-sm variant-filled-secondary"
								type="button"
								on:click={nextDate}
								disabled={availableDates.indexOf($form.date) >= availableDates.length - 1}
								><Icon
									icon="tabler:chevron-right"
									class="w-full h-full text-on-tertiary-token"
								/></button
							>
						</div>
						<RadioGroup active="variant-filled-tertiary" hover="hover:variant-soft-tertiary">
							<RadioItem bind:group={$form.meeting_method} name="meeting_method" value={'in_person'}
								>in person</RadioItem
							>
							<RadioItem bind:group={$form.meeting_method} name="meeting_method" value={'online'}
								>online</RadioItem
							>
						</RadioGroup>
						<div
							class="flex overflow-y-auto flex-row flex-wrap gap-3 h-[200px] border-token rounded p-1 w-full justify-center content-start"
						>
							{#if $form.meeting_method === 'in_person'}
								{#if inpersonSlots[currentInpersonIndex] !== undefined}
									{#each inpersonSlots[currentInpersonIndex].times as time}
										<button
											class={`chip w-[80px] px-3 text-base ${$form.time === timeToMilitaryString(time.start) ? 'variant-filled-tertiary' : 'variant-outline-tertiary'}`}
											on:click={() => timeProxy.set(timeToMilitaryString(time.start))}
											type="button"
										>
											{timeToMilitaryString(time.start)}
										</button>
									{/each}
								{:else}
									<div class="flex justify-center items-center self-center w-full h-full">
										<span class="text-center text-surface-800"
											>No in person slots available on this date</span
										>
									</div>
								{/if}
							{:else if $form.meeting_method === 'online'}
								{#if onlineSlots[currentOnlineIndex] !== undefined}
									{#each onlineSlots[currentOnlineIndex].times as time}
										<button
											class={`chip w-[80px] px-3 text-base ${$form.time === timeToMilitaryString(time.start) ? 'variant-filled-tertiary' : 'variant-outline-tertiary'}`}
											on:click={() => timeProxy.set(timeToMilitaryString(time.start))}
											type="button"
										>
											{timeToMilitaryString(time.start)}
										</button>
									{/each}
								{:else}
									<div class="flex justify-center items-center self-center w-full h-full">
										<span class="text-center text-surface-800"
											>No online slots available on this date</span
										>
									</div>
								{/if}
							{/if}
						</div>
						<input class="hidden" type="text" bind:value={$form.time} name="time" />
					</div>
				{/key}
			</div>
		{:else if $form.duration != -1}
			<h4 class="flex justify-center items-center p-4 text-lg text-center text-surface-800">
				No available online or inperson slots found
			</h4>
		{:else}
			<h4 class="flex justify-center items-center p-4 text-lg text-center text-surface-800">
				Select a meeting type to view available slots
			</h4>
		{/if}

		<ErrorMessage error={$errors.date} />
		<ErrorMessage error={$errors.time} />
		<ErrorMessage error={$errors.meeting_method} />
	</div>

	<hr class="w-full h-1 rounded bg-surface-300" />

	<div class="space-y-4">
		<h3 class="text-center lg:text-left">Personal details</h3>

		<label class="label max-w-[400px]">
			<span>Full name (required)</span>
			<input
				class="input"
				type="text"
				bind:value={$form.guest_name}
				name="guest_name"
				placeholder="Full name"
				required
			/>
			<ErrorMessage error={$errors.guest_name} />
		</label>

		<label class="label max-w-[400px]">
			<span>Email {data.requiresEmail ? '(required)' : ''}</span>
			<input
				class="input"
				type="text"
				bind:value={$form.guest_email}
				name="guest_email"
				placeholder="example@domain.com"
				required={data.requiresEmail}
			/>
		</label>
		<ErrorMessage error={$errors.guest_email} />
	</div>

	<div class="flex justify-center w-full">
		<button class="btn btn-xl variant-filled-primary" type="submit">Create booking</button>
	</div>
</form>
