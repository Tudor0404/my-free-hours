<script lang="ts">
	import { absoluteTimeToObject, durationToString } from '$lib/utils/time';
	import Icon from '@iconify/svelte';

	export let data;
</script>

<div>
	<h3>
		<a href="/dashboard/booking/types" class="flex flex-row gap-2 justify-start items-center"
			><Icon icon="tabler:arrow-left" /> Back to all meeting types</a
		>
	</h3>
</div>

<div class="flex flex-col gap-4 mt-4">
	{#if data.type}
		<h4 class="font-medium">
			{data.type.name}
			<span class={data.type.active ? 'text-success-600' : 'text-error-600'}
				>({data.type.active ? 'active' : 'inactive'})</span
			>
		</h4>

		<div class="flex flex-col gap-2">
			<div class="flex flex-row gap-2">
				{#if data.type.online}
					<div class="space-x-2 cursor-default chip variant-outline-success">
						<Icon icon="tabler:check" class="text-success-700-200-token" /> <span>online</span>
					</div>
				{:else}
					<div class="space-x-2 cursor-default chip variant-outline-error">
						<Icon icon="tabler:x" class="text-error-700-200-token" /><span>online</span>
					</div>
				{/if}

				{#if data.type.in_person}
					<div class="space-x-2 cursor-default chip variant-outline-success">
						<Icon icon="tabler:check" class="text-success-700-200-token" /> <span>in person</span>
					</div>
				{:else}
					<div class="space-x-2 cursor-default chip variant-outline-error">
						<Icon icon="tabler:x" class="text-error-700-200-token" /> <span>in person</span>
					</div>
				{/if}
			</div>

			<div class="flex flex-row gap-2">
				{#each data.type.durations || [] as duration}
					<div class="cursor-default chip variant-outline-primary">
						<span>{durationToString(absoluteTimeToObject(duration))}</span>
					</div>
				{/each}
			</div>
		</div>
		<div>
			<h6 class="font-medium">Description</h6>
			{data.type.description ? data.type.description : 'None'}
		</div>

		<div>
			<h6 class="font-medium">Pre-meeting notification</h6>
			{data.type.pre_notification ? data.type.pre_notification : 'None'}
		</div>

		<div>
			<h6 class="font-medium">Post-meeting notification</h6>
			{data.type.post_notification ? data.type.post_notification : 'None'}
		</div>
	{:else}
		<p>Unable to fine meeting type</p>
	{/if}
</div>
