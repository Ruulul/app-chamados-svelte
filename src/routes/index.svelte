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

	import CardProcesso from './_CardProcesso.svelte';
	import MuralAvisos from './_MuralAvisos.svelte';
</script>
<div class=main>
		<CardChamadosPendentes/>
		<CardProcesso Tag='suporte_tecnico' titulo='Suporte Técnico'/>
		<CardProcesso Tag='cadastro_produto' titulo='Cadastro de Produto'/>
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