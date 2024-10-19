<script lang="ts">
	import '../app.postcss';
	import duration from 'dayjs/plugin/duration';
	import LocalisedFormat from 'dayjs/plugin/localizedFormat';
	import isBetween from 'dayjs/plugin/isBetween';
	import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
	import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	import dayjs from 'dayjs';
	import 'dayjs/locale/en-gb';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	//dayjs
	dayjs.extend(duration);
	dayjs.extend(LocalisedFormat);
	dayjs.extend(isBetween);
	dayjs.extend(isSameOrAfter);
	dayjs.extend(isSameOrBefore);
	dayjs.extend(customParseFormat);
	dayjs.locale('en-gb');

	// Supabase
	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
