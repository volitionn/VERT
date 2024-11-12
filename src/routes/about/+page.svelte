<script lang="ts">
	import avatarNullptr from "$lib/assets/avatars/nullptr.jpg";
	import avatarRealmy from "$lib/assets/avatars/realmy.jpg";
</script>

<div class="text-lg mx-auto max-w-screen-md">
	<h1 class="font-display text-3xl">⁉️ about VERT</h1>
	<p class="mt-6">
		You know what sucks? File converters! They're usually riddled with ads,
		and take an ungodly amount of time to complete. <b
			>So we made a better one!</b
		>
	</p>
	<p class="mt-4">
		VERT is a file converter that's open source, completely ad free, and
		much much faster than you're used to. All the converting is done on your
		device, which makes it both private and very speedy. And it of course
		has a beautiful UI! ✨
	</p>

	<h2 class="font-display text-3xl mt-12">🎨 credits</h2>
	<div class="flex gap-4 mt-8">
		<a
			class="w-48 border-2 border-solid border-foreground-muted-alt rounded-2xl overflow-hidden transition-all hover:scale-105"
			href="https://nullp.tr"
		>
			<img src={avatarNullptr} alt="nullptr's cat avatar" />
			<div class="text-center py-4 px-2">
				<p class="font-display text-xl">nullptr</p>
				<p class="text-sm text-foreground-muted mt-2">
					car mrrow 🐱🐱🐱
				</p>
			</div>
		</a>

		<a
			class="w-48 border-2 border-solid border-foreground-muted-alt rounded-2xl overflow-hidden transition-all hover:scale-105"
			href="https://realmy.net"
		>
			<img src={avatarRealmy} alt="nullptr's cat avatar" />
			<div class="text-center py-4 px-2">
				<p class="font-display text-xl">Realmy</p>
				<p class="text-sm text-foreground-muted mt-2">
					scayr dragon 😱 (grrr)
				</p>
			</div>
		</a>
	</div>

	<p class="text-foreground-muted text-base mt-10">
		(obviously inspired by <a
			href="https://cobalt.tools"
			class="hover:underline">cobalt.tools</a
		>)
	</p>
</div>
