<script lang="ts">
	import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import DurationSelect from '$lib/components/input/multi/DurationSelect.svelte';
	import Info from '$lib/components/misc/Info.svelte';
	import TypeMeetingListItem from '$lib/components/type/TypeMeetingListItem.svelte';
	import { invalidate } from '$app/navigation';
	import ScrollItemList from '$lib/components/container/ScrollItemList.svelte';

	export let data: PageData;
	const toastStore = getToastStore();
	let durationsValue: string = '';

	const { form, enhance, errors, reset } = superForm(data.form, {
		taintedMessage: true,
		onResult: ({ result }) => {
			// Only clear the form and durations if the submission was successful
			if (result.type === 'success') {
				invalidate('supabase:db:booking_type');
				durations = [];
				reset();
			}
		},
		onError: ({ result }) => {
			toastStore.trigger({
				message: result.error.message,
				background: 'variant-filled-error'
			});
		},
		onSubmit: ({ formData }) => {
			formData.delete('durations');
			durations.forEach((duration) => {
				formData.append('durations', duration.toString());
			});
		}
	});

	let durations: number[] = $form.durations || [];

	$: durationsValue = durations.join(',');
</script>

<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="summary"><h4>Meeting types</h4></svelte:fragment>
		<svelte:fragment slot="content">
			{#if data.types.length == 0}
				<span>You have no types currently, go create one!</span>
			{:else}
				<ScrollItemList>
					{#each data.types as type}
						<TypeMeetingListItem data={type} />
					{/each}
				</ScrollItemList>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Create a new meeting type</h4></svelte:fragment>
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
					<span class="flex flex-row gap-2"
						>Pre-meeting message <Info>Replaces the default message sent before the meeting.</Info
						></span
					>
					<textarea class="textarea" name="pre_notification" bind:value={$form.pre_notification}
					></textarea>
					<ErrorMessage error={$errors.pre_notification} />
				</label>

				<label class="label">
					<span class="flex flex-row gap-2"
						>Post-meeting message <Info>Replaces the default message sent after the meeting.</Info
						></span
					>
					<textarea class="textarea" name="post_notification" bind:value={$form.post_notification}
					></textarea>
					<ErrorMessage error={$errors.post_notification} />
				</label>

				<hr class="my-4 h-0.5 border-t-0 bg-surface-600" />

				<span class="flex flex-row gap-2"
					>Available durations for meeting <Info
						>Maximum of 3 durations.<br /> Each durations must be within 1 and 120 minutes.</Info
					>
				</span>
				<DurationSelect bind:value={durations} />
				<ErrorMessage error={$errors.durations?._errors} />
				<input class="hidden" bind:value={durationsValue} name="durations" />

				<div class="flex flex-row gap-1 mt-4">
					<button type="submit" class="btn btn-md variant-filled-success w-fit">Add</button>
					<button type="reset" class="btn btn-md variant-filled-error w-fit">Reset</button>
				</div>
			</form></svelte:fragment
		>
	</AccordionItem>
</Accordion>
