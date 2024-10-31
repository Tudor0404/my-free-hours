<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	// Client API:
	const { form } = superForm(data.form);
</script>

<form class="flex flex-col gap-2 justify-start items-start w-full">
	<label class="flex items-center self-end space-x-2 label">
		<span>Active</span>
		<SlideToggle active="bg-success-700" size="sm" name="active" required />
	</label>

	<label class="flex items-center space-x-2 label">
		<input class="checkbox" type="checkbox" checked />
		<span>Requires email</span>
	</label>
</form>
