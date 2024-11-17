<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import RootSchedule from '../schedule/RootSchedule.svelte';
	import Schedule from '$lib/schedule/Schedule';

	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<div class="flex flex-col gap-2 p-4 card max-h-[90vh] overflow-y-auto min-w-[40%] max-w-[80%]">
		{#if $modalStore[0].meta.title}
			<h3 class="w-fit">
				{$modalStore[0].meta.title}
			</h3>
		{/if}

		{#if $modalStore[0].meta.text}
			<p>
				{$modalStore[0].meta.text}
			</p>
		{/if}

		<button
			class="self-end btn variant-filled w-fit"
			tabindex="0"
			type="button"
			on:click={() => modalStore.close()}>Close</button
		>
	</div>
{/if}
