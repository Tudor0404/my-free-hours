<script lang="ts">
	import Icon from '@iconify/svelte';

	export let value;
	export let onLeftClick: () => void;
	export let leftDisabled: boolean;
	export let onRightClick: () => void;
	export let rightDisabled: boolean;
	export let readOnly: boolean = false;
</script>

<div class="flex flex-row">
	<button
		class="!rounded-r-none btn-schedule text-tertiary-900"
		type="button"
		disabled={leftDisabled || readOnly}
		on:click={onLeftClick}
	>
		<Icon icon="tabler:chevron-left" />
	</button>
	<div class="flex justify-center items-center w-[40px] variant-outline-tertiary !border-x-0">
		<span class="text-sm select-none">
			{value}
		</span>
	</div>

	<button
		class="btn-schedule !rounded-l-none border-l-0 text-tertiary-900"
		type="button"
		disabled={rightDisabled || readOnly}
		on:click={onRightClick}
	>
		<Icon icon="tabler:chevron-right" />
	</button>
</div>
