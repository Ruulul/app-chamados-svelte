<script context='module'>
	export function load () {
		return {
			stuff: {
				title: 'Abrir chamado'
			}
		}
	}
</script>
<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user.js'
	import { categorias_os } from '$lib/stores/local_db.js'
	import { abrir_os, get_id_nova_os } from '$lib/utils/servicos.js';
	let assunto = '', mensagem = '', categoria = '', urgencia = 1, files = [];
	let file_input;
	$: $categorias_os, setCategoria()
	$: tipo = categoria?.tipo
	function setCategoria () {
		categoria = $categorias_os ? $categorias_os[0] : 'Carregando...'
	}

	async function onSubmit() {
		let os = {
			assunto,
			chat: [
				{
					autorId: $user.id,
					mensagem
				}
			],
			tipo,
			anexos: files,
			subCategoria: categoria,
			prioridade: urgencia,
			autorId: $user.id,
			usuarioId: $user.id,				//Alterar depois para suportes
			departamento: $user.departamento	//	''		''		''		''
		}

		await abrir_os(os)
	}
	
	async function addFiles(fileArray) {
		for (let file of Array.from(fileArray)){
			let base64File = await readFileAsBase64(file)
			let { buffer } = new Uint8Array(base64File.split('').map(c=>c.charCodeAt(0)))
			let digest = await crypto.subtle.digest('SHA-256', buffer)			//Here we receive an ArrayBuffer
			digest = String.fromCharCode.apply(null, new Uint8Array(digest))	//Then we convert it to a binary string... with the help of the Uint8Array class
			digest = btoa(digest)			
			files = [...files, {data: base64File, digest, name: file.name}]
		}
		function readFileAsBase64(file) {
			return new Promise(
				function PromiseReadFileAsBase64(resolve, reject) {
					let reader = new FileReader()
					reader.onload = ()=>resolve(reader.result)
					reader.onerror = reject

					reader.readAsDataURL(file)
				}
			)
		}
	}

	function removeFile(digest) {
		files = files.filter(file=>file.digest!==digest)
	}
	</script>
<h1>
	{#await get_id_nova_os()}
	Carregando...
	{:then id}
		{#if id==='Não autorizado'}
			{#await goto('/login')}
				Redirecionando...
			{/await}
		{:else}
			Chamado nº {id || 0}
		{/if}
	{:catch error}
	<p style:color="red">{error}</p>
	{/await}
</h1>
<h2>
	{#await $user then {nome}}
	Olá, {nome}
	{/await}
</h2>
<form on:submit|preventDefault={onSubmit}>
	<div>
		<span>Tipo: {tipo}</span>
		<span>Departamento: {$user.dept}</span>
		<label for="categoria">Categoria</label>
		<select id="categoria" name="categoria" bind:value="{categoria}">
			{#if $categorias_os}
			{#each $categorias_os as categoria(categoria.id)}
				<option value={categoria}>{categoria.categoria}</option>
			{/each}
			{:else}
				<option>Carregando...</option>
			{/if}
		</select>
		<label for="urgência">Urgência</label>
		<select id="urgência" name="urgência" bind:value="{urgencia}">
			{#each 
				[
				{urgencia: 1, descr: '🟩 Baixa'},
				{urgencia: 2, descr: '🟨 Média'},
				{urgencia: 3, descr: '🟥 Alta'},
				{urgencia: 4, descr: '⬛ Urgente'},
				] as {descr, urgencia}(urgencia)}
			<option value={urgencia}>{descr}</option>
			{/each}
		</select>
		<label for="arquivos">Arquivos</label>
		<input bind:this={file_input} id="arquivos" on:input={({target:{files}})=>addFiles(files)} type='file' multiple/>
		{#each Array.from(files) as file (file.digest)}
			<div class="file-wrapper">
				<span>{file.name} (Approx. {Math.floor(file.data.split(';base64,')[1].length/4 * 3 / 1024)} kB)
					<br/>
					{#if file.data.slice(0, 20).includes('image')}
					<img alt='' src={file.data}/>
					{/if}
				</span>
				<button class="remove-file" on:click={()=>removeFile(file.digest)}>X</button>
			</div>
		{/each}
	</div>
	<div>
		<label for='assunto'>Assunto</label>
		<input id='assunto' bind:value={assunto} required/>
		<label for='mensagem'>Mensagem</label>
		<textarea id='mensagem' bind:value={mensagem} required />
		<input type="submit" value="Enviar"/>
	</div>
</form>

<style>
	div {
		width: 35%;
		padding: 1em 2em;
		border: red solid;
		display: flex;
		flex-flow: column;
		float: left;
	}
	input {
	margin: 0 0 1em 0
	}
	input[type=submit] {
		width: 10em;
		margin: 1em auto
	}
	select {
	margin: 0 0 1em 0
	}

	img {
		width: 0;
		transition: width 0.2s;
		align-self: center;
	}
	.file-wrapper :hover img {
		width: 100%;
	}

	.file-wrapper {
		display: flex;
		flex-flow: row;
		border: none;
		width: 100%;
		justify-content: space-between;
		margin: 0 -2em 0 -2em;
	}

	.remove-file {
		font-family: monospace;
		font-size: 1.5em;
		width: 2em;
		height: 2.3em;
		padding: 0.5em;
		text-align: center;
	}
	
</style>