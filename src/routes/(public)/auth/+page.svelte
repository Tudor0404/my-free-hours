<script>
	import HorizontalRule from '$lib/components/misc/HorizontalRule.svelte';

	let msSVG = '/media/ms-symbol.svg';
</script>

<div class="flex justify-center items-center w-full h-full">
	<div class="flex flex-col justify-start items-stretch p-4 space-y-2 bg-surface-200 card">
		<form
			method="POST"
			action="?/login"
			class="flex flex-col justify-start items-stretch space-y-2"
		>
			<label class="label">
				Email
				<input name="email" type="email" class="input" />
			</label>
			<label class="label">
				Password
				<input name="password" type="password" class="input" />
			</label>
			<button formaction="?/login" class="btn variant-filled-success">Login</button>
			<button formaction="?/signup" class="btn variant-filled-tertiary">Sign up</button>
		</form>
		<HorizontalRule />
		<form method="POST" action="?/loginMicrosoft" class="w-full">
			<button class="space-x-3 w-full btn variant-glass-tertiary"
				><img src={msSVG} alt="Example Icon" /> <span>Sign in with Microsoft</span></button
			>
		</form>
	</div>
</div>
