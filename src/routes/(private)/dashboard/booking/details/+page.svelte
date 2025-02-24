<svelte:head>
	<title>MFH: Booking Page Details</title>
</svelte:head>

<script lang="ts">
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import Info from '$lib/components/misc/Info.svelte';
	import SelectSchedule from '$lib/components/schedule/SelectSchedule.svelte';
	import Icon from '@iconify/svelte';
	import { getToastStore, SlideToggle } from '@skeletonlabs/skeleton';
	import { superForm, fieldProxy } from 'sveltekit-superforms';

	export let data;

	const toastStore = getToastStore();

	const { form, enhance, errors } = superForm(data.form, {
		taintedMessage: true,
		onResult: ({ result }) => {
			if (result.type == 'success') {
				toastStore.trigger({
					message: 'Booking page details successfully updated!',
					background: 'variant-filled-success'
				});
			} else {
				toastStore.trigger({
					message: 'Booking page details unsucessfully updated!',
					background: 'variant-filled-error'
				});
			}
		},
		invalidateAll: 'force'
	});

	const inpersonScheduleProxy = fieldProxy(form, 'inperson_schedule');
	const onlineScheduleProxy = fieldProxy(form, 'online_schedule');

	function sendScheduleIDInperson(id: number) {
		inpersonScheduleProxy.set(id);
	}

	function sendScheduleIDOnline(id: number) {
		onlineScheduleProxy.set(id);
	}
</script>

<form
	class="flex flex-col gap-4 justify-start items-start w-full"
	use:enhance
	method="post"
	action="?/updateDetails"
>
	<div class="flex flex-row gap-2 justify-start items-center mb-4 w-full">
		<h4>Booking page details</h4>
		<SlideToggle
			active="bg-success-500"
			background="bg-error-500"
			size="sm"
			name="active"
			bind:checked={$form.active}
			label={$form.active ? 'active' : 'not active'}
		/>


		<button
			class="ml-auto btn btn-sm variant-glass-secondary hover:variant-filled-secondary"
			type="button"
			on:click={() => navigator.clipboard.writeText(`${data.origin}/book/${data.urlId}`)}
		>
			<Icon icon="tabler:link" class="mr-1" />
			Copy link
		</button
		>
	</div>
	<ErrorMessage error={$errors.active} />

	<label class="flex items-center space-x-2">
		<input
			class="checkbox"
			type="checkbox"
			bind:checked={$form.requires_email}
			name="requires_email"
		/>
		<span>Requires email</span>

		<ErrorMessage error={$errors.requires_email} />
	</label>

	<label class="label">
		<span>Required email domains </span>
		<Info
		>Comma separated list of acceptable email domains.<br />Leave empty to accept all domains.
		</Info
		>
		<input
			class="input"
			type="text"
			placeholder="warwick.ac.uk, google.com, ..."
			bind:value={$form.required_email_domains}
			name="required_email_domains"
		/>

		<ErrorMessage error={$errors.required_email_domains} />
	</label>

	<label class="label">
		<span>Time increment</span>
		<Info
		>Time increment at which slots are offered. E.g., if set to 15 minutes and the schedule starts
			at 10:00,<br /> the following will be offered: 10:00, 10:15, 10:30, ...
		</Info
		>
		<select class="select" bind:value={$form.time_increment} name="time_increment">
			<option value={5}>5 minutes</option>
			<option value={10}>10 minutes</option>
			<option value={15}>15 minutes</option>
			<option value={20}>20 minutes</option>
			<option value={30}>30 minutes</option>
			<option value={45}>45 minutes</option>
			<option value={60}>60 minutes</option>
		</select>

		<ErrorMessage error={$errors.time_increment} />
	</label>

	<div class="grid grid-cols-2 gap-4">
		<label class="label">
			<span>Minimum lead time</span>
			<select class="select" bind:value={$form.minimum_lead} name="minimum_lead">
				<option value={0}>0 minutes</option>
				<option value={15}>15 minutes</option>
				<option value={30}>30 minutes</option>
				<option value={60}>1 hour</option>
				<option value={180}>3 hours</option>
				<option value={360}>6 hours</option>
				<option value={1440}>1 day</option>
				<option value={4320}>3 day</option>
				<option value={10080}>1 week</option>
			</select>

			<ErrorMessage error={$errors.minimum_lead} />
		</label>

		<label class="label">
			<span>Maximum lead time</span>
			<select class="select" bind:value={$form.maximum_lead} name="maximum_lead">
				<option value={720}>12 hours</option>
				<option value={1440}>1 day</option>
				<option value={4320}>3 days</option>
				<option value={10080}>1 week</option>
				<option value={20160}>2 weeks</option>
				<option value={43800}>1 month</option>
				<option value={262980}>6 months</option>
				<option value={525960}>1 year</option>
			</select>

			<ErrorMessage error={$errors.maximum_lead} />
		</label>

		<label class="label">
			<span>Pre-meeting alert</span>
			<Info
			>How long before the meeting starts that the pre-meeting message is sent.
			</Info
			>
			<select class="select" bind:value={$form.pre_notification_time} name="pre_notification_time">
				<option value={30}>30 minutes</option>
				<option value={60}>1 hour</option>
				<option value={180}>3 hours</option>
				<option value={360}>6 hours</option>
				<option value={720}>12 hours</option>
				<option value={1440}>1 day</option>
				<option value={2880}>2 days</option>
			</select>

			<ErrorMessage error={$errors.pre_notification_time} />
		</label>

		<label class="label">
			<span>Post-meeting alert</span>
			<Info
			>How long after the meeting ends that the post-meeting message is sent.
			</Info
			>
			<select
				class="select"
				bind:value={$form.post_notification_time}
				name="post_notification_time"
			>
				<option value={30}>30 minutes</option>
				<option value={60}>1 hour</option>
				<option value={180}>3 hours</option>
				<option value={360}>6 hours</option>
				<option value={720}>12 hours</option>
				<option value={1440}>1 day</option>
				<option value={2880}>2 days</option>
			</select>

			<ErrorMessage error={$errors.post_notification_time} />
		</label>

		<label class="label">
			<span>Default pre-meeting message</span>
			<Info>Pre-meeting message to be sent if none is specified for the specific meeting type.<br>Message is sent
				regardless if it is specified or not.
			</Info
			>
			<textarea
				class="textarea"
				rows="4"
				placeholder="Leave empty for no default message"
				bind:value={$form.pre_notification}
				name="pre_notification"
			/>

			<ErrorMessage error={$errors.pre_notification} />
		</label>

		<label class="label">
			<span>Default post-meeting message</span>
			<Info
			>Post-meeting message to be sent if none is specified for the specific meeting type.<br>Message is not sent if not
				specified.
			</Info
			>
			<textarea
				class="textarea"
				rows="4"
				placeholder="Leave empty for no default message"
				bind:value={$form.post_notification}
				name="post_notification"
			/>

			<ErrorMessage error={$errors.post_notification} />
		</label>

		<label class="flex flex-col label">
			<span>In-person Schedule</span>

			<SelectSchedule
				schedules={data.schedules || []}
				sendScheduleID={sendScheduleIDInperson}
				initialID={$form.inperson_schedule}
			/>

			<input
				type="number"
				class="hidden"
				bind:value={$form.inperson_schedule}
				name="inperson_schedule"
			/>

			<ErrorMessage error={$errors.inperson_schedule} />
		</label>

		<label class="flex flex-col label">
			<span>Online schedule</span>

			<SelectSchedule
				schedules={data.schedules || []}
				sendScheduleID={sendScheduleIDOnline}
				initialID={$form.online_schedule}
			/>

			<input
				type="number"
				class="hidden"
				bind:value={$form.online_schedule}
				name="online_schedule"
			/>

			<ErrorMessage error={$errors.online_schedule} />
		</label>
	</div>

	<button class="btn variant-filled-success">Update</button>
</form>
