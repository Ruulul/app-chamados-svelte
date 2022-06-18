<script>
	import Icon from '$lib/components/MenuIcon.svelte'
	let items =
		[
			['Home', '/'],
			['Serviços', '/servicos'],
			['Configurações', '/config']
		]
</script>
<ul title='Barra lateral'>
	{#each items as [name, href]}
	<li>
		<a {href} alt="Página {name}">
			<span>{name}</span>
			<Icon {href} />
		</a>
	</li>
	{/each}
</ul>

<style>
	ul {
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
</style>