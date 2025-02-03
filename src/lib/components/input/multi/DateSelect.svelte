<script lang="ts">
	import Icon from '@iconify/svelte';
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import dayjs, { type Dayjs } from 'dayjs';
	import { flip } from '@floating-ui/dom';

	export let days: Dayjs[];
	export let disabled: boolean = false;
	let isPopupOpen: boolean = false;
	let daysNew: string;

	const popupUUID = 'datePopup' + Math.random();
	const dayPopup: PopupSettings = {
		event: 'click',
		target: popupUUID,
		placement: 'top',
		closeQuery: '.close-popup',
		state: (e) => (isPopupOpen = e.state),

		middleware: { flip }
	};
</script>

<button
	type="button"
	use:popup={dayPopup}
	class="px-2 py-1 btn btn-sm variant-outline-tertiary hover:variant-filled-tertiary w-fit"
>
	<span>{days.length} {days.length == 1 ? 'day' : 'days'}</span>

	<div class={`transition-all duration-150' ${isPopupOpen ? 'rotate-180' : 'rotate-0'}`}>
		<Icon icon="tabler:chevron-up" />
	</div>
</button>

<div class="z-10 justify-start items-stretch p-2 shadow-xl card w-[220px]" data-popup={popupUUID}>
	<div class="flex flex-col gap-2">
		<div class="flex flex-row gap-1">
			<input
				type="date"
				class="px-0.5 py-0.5 h-8 text-sm input w-fit"
				bind:value={daysNew}
				min={dayjs().format('YYYY-MM-DD')}
				{disabled}
			/>
			<button
				class="w-full btn btn-sm variant-outline-success hover:variant-filled-tertiary"
				type="button"
				{disabled}
				on:click={() => {
					let newDay = dayjs(daysNew, 'YYYY-MM-DD', true);

					if (newDay.isValid()) {
						if (days.findIndex((d) => d.isSame(newDay)) == -1) {
							days = [...days, newDay];
						}
						daysNew = '';
					}
				}}>Add</button
			>
		</div>
		<div class="p-1 space-y-1">
			<span>{days.length} Days selected</span>
			<div
				class="max-h-[150px] flex flex-col justify-start items-stretch gap-1 overflow-y-scroll hide-scrollbar"
			>
				{#each days as day, i}
					<button
						{disabled}
						type="button"
						class="justify-between w-full btn btn-sm variant-outline hover:variant-outline-error"
						on:click={() => (days = [...days.slice(0, i), ...days.slice(i + 1, days.length)])}
					>
						<span>{day.format('DD/MM/YYYY')}</span>
						<span><Icon icon="tabler:x" /></span>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<button
		class="absolute -top-3 -right-3 w-6 h-6 shadow-lg btn-icon variant-filled-error close-popup"
		type="button"
	>
		<Icon icon="tabler:x" />
	</button>
</div>
