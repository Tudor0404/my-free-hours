<script lang="ts">
	import type ConditionBlock from '$lib/schedule/ConditionBlock';
	import Icon from '@iconify/svelte';
	import ConditionSelect from './ConditionSelect.svelte';
	import NewRule from './NewRule.svelte';
	import DayBlock from '$lib/schedule/values/DayBlock';
	import DayField from './DayField.svelte';
	import DayOfWeekBlock from '$lib/schedule/values/DayOfWeekBlock';
	import DayOfWeekField from './DayOfWeekField.svelte';
	import MonthBlock from '$lib/schedule/values/MonthBlock';
	import type ValueBlock from '$lib/schedule/values/ValueBlock';
	import MonthField from './MonthField.svelte';
	import DateBlock from '$lib/schedule/values/DateBlock';
	import DateField from './DateField.svelte';

	export let condition: ConditionBlock;

	export let onDelete: (() => void) | null = null;

	$: condition.rules = [...condition.rules];

	function deleteRule(index: number) {
		condition.delete_rule(index);
		condition.rules = [...condition.rules];
	}

	function addRule(block: ValueBlock<any>) {
		condition.add_rule(block);
		condition.rules = [...condition.rules];
	}
</script>

<div class="flex flex-col">
	<div class="flex flex-row gap-2 justify-start items-center">
		<ConditionSelect />
		<NewRule
			createDay={() => addRule(new DayBlock('IN', []))}
			createWeekDay={() => addRule(new DayOfWeekBlock('IN', []))}
			createMonth={() => addRule(new MonthBlock('IN', []))}
			createDate={() => addRule(new DateBlock('IN', []))}
		/>
	</div>
	<div class="flex relative flex-col ml-4 border-l-2 border-primary-200">
		{#key condition.rules.length}
			{#each condition.rules as rule, i}
				{#if rule instanceof DayBlock}
					<DayField bind:block={rule} onDelete={() => deleteRule(i)} />
				{:else if rule instanceof DayOfWeekBlock}
					<DayOfWeekField bind:block={rule} onDelete={() => deleteRule(i)} />
				{:else if rule instanceof MonthBlock}
					<MonthField bind:block={rule} onDelete={() => deleteRule(i)} />
				{:else if rule instanceof DateBlock}
					<DateField bind:block={rule} onDelete={() => deleteRule(i)} />
				{/if}
			{/each}
		{/key}

		{#if condition.rules.length > 0}
			<div class="absolute bg-surface-100 w-[2rem] h-[1.25rem] -bottom-[1px] -left-[1rem]"></div>
		{/if}
	</div>
	<div></div>
</div>
