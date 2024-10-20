<script lang="ts">
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let createDay: () => void;
	export let createWeekDay: () => void;

	const newRulePopup: PopupSettings = {
		event: 'click',
		target: 'newRulePopup',
		placement: 'right'
	};
</script>

<button
	class="p-1 h-8 btn variant-soft-primary aspect-square"
	type="button"
	use:popup={newRulePopup}><Icon class="w-full h-full" icon="tabler:playlist-add" /></button
>

<div class="card w-[200px] shadow-xl p-2 space-y-2 z-10" data-popup="newRulePopup">
	<div>
		<span class="text-tertiary-900"> Fields </span>
		<div class="grid grid-cols-2 gap-1 w-full">
			<button
				class="font-semibold btn btn-sm variant-soft-tertiary"
				type="button"
				on:click|preventDefault|stopPropagation={createDay}>Day</button
			>
			<button
				class="font-semibold btn btn-sm variant-soft-tertiary"
				type="button"
				on:click|preventDefault|stopPropagation={createWeekDay}>Week Day</button
			>
			<button class="font-semibold btn btn-sm variant-soft-tertiary" type="button">Date</button>
			<button class="font-semibold btn btn-sm variant-soft-tertiary" type="button">Month</button>
			<button class="font-semibold btn btn-sm variant-soft-tertiary" type="button">Year</button>
		</div>
	</div>
	<div>
		<span class="text-tertiary-900"> Conditions </span>
		<div class="grid grid-cols-2 gap-1 w-full">
			<button class="font-semibold btn btn-sm variant-soft-secondary" type="button">AND</button>
			<button class="font-semibold btn btn-sm variant-soft-secondary" type="button">OR</button>
			<button class="font-semibold btn btn-sm variant-soft-secondary" type="button">NOT</button>
		</div>
	</div>
	<div class="arrow bg-surface-100-800-token"></div>
</div>
