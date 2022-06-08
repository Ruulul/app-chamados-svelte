<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user.js'
	import { abrir_os, get_id_nova_os } from '$lib/utils/db.js';
</script>
<h1>
	{#await get_id_nova_os()}
	Carregando...
	{:then id}
		{#if id==='Não autorizado'}
			{#await goto('/login')}
			{/await}
		{:else}
			Chamado n. {id || 0}
		{/if}
	{:catch error}
	<p style:color="red">{error}</p>
	{/await}
</h1>
<h2>
	Olá, {$user.nome}
</h2>