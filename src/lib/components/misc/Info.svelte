<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { flip } from '@floating-ui/dom';

	const popupUUID = 'infoPopup' + Math.random();
	const infoPopup: PopupSettings = {
		event: 'click',
		target: popupUUID,
		placement: 'top',
		closeQuery: '.close-popup',
		middleware: { flip }
	};
</script>

<button
	class="h-6 opacity-60 cursor-pointer aspect-square"
	use:popup={infoPopup}
	on:click|preventDefault
	type="button"
>
	<Icon icon="tabler:info-circle" class="w-full h-full" />
</button>

<div data-popup={popupUUID} class="p-2 shadow card">
	<slot />
</div>
