<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		AppShell,
		AppBar,
		ListBox,
		ListBoxItem,
		AppRail,
		AppRailAnchor,
		AppRailTile
	} from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import type { SvelteComponent } from 'svelte';

	export let data;
	$: ({ supabase } = data);

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};

	const catalogue: {
		title: string;
		pages: {
			name: string;
			url: string;
			icon: string;
		}[];
	}[] = [
		{
			title: 'Account',
			pages: [
				{
					name: 'Calendar',
					url: '/dashboard/calendar',
					icon: 'tabler:calendar-event'
				},
				{
					name: 'Schedules',
					url: '/dashboard/schedules',
					icon: 'tabler:schema'
				},
				{
					name: 'Settings',
					url: '/account/settings',
					icon: 'tabler:user'
				}
			]
		},
		{
			title: 'Booking Page',
			pages: [
				{ name: 'Details', url: '/dashboard/booking/details', icon: 'tabler:list-details' },
				{ name: 'Types', url: '/dashboard/booking/types', icon: 'tabler:category' },
				{ name: 'Availability', url: '/dashboard/booking/availability', icon: 'tabler:clock' }
			]
		}
	];

	$: listboxItemActive = (href: string) =>
		$page.url.pathname?.includes(href) ? 'bg-primary-active-token' : '';
</script>

<AppShell slotHeader="shadow-sm [&>div]:p-3" slotSidebarLeft="shadow-inner">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="text-xl flex flex-row gap-2">
					<a href="/">
						<strong class="text-xl">My Free Hours</strong>
					</a>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button
					class="btn btn-sm variant-filled-primary"
					data-sveltekit-preload-data="hover"
					on:click={logout}>Sign out</button
				>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<section class="p-4 pb-20 space-y-4 overflow-y-auto bg-surface-300 min-h-full">
			{#each catalogue as segment, i}
				<!-- Title -->
				<h3 class="pl-4 font-semibold text-secondary-800">{segment.title}</h3>
				<!-- Nav List -->
				<nav class="list-nav">
					<ul>
						{#each segment.pages as page}
							<li class="w-[200px]">
								<a
									href={page.url}
									class={listboxItemActive(page.url)}
									data-sveltekit-preload-data="hover"
								>
									{#if page.icon}
										<Icon icon={page.icon} class="h-full aspect-square" />
									{/if}
									<span class="flex-auto">{page.name}</span>
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/each}
		</section>
	</svelte:fragment>

	<div class="w-full h-full p-4">
		<div
			class="card shadow-md container min-h-[50%] flex flex-col gap-4 justify-start items-start p-4"
		>
			<slot />
		</div>
	</div>
</AppShell>
