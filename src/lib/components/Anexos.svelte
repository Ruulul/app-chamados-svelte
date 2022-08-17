<script>
import ExibeArquivo from "./ExibeArquivo.svelte";

    export let files = [];
	
	export async function addFiles(fileArray) {
		if (!fileArray) return;
		for (let file of Array.from(fileArray)){
			let base64File = await readFileAsBase64(file)
			if (!base64File) {
				return
			};
			let { buffer } = new Uint8Array(base64File.split('').map(c=>c.charCodeAt(0)))
			let digest;
            try {
                digest = await crypto.subtle.digest('SHA-256', buffer)			//Here we receive an ArrayBuffer
			    digest = String.fromCharCode.apply(null, new Uint8Array(digest))	//Then we convert it to a binary string... with the help of the Uint8Array class
			    digest = btoa(digest)
            } catch {
                digest = Math.floor(Math.random() * 2576); 
            }
			if(!files.find(file=>file.digest==digest)) files = [...files, {data: base64File, digest, title: file.name}]
		}
		function readFileAsBase64(file) {
			if (file.size > 12582912) {
				alert("Arquivo muito grande para o envio, favor comprimir ou buscar outros métodos (link externo, como por exemplo o Google Fotos ou Google Drive)");
				return;
			}
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
<label for="arquivos">Arquivos</label>
<input id="arquivos" on:input={({target:{files}})=>addFiles(files)} type='file' multiple/>
{#each Array.from(files) as file (file.digest)}
	<ExibeArquivo {...file}>
		<button class="remove-file action button" on:click={()=>removeFile(file.digest)}>X</button>
	</ExibeArquivo>
{/each}

<style>
	.remove-file {
		font-family: monospace;
		margin: auto;
	}
</style>