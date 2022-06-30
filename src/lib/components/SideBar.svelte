<script>
	import { servicos } from '$lib/stores/servicos';
	import Icon from '$lib/components/MenuIcon.svelte'
	let items =
		[
			['Home', '/'],
			['Serviços', '/servicos'],
			['Configurações', '/config']
		]
	$: count = $servicos.filter(({status})=>status==='pendente').length
	$: hidden = !count
</script>
<nav title='Barra lateral'>
	{#each items as [name, href]}
	<li>
		<a {href} alt="Página {name}">
			<span>{name}</span>
			<Icon {href} />
		</a>
		{#if href==='/servicos'}
			<div class:hidden>
				<p>{count}</p>
			</div>
		{/if}
	</li>
	{/each}
</nav>

<style>
	nav {
		float: left;
		padding: 0;
		background: grey;
		height: 76.837398527vh;
		margin-right: 1em;
		margin-left: -1em;
		border-radius: 0% 10% 10% 0%
	}
	li {
		display: flex;
		margin: 1em;
		width: 15vw;
		justify-content: end;
	}
	span {
		place-self: center;
	}
	div {
		position: relative;
		width: 0;
		height: 0;
	}
	p {
		position: absolute;
		font-size: small;
		background-color: darkred;
		color: white;
		transition: width 0.2s, height 0.2s, font-size 0.2s;
		top: -1.5em;
		width: 1.5em;
		height: 1.5em;
		border-radius: 2em;
		display: grid;
		place-content: center;
	}
	.hidden p {
		width: 0;
		height: 0;
		font-size: 0;
	}
</style>