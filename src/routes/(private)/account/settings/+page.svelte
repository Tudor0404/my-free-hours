<script lang="ts">
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import HorizontalRule from '$lib/components/misc/HorizontalRule.svelte';
	import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
	import { superForm, arrayProxy, fieldProxy } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import Info from '$lib/components/misc/Info.svelte';
	import dayjs, { type Dayjs } from 'dayjs';
	import DateSelect from '$lib/components/input/multi/DateSelect.svelte';
	let msSVG = '/media/ms-symbol.svg';

	const toastStore = getToastStore();

	export let data;

	$: ({ supabase } = data);

	$: azureIdentity = data.identities?.identities.find((i) => i.provider === 'azure');

	const {
		form: nameForm,
		enhance: nameEnhance,
		errors: nameErrors
	} = superForm(data.nameForm, {
		taintedMessage: true,
		onResult: ({ result }) => {
			if (result.type == 'success') {
				toastStore.trigger({
					message: 'User details successfully updated!',
					background: 'variant-filled-success'
				});
			} else {
				toastStore.trigger({
					message: 'User details unsucessfully updated!',
					background: 'variant-filled-error'
				});
			}
		},
		invalidateAll: 'force'
	});

	const {
		form: blacklistForm,
		enhance: blacklistEnhance,
		errors: blacklistErrors
	} = superForm(data.blacklistForm, {
		taintedMessage: true,
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type == 'success') {
				toastStore.trigger({
					message: 'Blacklisted days successfully updated!',
					background: 'variant-filled-success'
				});
			} else {
				toastStore.trigger({
					message: 'Blacklisted days unsucessfully updated!',
					background: 'variant-filled-error'
				});
			}
		},
		invalidateAll: 'force'
	});

	const blacklistDaysProxy = fieldProxy(blacklistForm, 'days');

	let blacklistedDays: Dayjs[] = [];
	let previousFormData: string[] = [];
	$: {
		const currentDays = $blacklistForm.days || [];
		const daysChanged = JSON.stringify(currentDays) !== JSON.stringify(previousFormData);

		if (daysChanged) {
			blacklistedDays = currentDays.map((date) => dayjs(date));
			previousFormData = currentDays;
		}
	}

	$: {
		blacklistDaysProxy.set(blacklistedDays.map((e) => e.format('YYYY-MM-DD')));
	}

	let deletedMeetingsCount: number = 0;

	async function updateDeletedMeetingsCont() {
		const { data } = await supabase.rpc('get_bookings_count_by_dates', {
			dates: $blacklistForm.days
		});
		if (data) {
			deletedMeetingsCount = data;
		}
	}

	$: {
		if ($blacklistForm.days) {
			updateDeletedMeetingsCont();
		}
	}
</script>

<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="summary"><h4>User settings</h4></svelte:fragment>
		<svelte:fragment slot="content">
			<form
				class="flex flex-col gap-4 justify-start items-start w-full"
				use:nameEnhance
				method="post"
				action="?/updateUser"
			>
				<label class="label">
					<p>Display Name</p>
					<input
						class="input"
						type="text"
						bind:value={$nameForm.display_name}
						name="display_name"
						placeholder="Mr. J Doe"
					/>

					<ErrorMessage error={$nameErrors.display_name} />
				</label>

				<button class="btn btn-sm variant-filled-success" type="submit">Update</button>
			</form>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary">
			<div class="flex flex-row gap-2 justify-start items-center">
				<h4>Microsoft</h4>
				{#if azureIdentity}
					<Icon icon="tabler:check" class="text-success-700"></Icon>
				{:else}
					<Icon icon="tabler:x" class="text-error-700"></Icon>
				{/if}
			</div></svelte:fragment
		>
		<svelte:fragment slot="content">
			{#if data.identities && azureIdentity}
				<button
					class="space-x-3 w-fit btn variant-glass-tertiary"
					disabled={data.identities.identities.length < 2}
					on:click={async () => {
						const id = azureIdentity;
						if (id) {
							const { error } = await supabase.auth.unlinkIdentity(id);
							invalidate('supabase:auth:identities');

							if (error) {
								toastStore.trigger({
									message: 'Unsuccessfuly unlinked azure to account',
									background: 'variant-filled-error'
								});
							} else {
								toastStore.trigger({
									message: 'Successfuly unlinked azure to account',
									background: 'variant-filled-success'
								});
							}
						}
					}}><img src={msSVG} alt="Example Icon" /> <span>Sign out of Microsoft</span></button
				>
			{:else}
				<button
					class="space-x-3 w-fit btn variant-glass-tertiary"
					on:click={async () => {
						const { error } = await supabase.auth.linkIdentity({
							provider: 'azure',
							options: {
								scopes: 'email offline_access Calendars.ReadWrite',
								redirectTo: $page.url.origin + '/account/settings'
							}
						});

						if (error) {
							toastStore.trigger({
								message: 'Unsuccessfuly linked azure to account',
								background: 'variant-filled-error'
							});
						}
					}}><img src={msSVG} alt="Example Icon" /> <span>Sign in with Microsoft</span></button
				>
			{/if}
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Blacklisted days</h4></svelte:fragment>
		<svelte:fragment slot="content">
			<p class="text-gray-600">
				Blacklisting days is an easy way to quickly remove days (and bookings) <br /> for set days from
				ALL schedules. Useful for holidays and sick days.
			</p>

			<form
				class="flex flex-col gap-2"
				use:blacklistEnhance
				method="post"
				action="?/updateBlacklistDays"
			>
				<div class="flex flex-row gap-2 justify-start items-center">
					<DateSelect bind:days={blacklistedDays} />

					<p>
						(would delete {deletedMeetingsCount}
						{deletedMeetingsCount === 1 ? 'meeting' : 'meetings'})
					</p>
				</div>
				<ErrorMessage error={$blacklistErrors.days?._errors} />

				<label class="label">
					<input
						type="checkbox"
						class="checkbox"
						bind:checked={$blacklistForm.deleteMeetings}
						name="deleteMeetings"
					/>
					Cancel existing meetings and notify parties (of ALL selected days)
				</label>

				<ErrorMessage error={$blacklistErrors.deleteMeetings} />

				<button class="mt-2 btn btn-sm variant-filled-success w-fit">Update</button>
			</form>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>ICS calendar</h4></svelte:fragment>
		<svelte:fragment slot="content">
			<div class="flex flex-col gap-2">
				{#if data.calendar_id}
					<button
						class="flex flex-row gap-2 justify-start items-center btn variant-outline-secondary hover:variant-filled-secondary w-fit"
						on:click={() =>
							navigator.clipboard.writeText(`${$page.url.origin}/api/calendar/${data.calendar_id}`)}
					>
						<Icon icon="tabler:copy"></Icon>
						Copy link
					</button>
				{/if}

				<button
					class="flex flex-row gap-2 justify-start items-center btn variant-outline-tertiary hover:variant-filled-tertiary w-fit"
				>
					<Icon icon="tabler:refresh" />
					Regenerate link
				</button>
			</div>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="summary"><h4>Delete Account</h4></svelte:fragment>
		<svelte:fragment slot="content"></svelte:fragment>
	</AccordionItem>
</Accordion>
