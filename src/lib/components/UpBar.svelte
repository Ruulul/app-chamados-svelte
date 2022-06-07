<script>
	import Button from '$lib/components/Buttons/XBarButton.svelte'
	import Logo from '$lib/assets/MainLogo.svelte';
	let itemsE =
		[
			['Abrir OS', '/abrir_os','upBar'],
		]
	let itemsD = 
		[
			['Perfil', '/perfil', 'upBar'],
			['Logout', '/logout', 'upBar']
		]
	let itemsAll = [itemsE, itemsD]
</script>
	<ul class="upBar">
	{#each itemsAll as items}
		<ul class="third items 
		{itemsAll.indexOf(items)===0
		 ? 'left'
		 : 'right'}">
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
		padding: 0;
		display: flex;
	}
	.logo {
		place-content: center;
		padding: 1em 2em;
		display: grid;
	}
	.third {
		width: 33vw;
	}
	
	.left {
		justify-content: flex-start
	}
	.right {
		justify-content: flex-end
	}
</style>