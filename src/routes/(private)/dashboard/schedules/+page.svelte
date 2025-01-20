<script lang="ts">
	import RootSchedule from '$lib/components/schedule/RootSchedule.svelte';
	import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import ScheduleListItem from '$lib/components/schedule/ScheduleListItem.svelte';
	import ScrollItemList from '$lib/components/container/ScrollItemList.svelte';
	import { schedulesStore } from '$lib/stores/schedules';
	import { onMount } from 'svelte';

	export let data: PageData;

	let scheduleData: string;
	let scheduleKey: number = 0;

	const toastStore = getToastStore();

	onMount(async () => {
		await schedulesStore.refresh();
	});

	$: privateSchedules = data.schedules?.filter((s) => s.user_id != null) || [];
	$: publicSchedules = data.schedules?.filter((s) => s.user_id == null) || [];

	const { form, enhance, errors } = superForm(data.form, {
		taintedMessage: true,
		onResult: ({ result }) => {
			if (result.type == 'success') {
				scheduleKey += 1;
				toastStore.trigger({
					message: 'Schedule created successfully!',
					background: 'variant-filled-success'
				});
			}
		}
	});

	function recieveSchedule(data: string) {
		scheduleData = data;
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
					<ScheduleListItem data={s} />
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
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Create a new schedule</h4></svelte:fragment>
		<svelte:fragment slot="content">
			<form class="flex flex-col gap-4" method="post" use:enhance action="?/createSchedule">
				<label class="label max-w-[400px]">
					<span>Name</span>
					<input class="input" bind:value={$form.name} type="text" name="name" placeholder="Name" />
					<ErrorMessage error={$errors.name} />
				</label>

				<label class="label max-w-[400px]">
					<span>Description</span>
					<textarea
						class="textarea"
						bind:value={$form.description}
						name="description"
						placeholder=""
					></textarea>
					<ErrorMessage error={$errors.description} />
				</label>

				{#key scheduleKey}
					<RootSchedule sendScheduleData={recieveSchedule} schedules={data.schedules} />
				{/key}
				<ErrorMessage error={$errors.schedule} />

				<input class="hidden" name="schedule" bind:value={scheduleData} />

				<ErrorMessage error={$errors._errors} />

				<button class="btn variant-filled-success w-fit" type="submit">Create</button>
			</form></svelte:fragment
		>
	</AccordionItem>
</Accordion>
