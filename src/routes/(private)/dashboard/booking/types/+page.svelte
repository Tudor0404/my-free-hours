<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';

	export let data: PageData;

	const { form, enhance, errors } = superForm(data.form, {
		taintedMessage: true
	});
</script>

<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="summary"><h4>Types</h4></svelte:fragment>
		<svelte:fragment slot="content"></svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Add new type</h4></svelte:fragment>
		<svelte:fragment slot="content">
			<form
				class="flex flex-col gap-2 max-w-[400px]"
				method="post"
				action="?/createType"
				use:enhance
			>
				<label class="label">
					<span>Name</span>
					<input
						name="name"
						class="input"
						type="text"
						bind:value={$form.name}
						placeholder="Name"
						minlength="3"
						required
					/>
					<ErrorMessage error={$errors.name} />
				</label>

				<label class="label">
					<span>Description</span>
					<textarea
						name="description"
						class="textarea"
						bind:value={$form.description}
						placeholder="Description"
					></textarea>
					<ErrorMessage error={$errors.description} />
				</label>

				<div class="space-y-2">
					<label class="flex items-center space-x-2">
						<input
							class="checkbox"
							type="checkbox"
							name="online"
							bind:value={$form.online}
							checked
						/>
						<p>Online</p>
					</label>
					<label class="flex items-center space-x-2">
						<input
							class="checkbox"
							type="checkbox"
							name="in_person"
							bind:value={$form.in_person}
							checked
						/>
						<p>In person</p>
					</label>
					<ErrorMessage error={$errors.online} />

					<ErrorMessage error={$errors.in_person} />
				</div>

				<hr class="my-4 h-0.5 border-t-0 bg-surface-600" />

				<label class="label">
					<span>Pre-meeting message</span>
					<textarea class="textarea" name="preNotifMessage" bind:value={$form.pre_notification}
					></textarea>
					<ErrorMessage error={$errors.pre_notification} />
				</label>

				<label class="label">
					<span>Post-meeting message</span>
					<textarea class="textarea" name="postNotifMessage" bind:value={$form.post_notification}
					></textarea>
					<ErrorMessage error={$errors.post_notification} />
				</label>

				<div class="flex flex-row gap-2">
					<button type="submit" class="btn btn-md variant-filled-success w-fit">Add</button>
					<button type="reset" class="btn btn-md variant-filled-error w-fit">Reset</button>
				</div>
			</form></svelte:fragment
		>
	</AccordionItem>
</Accordion>
