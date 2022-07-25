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
		margin: auto;
		gap: 5em;
	}
</style>