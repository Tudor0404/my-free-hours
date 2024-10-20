<script lang="ts">
	import type DayBlock from '$lib/schedule/values/DayBlock';
	import FieldContainer from './FieldContainer.svelte';

	export let block: DayBlock;
	export let onDelete: () => void;
</script>

<FieldContainer field="Day" {onDelete}></FieldContainer>
