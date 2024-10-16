<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';
	import duration from 'dayjs/plugin/duration';
	import LocalisedFormat from 'dayjs/plugin/localizedFormat';
	import dayjs from 'dayjs';
	import 'dayjs/locale/en-gb';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { appBarSubTitle } from '../stores/appbar';

	// Floating UI for Popups
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	//dayjs
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
			<svelte:fragment slot="trail">
				{#await supabase.auth.getUser() then user}
					{#if user.data.user}
						<a href="/account" class="btn btn-sm variant-filled" data-sveltekit-preload-data="hover"
							>Dashboard</a
						>
					{:else}
						<a href="/auth" class="btn btn-sm variant-filled" data-sveltekit-preload-data="hover"
							>Login</a
						>
					{/if}
				{/await}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
