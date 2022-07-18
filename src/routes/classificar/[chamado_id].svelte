<script context='module'>
	export async function load ({params}) {
		return {
			stuff: {
				title: 'Chamado ' + params.chamado_id + ' - Classificação'
			},
		}
	}
</script>
<script>
	import Filtro from '$lib/components/Filtro.svelte';
	import { servicos } from '$lib/stores/servicos';
	import { filial, filiais_validas_por_id } from '$lib/utils/filial';
	import { getPrazo, updateServico } from '$lib/utils/servicos.js';
	import { tipos_os, categorias_os } from '$lib/stores/local_db.js';
	import { page } from '$app/stores';
	import {goto } from '$app/navigation';
	let tipo = '', categoria = '', prioridade = 0
	let servico = $servicos.find(servico=>servico.id==$page.params.chamado_id);
	$: new_servico = $servicos.find(servico=>servico.id==$page.params.chamado_id);
	$: if (servico?.updatedAt != new_servico?.updatedAt) servico = new_servico
	//$: tipo = servico?.tipo || tipo, categoria = servico?.subCategoria || categoria, prioridade = parseInt(servico?.prioridade) || prioridade
	$: $filial = $filiais_validas_por_id[servico?.filialId];
	//$: console.log(tipo, categoria, $page.params.chamado_id);

	async function onSubmit() {
		let prazo = undefined;
		if (prioridade != servico.prioridade) prazo = await getPrazo(prioridade, servico.createdAt)
		let update = {
			tipo,
			categoria,
			prioridade,
			prazo
		}
		await updateServico($page.params.chamado_id, update).then(()=>history.back());
	}

	
	</script>
<form class='div filled container' on:submit|preventDefault={onSubmit}>
	<div>
		<h1>Classificar chamado</h1>
		<span>Assunto: <br>{servico?.assunto}</span>
		<span>Departamento: {servico?.departamento}</span>
	</div>
	<div>
		<Filtro
			label='Tipo'
			required
			options={$tipos_os.map(({tipo})=>tipo)}
			bind:value={tipo}/>
		<Filtro
			label='Categoria'
			required
			options={$categorias_os.filter(categoria=>categoria.tipo==tipo).map(({categoria})=>categoria)}
			bind:value={categoria}/>
		<Filtro
			label='Urgencia'
			required
			options={
				[
					{value: 1, label:'Baixa'},
					{value: 2, label:'Média'},
					{value: 3, label:'Alta'},
					{value: 4, label:'Urgente'},
				]
			}
			bind:value={prioridade}
			/>
		<input type="submit" value="Enviar"/>
	</div>
</form>

<style>
	form {
		justify-content: space-between;
		flex-flow: row;
		width: 80%;
		padding: 3em;
	}
	form > div {
		margin: 1em;
	}
	form > :first-child {
		width: 25%;
	}
	form > :last-child {
		width: 60%;
	}
	input {
		margin: 0 0 1em 0
	}
	input[type=submit] {
		width: 10em;
		margin: 1em auto
	}
	
</style>