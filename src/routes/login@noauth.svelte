<script>
	import { user } from '$lib/stores/user.js'
	import { goto } from '$app/navigation'
	let email;
	let senha;
	let error;
	function handleLogin() {
		user.login({email, senha})
			.then(async (response)=>{
				if(response.error) {
					return error = response.error
				}
				else await goto('/')
			})
			.then(()=>console.log('Ok'))
			.catch(console.error)
	}
</script>
<h1>
Gold Seed
</h1>
<main>
<h2>
Login
</h2>
<form on:submit|preventDefault="{handleLogin}">
	<div>
		<label>
		Email
		</label>
		<input required bind:value={email} type="email"/>
	</div>
	<div>
		<label>
		Senha
		</label>
		<input required bind:value={senha} type='password'/>
	</div>
	<span>{error || ''}</span>
	<button type='submit'>Login</button>
</form>
</main>
<style>
	body {
		background-image: linear-gradient(270deg, red, green)
	}
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