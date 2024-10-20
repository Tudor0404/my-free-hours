<script lang="ts">
	import Schedule from '$lib/schedule/Schedule';
	import Condition from './Condition.svelte';

	let schedule: Schedule = new Schedule();
</script>

<div class="w-full">
	<Condition condition={schedule.root} />
</div>
