<script context='module'>
	export async function load () {
		return {
			stuff: {
				title: 'Abrir chamado'
			},
		}
	}
</script>
<script>
	import Anexos, { addFiles } from '$lib/components/Anexos.svelte';
import Filtro from '$lib/components/Filtro.svelte';
	import { user } from '$lib/stores/user';
	import { filiais_validas, filial } from '$lib/utils/filial';
	import { abrirOs } from '$lib/utils/servicos.js';
	let assunto = '', mensagem = '';
	async function onSubmit() {
		let os = {
			assunto,
			chat: [
				{
					autorId: $user.id,
					mensagem
				}
			],
			anexos: files,
			autorId: $user.id,
			usuarioId: $user.id,				//Alterar depois para suportes
			departamento: $user.dept			//	''		''		''		''
		}

		await abrirOs(os)
	}
	</script>
<form class='div filled container' on:submit|preventDefault={onSubmit}>
	<div>
		<h1>Abrir chamado</h1>
		<Filtro required
			label='Selecione a filial'
			options={
				$filiais_validas
			}
			bind:value={$filial}
		/>
		<span>Departamento: {$user.dept}</span>
		<Anexos/>
	</div>
	<div>
		<label for='assunto'>Assunto</label>
		<input id='assunto' bind:value={assunto} required/>
		<label for='mensagem'>Mensagem</label>
		<textarea class='outlined container' rows=6 maxlength=1000 id='mensagem' bind:value={mensagem} required on:paste={({clipboardData:{files}})=>addFiles(files)} />
		<input type="submit" value="Enviar" class='action button'/>
	</div>
</form>

<style>
	textarea {
		padding: 1em;
	}
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
		margin: 0 0 1em 0;
		border-radius: 0.5em;
	}
	input[type=submit] {
		width: 10em;
		margin: 1em auto
	}
</style>