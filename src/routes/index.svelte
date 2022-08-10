<script context='module'>
	export function load () {
		return {
			stuff: {
				title: 'Página inicial'
			}
		}
	}
</script>
<script>
	import CardChamadosPendentes from './_CardChamadosPendentes.svelte';
	import CardPedidosCadastro from './_CardPedidosCadastro.svelte';
	import MuralAvisos from './_MuralAvisos.svelte';
</script>
<div class=main>
		<CardChamadosPendentes/>
		<CardPedidosCadastro/>
	<MuralAvisos/>
</div>
<style>
	div {
		flex-flow: row;
		margin: 0;
		width: 100%;
		gap: 5em;
	}
	.container {
		gap: 2em;
		padding: 0;
		padding-right: 2em;
	}
</style>