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
	import { user } from '$lib/stores/user.js'
	import { get_monitoring } from '$lib/utils/db.js'
	import { servicos as servicos_store } from '$lib/stores/servicos';
	import { converteDateToISO } from '$lib/utils/utils.js'
	import Suporte from '$lib/components/ExibeSuporte.svelte'
	import CardChamadosPendentes from '$lib/components/CardChamadosPendentes.svelte'

	$: servicos = $servicos_store.filter(({status})=>status==='pendente')
</script>
<h1>Olá, {$user.nome}</h1>
<div class='wrapper'>
	{#if servicos}
	{@const pendentes = servicos.length}
	{@const novos = servicos.filter(({createdAt})=>createdAt.split('T')[0]===converteDateToISO(Date())).length}
	{@const atendimento = servicos.filter(({atendimento})=>atendimento==='true').length}
	{@const parados = pendentes - atendimento}
	<CardChamadosPendentes {...{pendentes, novos, atendimento, parados}} />
	{/if}
	<div>
		<h2>Equipe de suporte</h2>
		{#await get_monitoring()}
			{#each [0, 0, 0] as id}
				<Suporte {id}/>
			{/each}
		{:then monitoring}
			{#each monitoring as atendente}
				<Suporte {...atendente}/>
			{/each}
		{/await}
	</div>
</div>
<style>
	.wrapper {
		display: flex;
		justify-content: space-between;
	}
	.wrapper div {
		border: thin red solid;
		float: left;
        padding: 2em;
		padding-top: 0;
	}
</style>