<script>
    import { auth } from '$lib/utils/db';
	import { goto } from '$app/navigation'
    import { page } from '$app/stores'
	let email;
	let senha;
	let error;
	function handleSubmit() {
        let args = {email, senha}
        auth.alteraSenha(args)
        .then(()=>auth.login(args))
        .then(()=>goto('/'))
	}
</script>
<svelte:head>
	<title>
		Recuperação de Senha
	</title>
</svelte:head>
<main class='filled container'>
	<img alt=''>
	<span>
		Recuperação de Senha
	</span>
	<form on:submit|preventDefault="{handleSubmit}">
		<label for='email'>
		Email
		</label>
		<input placeholder='Email' id='email' required bind:value={email} type="email"/>

		<label for='senha'>
		Nova Senha
		</label>
		<input placeholder='Nova Senha' id='senha' required bind:value={senha} type='password'/>
		<span>{error || ''}</span>
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
</style>