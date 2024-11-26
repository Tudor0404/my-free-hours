<script lang="ts">
	import { flip } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';

	export let condition: string;
	export let numRules: number;
	export let disabled: boolean = false;

	const rand = Math.random();

	const conditionPopup: PopupSettings = {
		event: 'click',
		target: 'conditionPopup' + rand,
		placement: 'bottom',
		closeQuery: '.listbox-item',
		middleware: { flip }
	};
</script>

<div class="h-8">
	<button
		class="btn btn-sm variant-filled-primary w-[80px] justify-between"
		use:popup={conditionPopup}
		type="button"
		{disabled}
	>
		<span>{condition}</span>
		<Icon icon="tabler:chevron-down" />
	</button>
</div>

<div class="overflow-hidden z-10 shadow-xl card" data-popup={'conditionPopup' + rand}>
	<select bind:value={condition} class="overflow-y-hidden px-0.5 select" size="3">
		<option value={'AND'}>{'AND'}</option>
		<option value={'OR'}>{'OR'}</option>
		<option value={'NOT'} disabled={numRules > 1}>{'NOT'}</option>
	</select>
</div>
