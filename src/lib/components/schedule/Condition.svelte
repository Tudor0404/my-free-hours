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
	import ScheduleBlock from '$lib/schedule/values/ScheduleBlock';
	import ScheduleField from './ScheduleField.svelte';
	import type { Database } from '$types/database.types';
	import DuplicateRule from '$lib/components/input/buttons/DuplicateRule.svelte';
	import WrapRule from '$lib/components/schedule/WrapRule.svelte';


	export let condition: ConditionBlock;

	export let onDelete: (() => void) | undefined = undefined;
	export let onDuplicate: (() => void) | undefined = undefined;
	export let setRoot: ((block: ConditionBlock) => void) | undefined = undefined;
	export let changeCallback: () => void;
	export let readOnly: boolean = false;
	export let schedules: Database['public']['Tables']['schedule']['Row'][] | null = [];

	$: {
		condition.rules = [...condition.rules];
		changeCallback();
	}

	function deleteRule(index: number) {
		condition.delete_rule(index);
		condition.rules = [...condition.rules];
	}

	function duplicateRule(index: number) {
		const rule = condition.rules[index];

		condition.add_rule(rule.clone(), index);
		condition.rules = [...condition.rules];
	}

	function addRule(block: Rule) {
		condition.add_rule(block);
		condition.rules = [...condition.rules];
	}

	function wrapRule(index: number, c: 'AND' | 'OR' | 'NOT') {
		const newCondition = new ConditionBlock(c);

		if (index == -1) {
			newCondition.add_rule(condition.clone());
			condition = newCondition;

			if (setRoot) {
				setRoot(newCondition);
			}
		} else {
			newCondition.add_rule(condition.rules[index].clone());
			deleteRule(index);
			condition.add_rule(newCondition, index);
			condition.rules = [...condition.rules];
		}


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
				{readOnly}
				disabled={condition.rules.length >= 1 && condition.condition == 'NOT'}
				createDay={() => addRule(new DayBlock('IN', []))}
				createWeekDay={() => addRule(new DayOfWeekBlock('IN', []))}
				createMonth={() => addRule(new MonthBlock('IN', []))}
				createDate={() => addRule(new DateBlock('IN', []))}
				createTime={() => addRule(new TimeBlock())}
				createAnd={() => addRule(new ConditionBlock('AND'))}
				createOr={() => addRule(new ConditionBlock('OR'))}
				createNot={() => addRule(new ConditionBlock('NOT'))}
				createSchedule={() => addRule(new ScheduleBlock(-1))}
			/>
			<WrapRule
				{readOnly}
				wrapAnd={() => wrapRule(-1, "AND")}
				wrapOr={() => wrapRule(-1, "OR")}
				wrapNot={() => wrapRule(-1, "NOT")}

			></WrapRule>
			{#if !readOnly}
				<div class="flex-grow h-0.5 rounded-md bg-primary-100/20"></div>
				{#if onDuplicate}
					<DuplicateRule {onDuplicate} />
				{/if}
				{#if onDelete}
					<DeleteRule {onDelete} />
				{/if}
			{/if}
		</div>
		<div class="flex relative flex-col ml-4 border-l-2 border-primary-200">
			{#key condition.rules.length}
				{#each condition.rules as rule, i}
					{#if rule instanceof DayBlock}
						<DayField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly}
											onDuplicate={() => duplicateRule(i)} />
					{:else if rule instanceof DayOfWeekBlock}
						<DayOfWeekField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly}
														onDuplicate={() => duplicateRule(i)} />
					{:else if rule instanceof MonthBlock}
						<MonthField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly}
												onDuplicate={() => duplicateRule(i)} />
					{:else if rule instanceof DateBlock}
						<DateField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly}
											 onDuplicate={() => duplicateRule(i)} />
					{:else if rule instanceof TimeBlock}
						<TimeField bind:block={rule} onDelete={() => deleteRule(i)} {readOnly}
											 onDuplicate={() => duplicateRule(i)} />
					{:else if rule instanceof ScheduleBlock}
						<ScheduleField
							bind:block={rule}
							onDelete={() => deleteRule(i)}
							{readOnly}
							{schedules}
							onDuplicate={() => duplicateRule(i)}
						/>
					{:else if rule instanceof ConditionBlock}
						<svelte:self
							condition={rule}
							onDelete={() => deleteRule(i)}
							{changeCallback}
							{readOnly}
							{schedules}
							onDuplicate={() => duplicateRule(i)}
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
