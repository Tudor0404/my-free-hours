<svelte:head>
	<title>MFH: Schedules</title>
</svelte:head>

<script lang="ts">
	import RootSchedule from '$lib/components/schedule/RootSchedule.svelte';
	import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
	import { fieldProxy, superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import ScheduleListItem from '$lib/components/schedule/ScheduleListItem.svelte';
	import ScrollItemList from '$lib/components/container/ScrollItemList.svelte';
	import { schedulesStore } from '$lib/stores/schedules';
	import { onMount } from 'svelte';
	import type { Database } from '$types/database.types';
	import Schedule from '$lib/schedule/Schedule';
	import HorizontalRule from '$lib/components/misc/HorizontalRule.svelte';

	export let data: PageData;

	let scheduleData: string;
	let scheduleObj: Schedule;
	let scheduleKey: number = 0;

	const toastStore = getToastStore();

	onMount(async () => {
		await schedulesStore.refresh();
	});

	$: privateSchedules = data.schedules?.filter((s) => s.user_id != null) || [];
	$: publicSchedules = data.schedules?.filter((s) => s.user_id == null) || [];

	const { form, enhance, errors, reset } = superForm(data.form, {
		taintedMessage: true,
		onResult: async ({ result }) => {
			if (result.type == 'success') {
				scheduleKey += 1;
				toastStore.trigger({
					message: $form.id ? 'Schedule updated successfully!' : 'Schedule created successfully!',
					background: 'variant-filled-success'
				});
				scheduleObj = new Schedule();
			}
			await schedulesStore.refresh();
		}
	});

	function recieveSchedule(data: string) {
		scheduleData = data;
	}

	function editSchedule(schedule: Database['public']['Tables']['schedule']['Row']) {
		scheduleData = JSON.stringify(schedule.schedule);
		reset({
			data: {
				id: schedule.id,
				description: schedule.description,
				name: schedule.name,
				schedule: scheduleData
			}
		});

		scheduleObj = Schedule.decode_json(JSON.parse((schedule.schedule as string).toString()));
		scheduleKey += 1;

		const el = document.querySelector('#schedule-form');
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	}

	function resetForm() {
		reset();
		scheduleObj = new Schedule();
		scheduleKey += 1;
	}
</script>

<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="summary"><h4>Your schedules</h4></svelte:fragment>
		<svelte:fragment slot="content">
			{#if privateSchedules.length == 0}
				<span>No private schedules found, go create one!</span>
			{/if}

			<ScrollItemList>
				{#each privateSchedules as s (s.id)}
					<ScheduleListItem data={s} editCallback={() => editSchedule(s)} />
				{/each}
			</ScrollItemList>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Public schedules</h4></svelte:fragment>
		<svelte:fragment slot="content">
			{#if publicSchedules.length == 0}
				<span>No public schedules found</span>
			{/if}

			<ScrollItemList>
				{#each publicSchedules as s}
					<ScheduleListItem data={s} />
				{/each}
			</ScrollItemList>
		</svelte:fragment>
	</AccordionItem>
</Accordion>
<HorizontalRule />

<h4 id="schedule-form">
	{$form.id ? `Editing schedule '${$form.name}'` : 'Create a new schedule'}
</h4>
<form class="flex flex-col gap-4" method="post" use:enhance>
	<label class="label max-w-[400px]">
		<span>Name</span>
		<input class="input" bind:value={$form.name} type="text" name="name" placeholder="Name" />
		<ErrorMessage error={$errors.name} />
	</label>

	<label class="label max-w-[400px]">
		<span>Description</span>
		<textarea class="textarea" bind:value={$form.description} name="description" placeholder=""
		></textarea>
		<ErrorMessage error={$errors.description} />
	</label>

	{#key scheduleKey}
		<RootSchedule
			bind:schedule={scheduleObj}
			scheduleCallback={recieveSchedule}
			schedules={data.schedules}
		/>
	{/key}
	<ErrorMessage error={$errors.schedule} />

	<input class="hidden" name="schedule" bind:value={scheduleData} />

	<input class="hidden" name="id" bind:value={$form.id} />

	<ErrorMessage error={$errors._errors} />

	<div class="flex flex-row gap-2 justify-start items-center">
		<button class="btn variant-filled-success w-fit" type="submit"
		>{$form.id ? 'Update' : 'Create'}</button
		>
		<button class="btn variant-filled-warning w-fit" type="reset" on:click={resetForm}
		>{$form.id ? 'Cancel Edit' : 'Reset'}</button
		>
	</div>
</form>
