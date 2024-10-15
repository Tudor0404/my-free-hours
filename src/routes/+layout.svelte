<script>
	import '../app.postcss';
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';
	import duration from 'dayjs/plugin/duration';
	import LocalisedFormat from 'dayjs/plugin/localizedFormat';
	import dayjs from 'dayjs';
	import 'dayjs/locale/en-gb';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { appBarSubTitle } from '../stores/appbar';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	dayjs.extend(duration);
	dayjs.extend(LocalisedFormat);
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

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="text-xl flex flex-row gap-2">
					<a href="/">
						<strong class="text-xl uppercase">MFH</strong>
					</a>
					{#if $appBarSubTitle}
						<p class="text-xl">{$appBarSubTitle}</p>
					{/if}
				</div>
			</svelte:fragment>
			<!-- <svelte:fragment slot="trail">
				<Avatar class="w-9" />
			</svelte:fragment> -->
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
