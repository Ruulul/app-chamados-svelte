<svelte:head>
	<title>
		Página Inicial
	</title>
</svelte:head>

<script>
	import { user } from '$lib/stores/user.js'
	import { filial, get_monitoring, get_servicos } from '$lib/utils/db.js'
	import { converteDateToOSI } from '$lib/utils/utils.js'
	import Suporte from '$lib/components/ExibeSuporte.svelte'
	import CardChamadosPendentes from '$lib/components/CardChamadosPendentes.svelte'
</script>

<h1>Olá, {$user.nome}</h1>
<div class='wrapper'>
	{#key $filial}
		{#await get_servicos('pendente')} 
		<div class='placeholderCard'>
			Carregando...
		</div>
		{:then servicos}
			{@const pendentes = servicos.length}
			{@const novos = servicos.filter(({createdAt})=>createdAt.split('T')===converteDateToOSI(Date())).length}
			{@const atendimento = servicos.filter(({atendimento})=>atendimento==='true').length}
			{@const parados = pendentes - atendimento}
			<CardChamadosPendentes {...{pendentes, novos, atendimento, parados}} />
		{/await}
	{/key}
	<div>
		<!--div class='hook'>
			<img alt='' src='https://10.0.0.5:5000/images/call-center-assistant-pngrepo-com.png'>
		</div-->
		<h2>Equipe de suporte</h2>
		{#await get_monitoring()}
			{#each [1, 2, 3] as _}
				<Suporte/>
			{/each}
		{:then monitoring}
			{#each monitoring as atendente}
				<Suporte {...atendente}/>
			{/each}
		{/await}
	</div>
</div>

<style>
    div.placeholderCard {
        width: 20%;
        height: 40%;
        padding: 2em;
		padding-top: 0;
        border: thin blue solid;
    }
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
	/*
	.wrapper div .hook {
		position: relative;
		width: 0;
		height: 0;
		padding: 0;
		margin: 0;
		border: none;
	}
	img {
		width: 10em;
		height: 10em;
		position: absolute;
		left: 2em;
	}
		*/
</style>