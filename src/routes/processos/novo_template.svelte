<script>
    import Anexos from '$lib/components/Anexos.svelte'
    export let titulo = ''
    export let titulo_label = 'Assunto'
    export let descr = ''
    export let descr_label = 'Descrição'
    export let anexos = []
    export let onSubmit
    export let loading = false;
    let addFiles;
</script>
<template lang="pug">
    .filled.container
        .wrapper
            slot
            .campo
                h2 Anexo
                Anexos(bind:addFiles bind:files!='{anexos}')
        form.container(on:submit|preventDefault!='{onSubmit}')
            label
                | {titulo_label}
                input.campo.filled.container.assunto(required bind:value!='{titulo}')
            label {descr_label}
                textarea.campo.filled.container.descr(required maxlength=1000 bind:value!='{descr}' on:paste!="{({clipboardData:{files}})=>addFiles(files)}")
            .buttons
                input.action.button(class:disabled='{loading}' type='submit' value='Abrir chamado')
</template>

<style>
    label {
        display: flex;
        flex-flow: column;
        gap: 1em;
    }
    .filled.container:not(.assunto) {
        flex-flow: row;
		margin: auto;
		padding: 1em;
    }
    .wrapper {
        justify-content: flex-start;
        border-right: var(--dark) solid;
        padding-right: 2em;
    }
    .campo {
        font-size: small;
    }
	.container * {
		margin-top: 1em;
	}
    .campo {
        font-size: small;
        --fill-color: white;
        padding: 1em;
        margin: 1em;
        border: none;
    }
    .assunto {
        margin: 0;
        margin-bottom: 1em;
        width: auto;
        display: flex;
        flex-flow: row;
    }
	.descr {
        max-height: 30em;
		align-self: flex-end;
		min-width: 15em;
		min-height: 10em;
        margin: auto;
        resize: none;
    }
    .action.button {
        text-transform: uppercase;
        padding: 0.6em;
        border-radius: 0.5em;
        margin: 1em;
    }
</style>