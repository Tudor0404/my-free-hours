<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import RootSchedule from '../schedule/RootSchedule.svelte';
	import Schedule from '$lib/schedule/Schedule';

	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-4 p-4 card max-h-[90vh] overflow-y-auto w-fit w-modal-wide">
		{#if $modalStore[0].meta.name}
			<h3>{$modalStore[0].meta.name}</h3>
		{/if}

		{#if $modalStore[0].meta.schedule && $modalStore[0].meta.schedule instanceof Schedule}
			<div class="w-fit">
				<RootSchedule readOnly schedule={$modalStore[0].meta.schedule} />
			</div>
		{/if}

		<button
			class="self-end btn variant-filled w-fit"
			tabindex="0"
			type="button"
			on:click={() => modalStore.close()}>Close</button
		>
	</div>
{/if}
