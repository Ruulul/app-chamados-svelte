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
	import CardProcesso from './_CardProcesso.svelte';
	import MuralAvisos from './_MuralAvisos.svelte';
</script>
<div class=main>
	<CardProcesso Tag='abrir_os' titulo='Suporte Técnico'/>
	<CardProcesso campos_dict={{status: ['pendente', 'em atendimento',]}} Tag='cadastro_produto' titulo='Cadastro de Produto'/>
	<MuralAvisos/>
</div>
<style>
	div {
		flex-flow: row;
	}
	.main {
		margin: 0;
		width: 100%;
		align-items: flex-start;
	}
</style>