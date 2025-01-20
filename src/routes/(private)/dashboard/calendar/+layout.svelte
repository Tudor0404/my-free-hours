<script lang="ts">
	import { schedulesStore } from '$lib/stores/schedules';
</script>

{#await schedulesStore.refresh() then s}
	<slot />
{/await}
