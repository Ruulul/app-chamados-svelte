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
		<div class='grid'>
			<div class='upbar'>
				<UpBar/>
			</div>
			<div class='sidebar'>
				<SideBar/>
			</div>
			<main id="main">
				<slot/>
			</main>
		</div>
	{/await}
{/await}

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-template-rows: repeat(12, 1fr);
	justify-content: space-around;
	width: auto;
	height: 100vh;
	grid-column-gap: 0px;
	grid-row-gap: 0px;
}
.sidebar {
	position: fixed;
	height: 100vh;
}
.upbar, #main {
	grid-column: 2 / 12;
	width: 88vw;
}
.upbar {
	grid-row: 1 / 1;
}
#main {
	grid-row: 2 / 12;
}

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