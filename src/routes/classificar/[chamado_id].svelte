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
	const nova_categoria = 'AC - INTERNAL GOLD SEED';
	import Filtro from '$lib/components/Filtro.svelte';
	import { cadastros } from '$lib/stores/cadastros';
	import { filial, filiais_validas_por_id } from '$lib/utils/filial';
	import { getCampo, getOpcoes, getUnique, updateProcesso } from '$lib/utils/cadastros.js';
	import { tipos_os, categorias_os } from '$lib/stores/local_db.js';
	import { page } from '$app/stores';
import { config } from '$lib/utils/db';
	let tipo = '', categoria = '', prioridade = 0, nova_categoria_dialog
	let servico = $cadastros.find(servico=>servico.id==$page.params.chamado_id);
	$: new_servico = $cadastros.find(servico=>servico.id==$page.params.chamado_id);
	$: if (servico?.updatedAt != new_servico?.updatedAt) servico = new_servico

	$: $filial = $filiais_validas_por_id[servico?.filialId];

	$: if (categoria == nova_categoria) {
		nova_categoria_dialog?.showModal()
		categoria = '';
	}
	async function onSubmit() {
		let prazo = await getPrazo(prioridade || servico.prioridade, servico.createdAt)
		let update = {
			categoria: tipo + '-' + categoria,
			prioridade,
			prazo
		}
		await updateProcesso(servico, update).then(()=>history.back());
	}

	
	</script>
<form class='div filled container' on:submit|preventDefault={onSubmit}>
	<div>
		<h1>Classificar chamado</h1>
		<table>
			<tr>
				<th>
					Assunto:
				</th>
				<td>
					{servico?.assunto}
				</td>
			</tr>
			<tr>
				<th>
					Departamento:
				</th>
				<td>
					{servico?.departamento}
				</td>
			</tr>
			<tr>
				<th>
					Mensagem de abertura:
				</th>
				<td>
					{servico?.chat[0]?.mensagem}
				</td>
			</tr>
		</table>
	</div>
	<div>
		<Filtro
			label='Tipo'
			required
			options={$tipos_os.map(({tipo})=>tipo)}
			bind:value={tipo}/>
		<dialog class='filled container' bind:this={nova_categoria_dialog}>
			<button class='close button' on:click={()=>nova_categoria_dialog.close()}>X</button>
			<h2>Escreva a nova categoria e envie</h2>
			<form on:submit|preventDefault={async ()=>{
				if (tipo && categoria)
				await config.addCategoria({
					tipo,
					newCategoria: categoria
				})
				nova_categoria_dialog.close()
				}
			}>
			<div>
				<Filtro
				label='Tipo'
				options={$tipos_os.map(({tipo})=>tipo)}
				bind:value={tipo}/>
				<input bind:value={categoria}>
				<input type='submit' value='Enviar' class='action button'>
			</div>
			</form>
		</dialog>
		<Filtro
			label='Categoria'
			required
			options={[ {value: nova_categoria, label: 'Novo...'}, ...$categorias_os.filter(categoria=>categoria.tipo==tipo).map(({categoria})=>categoria)]}
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
	table {
		display: flex;
		flex-flow: column;
		gap: 1em;
	}
	tr {
		display: flex;
		flex-flow: column;
		text-align: center;
	}
	form {
		justify-content: space-between;
		flex-flow: row;
		width: 80%;
		padding: 3em;
	}
	dialog {
		padding: 2em;
		justify-content: center;
		align-items: center;
		text-align: center;
		flex-flow: column;
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