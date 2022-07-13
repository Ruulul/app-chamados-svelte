<script context='module'>
	export async function load ({params}) {
		return {
			stuff: {
				title: 'Chamado ' + params.chamado_id + ' - Classificação'
			},
			props: {
				servico
			}
		}
	}
</script>
<script>
	import { servicos } from '$lib/stores/servicos';
	import { update_servico } from '$lib/utils/servicos.js';
	import { tipos_os, categorias_os } from '$lib/stores/local_db.js';
	let tipo = '', categoria = ''
	let servico = $servicos.find(servico=>servico.id==params.chamado_id);
	$: console.log(tipo, categoria)

	async function onSubmit() {
		let update = {
			tipo,
			categoria
		}
		await update_servico(update)
	}
	</script>
<form class='div filled container' on:submit|preventDefault={onSubmit}>
	<div>
		<h1>Classificar chamado</h1>
		<span>Departamento: {servico.dept}</span>
	</div>
	<div>
		<label for='tipo'>Tipo</label>
		<select id='tipo' required bind:value={tipo}>
			{#each $tipos_os as {tipo}}
			<option>{tipo}</option>
			{/each}
		</select>
		<label for='categoria'>Categoria</label>
		<select id='categoria' bind:value={categoria}>
			{#each $categorias_os.filter(categoria=>categoria.tipo==tipo) as {categoria}}
			<option>{categoria}</option>
			{/each}
		</select>
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