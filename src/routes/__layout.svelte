<script>
import SideBar from '$lib/components/SideBar.svelte'
import UpBar from '$lib/components/UpBar.svelte'
import { user } from '$lib/stores/user.js'
import { goto } from '$app/navigation'
import { browser } from '$app/env'

function auth() {
	return new Promise(
		async function (resolve, reject) {
			if (browser && !$user) 
				await goto('/login')
			resolve()
		}
	)
}
</script>
{#await Promise.resolve($user)}
	<h1>Loading...</h1>
{:then}
	{#await auth() then}
		<a style="visibility: hidden" href="#main">Ir para conteúdo principal</a>
		<UpBar/>
		<SideBar/>
		<div id="main">
			<slot/>
		</div>
	{/await}
{/await}