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
	import { user } from '$lib/stores/user';
	import { abrir_os } from '$lib/utils/servicos.js';
	let assunto = '', mensagem = '', files = [];

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
<form class='div filled container' on:submit|preventDefault={onSubmit}>
	<div>
		<h1>Abrir chamado</h1>
		<span>Departamento: {$user.dept}</span>
		<label for="arquivos">Arquivos</label>
		<input id="arquivos" on:input={({target:{files}})=>addFiles(files)} type='file' multiple/>
		{#each Array.from(files) as file (file.digest)}
			<div class="file-wrapper">
				<span>{file.name} (Approx. {Math.floor(file.data.split(';base64,')[1].length/4 * 3 / 1024)} kB)
					<br/>
					{#if file.data.slice(0, 20).includes('image')}
					<img alt='' src={file.data}/>
					{:else}
					<object alt='' title='anexo' data={file.data}>
						Não pudemos exibir
					</object>
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
		<textarea class='outlined container' id='mensagem' bind:value={mensagem} required />
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