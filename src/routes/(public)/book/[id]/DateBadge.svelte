<script lang="ts">
	export let day: number;
	export let online: boolean;
	export let inPerson: boolean;
</script>

<p>
	{day}
	{#if !online}
		<span class="badge-icon variant-filled-tertiary"></span>
	{:else if !inPerson}
		<span class="badge-icon variant-filled-tertiary"></span>
	{/if}
</p>
