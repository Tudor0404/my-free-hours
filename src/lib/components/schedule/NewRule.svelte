<script lang="ts">
	import { flip } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let createDay: () => void;
	``;
	export let createWeekDay: () => void;
	export let createMonth: () => void;
	export let createDate: () => void;
	export let createTime: () => void;
	export let createAnd: () => void;
	export let createOr: () => void;
	export let createNot: () => void;
	export let createSchedule: () => void;
	export let disabled: boolean = false;
	export let readOnly: boolean = false;

	const rand = Math.random();
	const newRulePopup: PopupSettings = {
		event: 'click',
		target: 'newRulePopup' + rand,
		placement: 'right',
		middleware: { flip }
	};
</script>

<button
	class={'p-1 h-7 btn variant-soft-primary aspect-square ' + (readOnly ? 'hidden' : '')}
	type="button"
	{disabled}
	title={disabled ? 'NOT conditions are limited to 1 rule' : ''}
	use:popup={newRulePopup}><Icon class="w-full h-full" icon="tabler:playlist-add" /></button
>

<div class="card w-[200px] shadow-xl p-2 space-y-2 z-10" data-popup={'newRulePopup' + rand}>
	<div>
		<span class="text-tertiary-900"> Fields </span>
		<div class="grid grid-cols-2 gap-1 w-full">
			<button
				class="font-semibold btn btn-sm variant-soft-tertiary"
				type="button"
				on:click={createDay}>Day</button
			>
			<button
				class="font-semibold btn btn-sm variant-soft-tertiary"
				type="button"
				on:click={createWeekDay}>Week Day</button
			>
			<button
				class="font-semibold btn btn-sm variant-soft-tertiary"
				type="button"
				on:click={createDate}>Date</button
			>
			<button
				class="font-semibold btn btn-sm variant-soft-tertiary"
				type="button"
				on:click={createMonth}>Month</button
			>
			<button
				class="font-semibold btn btn-sm variant-soft-tertiary"
				type="button"
				on:click={createTime}>Time</button
			>
			<button
				class="font-semibold btn btn-sm variant-soft-tertiary"
				type="button"
				on:click={createSchedule}>Schedule</button
			>
		</div>
	</div>
	<div>
		<span class="text-tertiary-900"> Conditions </span>
		<div class="grid grid-cols-2 gap-1 w-full">
			<button
				class="font-semibold btn btn-sm variant-soft-secondary"
				type="button"
				on:click={createAnd}>AND</button
			>
			<button
				class="font-semibold btn btn-sm variant-soft-secondary"
				type="button"
				on:click={createOr}>OR</button
			>
			<button
				class="font-semibold btn btn-sm variant-soft-secondary"
				type="button"
				on:click={createNot}>NOT</button
			>
		</div>
	</div>
	<div class="arrow bg-surface-100-800-token"></div>
</div>
