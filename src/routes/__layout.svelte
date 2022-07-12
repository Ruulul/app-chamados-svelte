<script>
import "../app.css";
import SideBar from '$lib/components/SideBar.svelte'
import UpBar from '$lib/components/UpBar.svelte'
import { user } from '$lib/stores/user.js'
import { goto } from '$app/navigation'
import { page, navigating } from '$app/stores'
import { browser } from '$app/env'

$: loading = !!$navigating

function auth() {
	return new Promise(
		async function (resolve) {
			if (browser && !$user) 
				await goto('/login')
			resolve()
		}
	)
}
</script>
<svelte:head>
	<title>
		{$page.stuff.title}
	</title>
</svelte:head>
{#await Promise.resolve($user)}
	<h1>Loading...</h1>
{:then}
	{#await auth() then}
		<a href="#main">Ir para conteúdo principal</a>
		<UpBar/>
		<SideBar/>
		<main id="main">
			<slot/>
		</main>
	{/await}
{/await}

<style>
a	{
	transition: width 5s, height 5s;
	position:absolute;
	left:-10000px;
	top:auto;
	width:1px;
	height:1px;
	overflow:hidden;
}
 
a:focus {
	width:auto;
	height:auto;
	left: 0
}
</style>