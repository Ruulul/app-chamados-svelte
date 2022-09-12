<script>
	import { user } from '$lib/stores/user';
	import Icon from '$lib/components/MenuIcon.svelte'
	let items =
		[
			['Home', '/'],
			['Chamados', '/processos'],
			['Notificações', '/notificacoes'],
			['Avisos', '/avisos'],
			['Configurações', '/config'],
		]
	//if ($user.cargo == "admin") items.push(['Usuários', '/usuarios']);
</script>
<nav title='Barra lateral'>
	{#each items as [title, href]}
	<li>
		<a {title} {href} alt="Página {title}">
			<Icon {href} />
		</a>
	</li>
	{/each}
</nav>

<style>
	nav {
		float: left;
		padding: 2em;
		background: var(--grey);
		height: 100vh;
		width: 4.5em;
		margin-right: 1em;
		margin-left: -0.5em;
		margin-top: -0.5em;
		border-radius: 0 1em 1em 0;
		display: flex;
		flex-flow: column;
		gap: 4.5em;
	}
	nav::after {
		content: var(--small-logo);
		justify-self: center;
		position: absolute;
		bottom: 2em;
	}
	li {
		display: flex;
		margin: 1em;
		padding: 0.5em;
		width: fit-content;
		height: fit-content;
		justify-content: end;
		justify-self: center;
	}
</style>