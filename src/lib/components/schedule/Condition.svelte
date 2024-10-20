<script lang="ts">
	import type ConditionBlock from '$lib/schedule/ConditionBlock';
	import Icon from '@iconify/svelte';
	import ConditionSelect from './ConditionSelect.svelte';
	import NewRule from './NewRule.svelte';
	import DayBlock from '$lib/schedule/values/DayBlock';
	import DayField from './DayField.svelte';
	import DayOfWeekBlock from '$lib/schedule/values/DayOfWeekBlock';
	import DayOfWeekField from './DayOfWeekField.svelte';

	export let condition: ConditionBlock;

	export let onDelete: (() => void) | null = null;

	$: () => {
		console.log(condition.get_object());
	};

	function deleteRule(index: number) {
		condition.delete_rule(index);
		condition.rules = [...condition.rules];
	}
</script>

<div class="flex flex-col">
	<div class="flex flex-row gap-2 justify-start items-center">
		<ConditionSelect />
		<NewRule
			createDay={() => {
				condition.add_rule(new DayBlock('IN', []));
				condition.rules = [...condition.rules];
			}}
			createWeekDay={() => {
				condition.add_rule(new DayOfWeekBlock('IN', []));
				condition.rules = [...condition.rules];
			}}
		/>
	</div>
	<div class="flex relative flex-col ml-4 border-l-2 border-primary-200">
		{#each condition.rules as rule, i}
			{#if rule instanceof DayBlock}
				<DayField block={rule} onDelete={() => deleteRule(i)} />
			{:else if rule instanceof DayOfWeekBlock}
				<DayOfWeekField block={rule} onDelete={() => deleteRule(i)} />
			{/if}
		{/each}
		{#if condition.rules.length > 0}
			<div class="absolute bg-surface-100 w-[2rem] h-[1.25rem] -bottom-[1px] -left-[1rem]"></div>
		{/if}
	</div>
	<div></div>
</div>
