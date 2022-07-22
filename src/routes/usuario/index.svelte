<script context='module'>
	export async function load () {
		return {
			stuff: {
				title: 'Criar usuário'
			},
		}
	}
</script>
<script>
	import Filtro from '$lib/components/Filtro.svelte';
    import { filial, filiais_validas, filiais_validas_por_id } from '$lib/utils/filial';
	async function onSubmit() {
	}
	</script>
<form class='div filled container' on:submit|preventDefault={onSubmit}>
	<div>
		<h1>Novo usuário</h1>
		<Filtro required
			label='Selecione a filial'
			options={
				$filiais_validas
			}
			bind:value={$filial}
		/>
		<span>Departamento: </span>
	</div>
	<div>
		<label for='mensagem'>Mensagem</label>
		<input type="submit" value="Enviar" class='action button'/>
	</div>
</form>