<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
</script>

<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="summary"><h4>Types</h4></svelte:fragment>
		<svelte:fragment slot="content"></svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Add new type</h4></svelte:fragment>
		<svelte:fragment slot="content">
			<form class="flex flex-col gap-2 max-w-[400px]" method="post" action="?/createType">
				<label class="label">
					<span>Name *</span>
					<input name="name" class="input" type="text" placeholder="Name" required />
				</label>

				<label class="label">
					<span>Description</span>
					<textarea name="description" class="textarea" placeholder="Description" />
				</label>

				<div class="space-y-2">
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" checked name="online" />
						<p>Online</p>
					</label>
					<label class="flex items-center space-x-2">
						<input class="checkbox" type="checkbox" checked name="inPerson" />
						<p>In person</p>
					</label>
					<span class="text-sm text-opacity-60">At least one must be ticked</span>
				</div>

				<hr class="my-4 h-0.5 border-t-0 bg-surface-600" />

				<label class="label">
					<span>Pre-meeting message</span>
					<textarea class="textarea" name="preNotif" />
				</label>

				<label class="label">
					<span>Post-meeting message</span>
					<textarea class="textarea" name="postNotif" />
				</label>

				<div class="flex flex-row gap-2">
					<button type="submit" class="btn btn-md variant-filled-success w-fit">Add</button>
					<button type="reset" class="btn btn-md variant-filled-error w-fit">Reset</button>
				</div>
			</form></svelte:fragment
		>
	</AccordionItem>
</Accordion>
