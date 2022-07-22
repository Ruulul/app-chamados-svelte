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
	let filial_id = $filiais_validas_por_id[$filial]
	$: console.log(filial_id)
	async function onSubmit() {
	}
	</script>
<form class='div filled container' on:submit|preventDefault={onSubmit}>
	<div>
		<h1>Novo usuário</h1>
		<Filtro 
			required
			multiple
			label='Selecione as filiais de acesso'
			options={
				Object.entries($filiais_validas_por_id).map(([value, label])=>({value, label}))
			}
			bind:value={filial_id}
		/>
		<span>Departamento: </span>
	</div>
	<div>
		<label for='mensagem'>Mensagem</label>
		<input type="submit" value="Enviar" class='action button'/>
	</div>
</form>