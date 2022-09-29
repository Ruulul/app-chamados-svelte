<script>
    import { auth } from '$lib/utils/db';
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte';

	let email;
	let senha;

	let loading = false;
	let error;
	let info;
	
	let token;

	function alteraSenha () {
        let args = {email, senha, token}
        auth.alteraSenha(args)
        .then(()=>auth.login(args))
        .then(()=>goto('/'))
	}
	async function resetaSenha () {
		loading = true;
		info = ''
		error = ''
		await auth.resetaSenha(email)
			.then(()=>info="Um email com o link de recuperação foi mandado ao seu email.")
			.catch(()=>error="Algum erro ocorreu");
		loading = false;
	}

	$: has_token = !!token;
	onMount(getToken);

	function getToken () {
		let query_params = new URLSearchParams(location.search);
		token = query_params.get('token');
		return token;
	}
</script>
<svelte:head>
	<title>
		Recuperação de Senha
	</title>
</svelte:head>
<main class:hidden={has_token} class='filled container'>
	<img alt=''>
	<span>Recuperação de senha</span>
	<form on:submit|preventDefault={resetaSenha}>
		<label for='email1'>
			Email
		</label>
		<input id=email1 placeholder="Email" required bind:value={email} type="email"/>
		<span class=error>{error || ''}</span>
		<div>
			<button class:disabled={loading} class='action button' type=submit>Resetar senha</button>
			<i class:hidden={!loading} class="fas fa-2x fa-spinner fa-spin"/>
		</div>
		<div>
			<span class=info>{info || ''}</span>
		</div>
	</form>
</main>
<main class:hidden={!has_token} class='filled container'>
	<img alt=''>
	<span>
		Recuperação de Senha
	</span>
	<form on:submit|preventDefault="{alteraSenha}">
		<label for='email'>
		Email
		</label>
		<input placeholder='Email' id='email' required bind:value={email} type="email"/>

		<label for='senha'>
		Nova Senha
		</label>
		<input placeholder='Nova Senha' id='senha' required bind:value={senha} type='password'/>
		<span class=error>{error || ''}</span>
		<div>
			<button class='action button' type='submit'>Alterar minha senha</button>
		</div>
	</form>
	<div class="voltar"><a href='/login'>Eu tenho acesso</a></div>
</main>
<style>
	span {
		text-align: left;
	}
	img {
		content: var(--logo);
		width: 10em;
		margin: auto;
		display: block;
	}
	main {
		position: block;
		width: 20%;
		height: fit-content;
		margin: auto;
		margin-top: 5%;
	}
	main * {
		margin: 0.5em 0;
	}
	div {
		position: relative;
		top: unset;
		left: unset;
		width: 100%;
		height: 2em;
	}
	label {
		width: 0;
		height: 0;
		overflow: hidden;
	}
	input {
		font-size: medium;
		margin: 0.5em 0;
		padding: 0.5em;
		border-radius: 1em;
		border: thin var(--secondary-color) solid;
	}
	button {
		font-size: medium;
		text-transform: uppercase;
	}
	form {
		display: grid;
		margin: auto;
	}
	.voltar {
        width: auto;
        margin: auto;
        text-align: center;
	}
	i {
		width: fit-content;
		margin: auto;
	}
</style>