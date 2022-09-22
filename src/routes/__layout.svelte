<script>
import "../app.css";
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/css/solid.css'
import SideBar from '$lib/components/SideBar.svelte'
import UpBar from '$lib/components/UpBar.svelte'
import { user } from '$lib/stores/user.js'
import { filiais_validas, filial } from '$lib/utils/filial.js'
import { goto } from '$app/navigation'
import { page, navigating } from '$app/stores'
import { browser } from '$app/env'
import { onMount } from "svelte";
import Dialog from "$lib/components/Dialog.svelte";

$: loading = !!$navigating

/**
 * @type {?HTMLDialogElement}
 */
let escolhe_filial_dialog

let auth_resolve;
let auth_promise = new Promise((res)=>auth_resolve=res);

$: 	if 		($user) auth_resolve()
	else if	(browser && $user === null) goto('/login');

let style;
if (browser) style = document.documentElement.style
$: if (browser) switch ($filial) {
	case '0101':
		style.setProperty('--logo-filial', 'var(--logo-filial-ob)')
		break;
	case '0201':
		style.setProperty('--logo-filial', 'var(--logo-filial-sm)')
		break;
	case '0401':
		style.setProperty('--logo-filial', 'var(--logo-filial-ms)')
		break;
}

onMount(()=>{
	auth_promise.then(()=>{
		if ($user.filiais.length > 1)
			escolhe_filial_dialog.showModal()
		else console.log("Sem múltiplas filiais")
	})
})
</script>

<svelte:head>
	<title>
		{$page.stuff.title}
	</title>
</svelte:head>

<Dialog title='' bind:dialog={escolhe_filial_dialog}>
	<form on:submit|preventDefault={escolhe_filial_dialog.close()}>
		<label>Selecione a filial
			<select bind:value={$filial}>
				{#each $filiais_validas as filial}
					<option>{filial}</option>
				{/each}
			</select>
		</label>
		<input type='submit' value='Confirmar'/>
	</form>
</Dialog>

{#await auth_promise}
	<h1>Loading...</h1>
{:then}
	<a href="#main">Ir para conteúdo principal</a>
	<div class='grid'>
		<div class='upbar'>
			<UpBar filial_dialog={escolhe_filial_dialog}/>
		</div>
		<div class='sidebar'>
			<SideBar/>
		</div>
		<main id="main">
			<slot/>
		</main>
	</div>
{/await}

<style>
dialog form, form label {
	display: flex;
	flex-flow: column;
	gap: 1em;
}
.grid {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-template-rows: repeat(12, 1fr);
	justify-content: space-around;
	width: auto;
	height: 98vh;
	grid-column-gap: 0px;
	grid-row-gap: 0px;
}
.sidebar {
	grid-column: 1 / 1;
	grid-row: 2 / 13;
}
#main {
	grid-column: 2 / 12;
	grid-row: 2 / 12;
	width: 88vw;
}
.upbar {
	grid-row: 1 / 1;
	grid-column: 1 / 12;
	width: auto;
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