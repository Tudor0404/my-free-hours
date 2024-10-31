<script lang="ts">
	export let error: string[] | undefined;
</script>

{#if error}
	<span class="text-error-500-400-token">{error.join('\n')}</span>
{/if}
