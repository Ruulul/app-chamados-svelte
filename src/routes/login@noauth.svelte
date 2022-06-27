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
<h1>
Gold Seed
</h1>
<main>
<h2>
Login
</h2>
<form on:submit|preventDefault="{handleLogin}">
	<div>
		<label for='email'>
		Email
		</label>
		<input id='email' required bind:value={email} type="email"/>
	</div>
	<div>
		<label for='senha'>
		Senha
		</label>
		<input id='senha' required bind:value={senha} type='password'/>
	</div>
	<span>{error || ''}</span>
	<button type='submit'>Login</button>
</form>
</main>
<style>
	h1 {
		text-align: center;
	}
	main {
		text-align: center;
		display: grid;
		margin: auto;
		border: green solid;
		border-radius: 1em;
		width: fit-content;
		padding: 0.5em 1em;
	}
	form {
		display: grid;
		width: 20em;
	}
	div {
		display: flex;
		justify-content: flex-end;
	}
	div * {
		margin: 0.3em 3em 0.3em 0;
	}
	button {
		margin: auto;
		padding: 0.3em 2em;
	}
</style>