<script lang="ts">
	import RootSchedule from '$lib/components/schedule/RootSchedule.svelte';
	// import test from '$lib/schedule/test';
</script>

<div class="flex flex-col gap-2">
	<h3>Your schedules</h3>
</div>

<div class="flex flex-col gap-2 w-full">
	<h3>Create a new schedule</h3>
	<form class="flex flex-col gap-2">
		<label class="label">
			<span>Name</span>
			<input class="input" type="text" placeholder="Name" />
		</label>

		<label class="label">
			<span>Description</span>
			<textarea class="textarea" placeholder="Name" />
		</label>

		<span class="label">Schedule</span>
		<RootSchedule />
	</form>
</div>
