<script lang="ts">
	import RootSchedule from '$lib/components/schedule/RootSchedule.svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';

	export let data: PageData;

	let scheduleData: string;
	let scheduleKey: number = 0;

	$: publicSchedules = data.schedules?.filter((s) => s.user_id == null);
	$: privateSchedules = data.schedules?.filter((s) => s.user_id != null);

	const { form, enhance, errors } = superForm(data.form, {
		taintedMessage: true,
		onResult: ({ result }) => {
			if (result.type == 'success') {
				scheduleKey += 1;
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
		<svelte:fragment slot="content"></svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Public schedules</h4></svelte:fragment>
		<svelte:fragment slot="content"></svelte:fragment>
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
					<RootSchedule sendScheduleData={recieveSchedule} />
				{/key}
				<ErrorMessage error={$errors.schedule} />

				<input class="hidden" name="schedule" bind:value={scheduleData} />

				<ErrorMessage error={$errors._errors} />

				<button class="btn variant-filled-success w-fit" type="submit">Create</button>
			</form></svelte:fragment
		>
	</AccordionItem>
</Accordion>
