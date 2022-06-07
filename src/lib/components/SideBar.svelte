<script>
	import Button from '$lib/components/Buttons/XBarButton.svelte'
	let items =
		[
			['Home', '/', 'sideBar'],
			['Serviços', '/servicos', 'sideBar'],
			['Configurações', '/config', 'sideBar']
		]
</script>
<ul>
	{#each items as [name, href, option]}
	<li>
	<span>{name}</span>
	<Button {...{name, href, option}} />
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
		width: 15vw;
		justify-content: end;
	}
	span {
		place-self: center;
	}
</style>