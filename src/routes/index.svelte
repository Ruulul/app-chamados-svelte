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
	import CardChamadosPendentes from './_CardChamadosPendentes.svelte'
	import MuralAvisos from './_MuralAvisos.svelte';
</script>
<div>
	<CardChamadosPendentes/>
	<MuralAvisos/>
</div>
<style>
	div {
		flex-flow: row;
		padding: 5em;
		padding-top: 0;
		width: auto;
	}
</style>