<script lang="ts">
	import { flip } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';


	export let wrapAnd: () => void;
	export let wrapOr: () => void;
	export let wrapNot: () => void;
	export let readOnly: boolean = false;

	const rand = Math.random();
	const wrapRulePopup: PopupSettings = {
		event: 'click',
		target: 'wrapRulePopup' + rand,
		placement: 'right',
		middleware: { flip }
	};
</script>

<button
	class={'p-1 h-7 btn variant-soft-primary aspect-square ' + (readOnly ? 'hidden' : '')}
	type="button"
	disabled="{readOnly}"
	use:popup={wrapRulePopup}>
	<Icon class="w-full h-full" icon="tabler:text-wrap" />
</button
>

<div class="card w-[250px] shadow-xl p-2 space-y-2 z-10" data-popup={'wrapRulePopup' + rand}>
	<span class="text-tertiary-900"> Conditions </span>
	<div class="grid grid-cols-2 gap-1 w-full">
		<button
			class="font-semibold btn btn-sm variant-soft-secondary"
			type="button"
			on:click={wrapAnd}>AND
		</button
		>
		<button
			class="font-semibold btn btn-sm variant-soft-secondary"
			type="button"
			on:click={wrapOr}>OR
		</button
		>
		<button
			class="font-semibold btn btn-sm variant-soft-secondary"
			type="button"
			on:click={wrapNot}>NOT
		</button
		>
	</div>
	<div class="arrow bg-surface-100-800-token"></div>
</div>
