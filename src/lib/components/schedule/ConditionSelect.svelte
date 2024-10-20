<script lang="ts">
	import type { Condition } from '$types/Schedule.Condition';
	import Icon from '@iconify/svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem, popup } from '@skeletonlabs/skeleton';

	const conditions: Condition[] = ['AND', 'OR', 'NOT'];

	let comboboxValue: string = conditions[0];

	const conditionPopup: PopupSettings = {
		event: 'click',
		target: 'conditionPopup',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
</script>

<div class="h-8">
	<button
		class="btn btn-sm variant-filled-primary w-[80px] justify-between"
		use:popup={conditionPopup}
		type="button"
	>
		<span class="capitalize">{comboboxValue}</span>
		<Icon icon="tabler:chevron-down" />
	</button>
</div>

<div class="card overflow-hidden w-[80px] shadow-xl z-10" data-popup="conditionPopup">
	<ListBox
		rounded="rounded-none"
		padding=""
		regionDefault="w-full py-1 flex justify-center items-center"
		active="variant-filled-primary"
		hover="hover:variant-soft-primary"
		spacing=""
	>
		{#each conditions as cond}
			<ListBoxItem bind:group={comboboxValue} name="small" value={cond}>{cond}</ListBoxItem>
		{/each}
	</ListBox>
</div>
