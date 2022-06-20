<svelte:head>
	<title>
		Página Inicial
	</title>
</svelte:head>

<script>
	import { user } from '$lib/stores/user.js'
	import { get_monitoring, get_servicos } from '$lib/utils/db.js'
	import { converteDateToOSI } from '$lib/utils/utils.js'
	import Suporte from '$lib/components/ExibeSuporte.svelte'
	import CardChamadosPendentes from '$lib/components/CardChamadosPendentes.svelte'

	let monitoring = []
	let servicos = []
	get_monitoring().then(setMonitoring)
	get_servicos('pendente').then(setServicos)


	$: pendentes = servicos.length
	$: novos = servicos.filter(({createdAt})=>createdAt.split('T')===converteDateToOSI(Date())).length
	$: atendimento = servicos.filter(({atendimento})=>atendimento==='true').length
	$: parados = pendentes - atendimento


	function setMonitoring (data) {
		monitoring = data
	}
	function setServicos (data) {
		servicos = data
	}
</script>

<h1>Olá, {$user.nome}</h1>
<div class='wrapper'>
		<CardChamadosPendentes {...{pendentes, novos, atendimento, parados}} />
	<div>
		<h2>Equipe de suporte</h2>
		{#each monitoring as atendente}
			<Suporte {...atendente}/>
		{/each}
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