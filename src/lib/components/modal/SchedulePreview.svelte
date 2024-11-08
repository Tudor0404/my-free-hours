<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import RootSchedule from '../schedule/RootSchedule.svelte';
	import Schedule from '$lib/schedule/Schedule';
	import { superForm } from 'sveltekit-superforms';
	import { invalidate } from '$app/navigation';

	// Props
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-2 p-4 card max-h-[90vh] overflow-y-auto w-fit w-modal-wide">
		<div class="flex flex-row justify-between items-center">
			{#if $modalStore[0].meta.name}
				<h4 class="">{$modalStore[0].meta.name}</h4>
			{/if}

			<div class="flex flex-row gap-2">
				{#if $modalStore[0].meta.id}
					<button
						class="btn btn-sm variant-filled-error"
						tabindex="-1"
						on:click={async () => {
							const res = await fetch('/api/schedule/delete/' + $modalStore[0].meta.id, {
								method: 'DELETE'
							});

							if (res.status == 200) {
								toastStore.trigger({
									message: 'Schedule deleted successfully!',
									background: 'variant-filled-success'
								});
								invalidate('supabase:db:schedule');

								modalStore.close();
							} else {
								toastStore.trigger({
									message: await res.text(),
									background: 'variant-filled-error'
								});
							}
						}}
					>
						Delete</button
					>
				{/if}
				<button
					class="btn btn-sm variant-filled-primary"
					tabindex="0"
					type="button"
					on:click={() => modalStore.close()}>Close</button
				>
			</div>
		</div>

		{#if $modalStore[0].meta.description}
			<p class="w-fit">{$modalStore[0].meta.description}</p>
		{/if}

		{#if $modalStore[0].meta.schedule && $modalStore[0].meta.schedule instanceof Schedule}
			<div class="w-fit">
				<RootSchedule readOnly schedule={$modalStore[0].meta.schedule} />
			</div>
		{/if}
	</div>
{/if}
