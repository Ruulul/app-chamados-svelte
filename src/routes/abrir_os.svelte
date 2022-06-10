<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user.js'
	import { tipos_os, categorias_por_tipo_os } from '$lib/stores/local_db.js'
	import { abrir_os, get_id_nova_os } from '$lib/utils/db.js';
	let { tipo } = $tipos_os[0]
	let assunto, mensagem, categoria, urgencia;
	$: categorias = $categorias_por_tipo_os[tipo]
	$: tipo, setCategoria()
	$: console.log(JSON.stringify({assunto, mensagem, tipo, categorias, categoria, urgencia}))
	
	function setCategoria() {
		categoria = categorias[0]
	}
</script>
<h1>
	{#await get_id_nova_os()}
	Carregando...
	{:then id}
		{#if id==='Não autorizado'}
			{#await goto('/login')}
			{/await}
		{:else}
			Chamado nº {id || 0}
		{/if}
	{:catch error}
	<p style:color="red">{error}</p>
	{/await}
</h1>
<h2>
	Olá, {$user.nome}
</h2>
<form>
	<div>
		<label>Tipo</label>
		<select bind:value="{tipo}">
			{#each $tipos_os as {tipo}}
				<option>{tipo}</option>
			{/each}
		</select>
		<label>Categoria</label>
		<select bind:value="{categoria}">
			{#each categorias as categoria}
				<option>{categoria}</option>
			{/each}
		</select>
		<label>Urgência</label>
		<select bind:value="{urgencia}">
			{#each 
				[
				{urgencia: 1, descr: '🟩 Baixa'},
				{urgencia: 2, descr: '🟨 Média'},
				{urgencia: 3, descr: '🟥 Alta'},
				{urgencia: 4, descr: '⬛ Urgente'},
				] as {descr, urgencia}}
			<option value={urgencia}>{descr}</option>
			{/each}
		</select>
	</div>
	<div>
		<label>Assunto</label>
		<input bind:value={assunto} required/>
		<label>Mensagem</label>
		<textarea bind:value={mensagem} required />
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
	
</style>