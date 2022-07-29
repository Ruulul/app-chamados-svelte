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
<main class='filled container'>
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
		<button class='action button' type='submit'>Conectar</button>
	</form>
	<span class='recupera-senha'>Esqueceu sua senha? <br><a href='/alterasenha'>Clique aqui para recuperar sua senha</a></span>
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
		width: 100%;
		height: 2em;
	}
	form {
		display: grid;
		margin: auto;
	}
	.recupera-senha {
		font-size: small;
		margin-top: 0.5em;
	}
</style>