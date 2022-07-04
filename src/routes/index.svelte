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
	import { servicos as servicos_store } from '$lib/stores/servicos';
	import { converteDateToISO } from '$lib/utils/utils.js'
	import CardChamadosPendentes from '$lib/components/CardChamadosPendentes.svelte'

	$: servicos = $servicos_store.filter(({status})=>status==='pendente')
</script>
	{#if servicos}
	{@const pendentes = servicos.length}
	{@const novos = servicos.filter(({createdAt})=>createdAt.split('T')[0]===converteDateToISO(Date())).length}
	{@const atendimento = servicos.filter(({atendimento})=>atendimento==='true').length}
	{@const parados = pendentes - atendimento}
	<CardChamadosPendentes {...{novos, atendimento, parados}} />
	{/if}