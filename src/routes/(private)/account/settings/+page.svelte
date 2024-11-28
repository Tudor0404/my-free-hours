<script lang="ts">
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';

	const toastStore = getToastStore();

	export let data;

	const { form, enhance, errors } = superForm(data.form, {
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
</script>

<form
	class="flex flex-col gap-4 justify-start items-start w-full"
	use:enhance
	method="post"
	action="?/updateUser"
>
	<h4>User settings</h4>

	<label class="label">
		<p>Display Name</p>
		<input
			class="input"
			type="text"
			bind:value={$form.display_name}
			name="display_name"
			placeholder="Mr. J Doe"
		/>

		<ErrorMessage error={$errors.display_name} />
	</label>

	<button class="btn btn-sm variant-filled-success" type="submit">Update</button>
</form>
