<script>
	import Icon from '$lib/components/MenuIcon.svelte'
	import Tooltip from '$lib/components/Tooltip.svelte'
	import Logo from '$lib/assets/MainLogo.svelte';
	let itemsE =
		[
			['Abrir O.S.', '/abrir_os'],
		]
	let itemsD = 
		[
			['Perfil', '/perfil'],
			['Logout', '/logout']
		]
	let itemsAll = [itemsE, itemsD]
</script>
	<ul name="Barra superior">
	{#each itemsAll as items}
		<ul class="third 
		{itemsAll.indexOf(items)===0
		 ? 'left'
		 : 'right'}">
		{#each items as [name, href]}
			<li>
				<span hidden>{name}</span>
				<Tooltip tip={name}>
				<a {href}>
					<Icon {name} {href}/>
				</a>
				</Tooltip>
			</li>
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
	li:not(.logo) {
		margin: 1em 2em;
		width: 1.5em;
		list-style-type: none;
		padding: 0.5em;
		border: 
			hsl(100, 50%, 50%)
			outset;
		border-radius: 40% 40% 0 0;
		place-content: center;
		display: grid;
	}
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