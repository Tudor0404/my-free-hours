<script lang="ts">
	import ButtonLoader from '$lib/components/buttons/ButtonLoader.svelte';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { appBarSubTitle } from '$stores/appbar';

	export let data;
	$: ({ supabase } = data);
</script>

<AppShell slotHeader="shadow-sm [&>div]:p-3">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex flex-row gap-2 text-xl">
					<a href="/">
						{#if $appBarSubTitle}
							<strong class="text-xl">MFH</strong>
						{:else}
							<strong class="text-xl">My Free Hours</strong>
						{/if}
					</a>
					{#if $appBarSubTitle}
						<p class="text-xl">{$appBarSubTitle}</p>
					{/if}
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#await supabase.auth.getUser()}
					<ButtonLoader class="btn-sm variant-filled-primary" text="Dashboard" />
				{:then user}
					{#if user.data.user}
						<a
							href="/dashboard"
							class="btn btn-sm variant-filled-primary"
							data-sveltekit-preload-data="hover">Dashboard</a
						>
					{:else}
						<a
							href="/auth"
							class="btn btn-sm variant-filled-primary"
							data-sveltekit-preload-data="hover">Login</a
						>
					{/if}
				{/await}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
