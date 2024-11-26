<script lang="ts">
	import TimeBlock from '$lib/schedule/values/TimeBlock';
	import type { HoursMinutes } from '$types/HoursMinutes';
	import { timeToMilitaryString } from '$lib/utils/time';
	import { flip } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let value: HoursMinutes;
	export let maxValue: HoursMinutes = TimeBlock.LATEST_TIME;
	export let minValue: HoursMinutes = TimeBlock.EARLIEST_TIME;
	export let readOnly: boolean = false;

	const popupUUID = 'timePopup' + Math.random();
	const timePopup: PopupSettings = {
		event: 'click',
		target: popupUUID,
		placement: 'top',
		closeQuery: '.close-popup',
		middleware: { flip }
	};

	$: {
		if (value.hours == 24) {
			value.minutes = 0;
		}
	}

	function minuteBounds(minutes: number) {
		if (value.hours == maxValue.hours && minutes > maxValue.minutes) {
			value.minutes = maxValue.minutes;
		}

		if (value.hours == minValue.hours && minutes < minValue.minutes) {
			value.minutes = minValue.minutes;
		}
	}
</script>

<button class="font-mono btn-schedule" type="button" use:popup={timePopup} disabled={readOnly}>
	{timeToMilitaryString(value)}
</button>

<div class="z-10 p-2 shadow-xl card" data-popup={popupUUID}>
	<div class="grid grid-cols-[1fr_150px] gap-x-2 gap-y-2">
		<span>Hours</span>
		<input
			type="range"
			class="w-[150px]"
			bind:value={value.hours}
			max={24}
			min={0}
			disabled={readOnly}
			on:input={(e) => {
				const val = Number.parseInt(e.currentTarget.value);
				if (val > maxValue.hours) {
					value.hours = maxValue.hours;
					minuteBounds(value.minutes);
				} else if (val < minValue.hours) {
					value.hours = minValue.hours;
					minuteBounds(value.minutes);
				}
			}}
		/>

		<span>Minutes</span>
		<input
			type="range"
			bind:value={value.minutes}
			max={55}
			min={0}
			step={5}
			disabled={value.hours == 24 || readOnly}
			on:input={(e) => minuteBounds(Number.parseInt(e.currentTarget.value))}
		/>
	</div>

	<button
		class="absolute -top-3 -right-3 w-6 h-6 shadow-lg btn-icon variant-filled-error close-popup"
		type="button"
	>
		<Icon icon="tabler:x" />
	</button>
</div>
