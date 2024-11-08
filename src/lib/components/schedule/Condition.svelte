<script lang="ts">
	import ConditionBlock from '$lib/schedule/ConditionBlock';
	import ConditionSelect from './ConditionSelect.svelte';
	import NewRule from './NewRule.svelte';
	import DayBlock from '$lib/schedule/values/DayBlock';
	import DayField from './DayField.svelte';
	import DayOfWeekBlock from '$lib/schedule/values/DayOfWeekBlock';
	import DayOfWeekField from './DayOfWeekField.svelte';
	import MonthBlock from '$lib/schedule/values/MonthBlock';
	import MonthField from './MonthField.svelte';
	import DateBlock from '$lib/schedule/values/DateBlock';
	import DateField from './DateField.svelte';
	import TimeBlock from '$lib/schedule/values/TimeBlock';
	import type { Rule } from '$lib/schedule/ConditionBlock';
	import TimeField from './TimeField.svelte';
	import DeleteRule from '../input/buttons/DeleteRule.svelte';

	export let condition: ConditionBlock;

	export let onDelete: (() => void) | null = null;
	export let changeCallback: () => void;
	export let readOnly: boolean = false;

	$: {
		condition.rules = [...condition.rules];
		changeCallback();
	}

	function deleteRule(index: number) {
		condition.delete_rule(index);
		condition.rules = [...condition.rules];
	}

	function addRule(block: Rule) {
		condition.add_rule(block);
		condition.rules = [...condition.rules];
	}
</script>

<div class="flex flex-row justify-start mt-2">
	{#if onDelete}
		<div class="mt-4 w-4 h-0.5 bg-primary-200"></div>
	{/if}

	<div class="flex flex-col w-full">
		<div class="flex flex-row gap-2 justify-start items-center">
			<ConditionSelect
				bind:condition={condition.condition}
				numRules={condition.rules.length}
				disabled={readOnly}
			/>
			<NewRule
				disabled={readOnly || (condition.rules.length >= 1 && condition.condition == 'NOT')}
				createDay={() => addRule(new DayBlock('IN', []))}
				createWeekDay={() => addRule(new DayOfWeekBlock('IN', []))}
				createMonth={() => addRule(new MonthBlock('IN', []))}
				createDate={() => addRule(new DateBlock('IN', []))}
				createTime={() => addRule(new TimeBlock())}
				createAnd={() => addRule(new ConditionBlock('AND'))}
				createOr={() => addRule(new ConditionBlock('OR'))}
				createNot={() => addRule(new ConditionBlock('NOT'))}
			/>
			{#if onDelete && !readOnly}
				<div class="flex-grow h-0.5 rounded-md bg-primary-100/20"></div>
				<DeleteRule {onDelete} />
			{/if}
		</div>
		<div class="flex relative flex-col ml-4 border-l-2 border-primary-200">
			{#key condition.rules.length}
				{#each condition.rules as rule, i}
					{#if rule instanceof DayBlock}
						<DayField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly} />
					{:else if rule instanceof DayOfWeekBlock}
						<DayOfWeekField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly} />
					{:else if rule instanceof MonthBlock}
						<MonthField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly} />
					{:else if rule instanceof DateBlock}
						<DateField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly} />
					{:else if rule instanceof TimeBlock}
						<TimeField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly} />
					{:else if rule instanceof ConditionBlock}
						<svelte:self
							condition={rule}
							onDelete={() => deleteRule(i)}
							{changeCallback}
							{readOnly}
						/>
					{/if}
				{/each}
			{/key}

			{#if condition.rules.length > 0}
				<div
					class={'absolute bg-surface-100 w-[2rem] h-[1.25rem] -left-[1rem] ' +
						(condition.rules[condition.rules.length - 1] instanceof ConditionBlock
							? '-bottom-[6px]'
							: '-bottom-[1px]')}
				></div>
			{/if}
		</div>
	</div>
</div>
