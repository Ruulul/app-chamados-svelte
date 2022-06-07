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
	<Button {...{name, href, option}} />
	{/each}
</ul>

<style>
	ul {
		float: left;
		padding: 0
	}
</style>