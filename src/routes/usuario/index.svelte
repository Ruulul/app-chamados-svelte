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
	import Dialog from '$lib/components/Dialog.svelte';
	import Filtro from '$lib/components/Filtro.svelte';
	import { departamentos } from '$lib/stores/local_db';
	import { auth, config } from '$lib/utils/db';
    import { filial, filiais_validas_por_id } from '$lib/utils/filial';
	let filial_selecionada = Object.entries($filiais_validas_por_id).find((entry)=>entry[1]==$filial)[0]
	let filiais_de_acesso = []
	let filial_id = filial_selecionada
	$: $filial = $filiais_validas_por_id[filial_id]
	$: filiais_de_acesso = [filial_id]
	$: filiais_de_acesso = [...((new Set(filiais_de_acesso)).add(filial_id))]

	let nome, sobrenome, email, senha
	let dept = ''
	let novo_departamento_dialog
	$: if (dept == 'Novo...') {
		novo_departamento_dialog?.showModal()
		dept = ''
	}
	async function onSubmit() {
		auth.newUser({
			nome,
			sobrenome,
			email,
			senha,
			acessa_filial: filiais_de_acesso,
			dept,
			permissoes: [],
		})
	}
	</script>
<h1>Novo usuário</h1>
<form class='div filled container' on:submit|preventDefault={onSubmit}>
	<div>
		<label for=nome>Nome:</label>
		<input bind:value={nome} id=nome placeholder="Nome">
		<label for=sobrenome>Sobrenome:</label>
		<input bind:value={sobrenome} id=sobrenome placeholder="Sobrenome">
		<label for=email>Email:</label>
		<input bind:value={email} id=email type='email' placeholder="Email">
		<label for=senha>Senha:</label>
		<input bind:value={senha} id=senha type='password' placeholder='Senha'>
	</div>
	<div>
		<Filtro 
			required
			label='Selecione a filial de cadastro'
			options={
				Object.entries($filiais_validas_por_id).map(([value, label])=>({label, value}))
			}
			bind:value={filial_id}
		/>
		<Filtro 
			required
			multiple
			label='Selecione outras filiais para acesso'
			options={
				Object.entries($filiais_validas_por_id).map(([value, label])=>({label, value}))
			}
			bind:value={filiais_de_acesso}
		/>
		<Filtro 
			required
			label='Selecione o departamento'
			options={
				['Novo...', ...$departamentos?.map(({departamento})=>departamento)]
			}
			on:exclude={(node)=>{
				console.log(node)
			}}
			bind:value={dept}
		/>
		<Dialog title='' bind:this={novo_departamento_dialog}>
			<button class='close button' on:click={()=>novo_departamento_dialog.close()}>X</button>
			<h2>Escreva a nova categoria e envie</h2>
			<form on:submit|preventDefault={async ()=>{
				if (dept)
				await config.addDepartamento({
					newDepartamento: dept
				})
				novo_departamento_dialog.close()
				}
			}>
			<div>
				<input bind:value={dept}>
				<input type='submit' value='Enviar' class='action button'>
			</div>
			</form>
		</Dialog>
		<input type="submit" value="Enviar" class='action button'/>
	</div>
</form>

<style>
	h1 {
		text-align: center;
		font-size: large;
	}
	form {
		display: flex;
		flex-flow: row;
		gap: 5em;
		margin: auto;
	}
	label {
		width: 0;
		height: 0;
		overflow: hidden;
	}
	input:not([type=submit]) {
		margin: 0.5em 0;
		padding: 0.5em;
		border-radius: 1em;
		border: thin var(--secondary-color) solid;
	}
	form {
		justify-content: center;
	}
	.close.button {
		position: absolute;
		top: -0.5em;
		right: 0;
		padding: 1em;
		margin: 1em;
		background-color: transparent;
	}
</style>