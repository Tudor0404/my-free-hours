<script lang="ts">
	import type { Condition } from '$types/Schedule.Condition';
	import Icon from '@iconify/svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem, popup } from '@skeletonlabs/skeleton';

	export let condition: string;
	export let numRules: number;

	const rand = Math.random();

	const conditionPopup: PopupSettings = {
		event: 'click',
		target: 'conditionPopup' + rand,
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
		<span>{condition}</span>
		<Icon icon="tabler:chevron-down" />
	</button>
</div>

<div class="card overflow-hidden w-[80px] shadow-xl z-10" data-popup={'conditionPopup' + rand}>
	<ListBox
		rounded="rounded-none"
		padding=""
		regionDefault="w-full py-1 flex justify-center items-center"
		active="variant-filled-primary"
		hover="hover:variant-soft-primary"
		spacing=""
	>
		<ListBoxItem bind:group={condition} name="small" value={'AND'}>{'AND'}</ListBoxItem>
		<ListBoxItem bind:group={condition} name="small" value={'OR'}>{'OR'}</ListBoxItem>
		<ListBoxItem bind:group={condition} name="small" value={'NOT'} disabled={numRules > 1}
			>{'NOT'}</ListBoxItem
		>
	</ListBox>
</div>
