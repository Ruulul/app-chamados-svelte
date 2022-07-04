<script>
	import { user } from '$lib/stores/user.js'
	import { goto } from '$app/navigation'
	let email;
	let senha;
	let error;
	function handleLogin() {
		console.log('Iniciando login')
		user.login({email, senha})
			.then(async (response)=>{
				console.log('response: ', response)
				if(response.error) {
					return error = response.error
				}
				else await goto('/')
			})
			.then(()=>console.log('Fim do login'))
			.catch(console.error)
	}
</script>
<svelte:head>
	<title>
		Login
	</title>
</svelte:head>
<main>
	<img alt=''>
	<span>
		Seja bem vindo,
	</span>
	<form on:submit|preventDefault="{handleLogin}">
		<label for='email'>
		Email
		</label>
		<input placeholder='Email' id='email' required bind:value={email} type="email"/>
		<label for='senha'>
		Senha
		</label>
		<input placeholder='Senha' id='senha' required bind:value={senha} type='password'/>
		<span>{error || ''}</span>
		<div>
			<button type='submit'>Conectar</button>
		</div>
	</form>
	<span class='recupera-senha'>Esqueceu sua senha? <br><a href='#'>Clique aqui para recuperar sua senha</a></span>
</main>
<style>
	img {
		content: var(--logo);
		width: 15em;
		margin: auto;
		display: grid;
	}
	main {
		position: block;
		width: 20%;
		height: fit-content;
		padding: 3em;

		text-align: center;
		place-self: center;
		margin: auto;
		display: flex;
		flex-flow: column;
		background-color: var(--grey);
		border-radius: 1.5em;

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
		width: 10em;
		margin: 0.5em 0;
		padding: 0.5em;
		border-radius: 1em;
		border: thin var(--secondary-color) solid;
	}
	button {
		border-radius: 1em;
		border: none;
		background-color: var(--dark);
		color: white;
		text-transform: uppercase;
		left: 0;
		position: absolute;
		width: 100%;
		padding: 0.3em 2em;
	}
	form {
		display: grid;
		margin: auto;
	}
	.recupera-senha {
		font-size: small;
	}
	.recupera-senha a {
		font-size: x-small;
	}
</style>