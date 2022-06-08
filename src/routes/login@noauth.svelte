<script>
	let email;
	let senha;
	function handleLogin() {
		console.log(`Login de ${JSON.stringify({email, senha})}`)
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