<script>
	import Button from '$lib/components/Buttons/XBarButton.svelte'
	import Logo from '$lib/assets/MainLogo.svelte';
	let itemsE =
		[
			['Abrir OS', '/abrir_os','upBar cornerL'],
		]
	let itemsD = 
		[
			['Logout', '/logout', 'upBar cornerR'],
			['Perfil', '/perfil', 'upBar']
		]
	let itemsAll = [itemsE, itemsD]
</script>
	<ul class="upBar">
	{#each itemsAll as items}
		<ul class="third items">
		{#each items as [name, href, option]}
			<Button {...{name, href, option}}/>
		{/each}
		</ul>
		{#if itemsAll.indexOf(items)===0}
		<li class="logo third">
			<Logo/>
		</li>
		{/if}
	{/each}
	</ul>
<style>
	ul {
		padding: 0
	}
	.logo {
		place-content: center;
		padding: 1em 2em;
		display: grid;
	}
	.upBar {
		display: flex;
		margin: auto;
	}
	.third {
		width: 30vw;
	}
	.third.items {
		display: grid;
	}

</style>