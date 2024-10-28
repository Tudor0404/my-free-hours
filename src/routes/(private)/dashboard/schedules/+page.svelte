<script lang="ts">
	import RootSchedule from '$lib/components/schedule/RootSchedule.svelte';
	import test from '$lib/schedule/test';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';

	test();
</script>

<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="summary"><h4>Your schedules</h4></svelte:fragment>
		<svelte:fragment slot="content"></svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Create a new schedule</h4></svelte:fragment>
		<svelte:fragment slot="content">
			<form class="flex flex-col gap-2" use:enhance>
				<label class="label">
					<span>Name</span>
					<input class="input" type="text" placeholder="Name" />
				</label>

				<label class="label">
					<span>Description</span>
					<textarea class="textarea" placeholder="Name" />
				</label>

				<RootSchedule />
			</form></svelte:fragment
		>
	</AccordionItem>
</Accordion>
