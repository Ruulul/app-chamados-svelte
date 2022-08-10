<script>
	import Icon from '$lib/components/MenuIcon.svelte'
	import Logo from '$lib/assets/MainLogo.svelte';
	import { auth } from '$lib/utils/db.js'
	import { goto } from '$app/navigation';

	let itemsE =
		[
		]
	let itemsD = 
		[
			['Perfil', '/perfil'],
			['Logout', '/logout', ()=>auth.logout().then(()=>goto('/login'))]
		]
	let itemsAll = [itemsE, itemsD]
</script>
	<nav>
	{#each itemsAll as items}
		{#each items as [name, href, action]}
		<a href={action?'#':href}>
			<li title={name} on:click={action}>
				<Icon {href}/>
			</li>
		</a>
		{/each}
		{#if itemsAll.indexOf(items)===0}
		<li class="logo">
			<Logo/>
		</li>
		{/if}
	{/each}
	</nav>
<style>
	li:not(.logo) {
		margin: 1em 2em;
		width: 4em;
		height: 4em;
		list-style-type: none;
		padding: 0.5em;
		border: var(--dark) solid;
		border-radius: 50%;
		place-content: center;
		display: grid;
	}
	nav {
		padding: 0;
		display: flex;
		position: relative;
		justify-content: flex-end;
		width: 97.5vw;
	}
	.logo {
		place-content: left;
		display: grid;
		position: absolute;
		left: 1em;
		top: 1em;
	}
</style>