<script>
    import { addMensagem, getUnique } from '$lib/utils/cadastros.js'
    import { parseMD } from '$lib/utils/utils';
    import { user } from '$lib/stores/user.js'
    import { getContext } from 'svelte';
    import Anexos from '$lib/components/Anexos.svelte';
    
    let value = '';
    let files = [];
    let addFiles = undefined;
    $: parsed = parseMD(value)
    let enviando = false;
    const servico = getContext('servico')

    function voltar () {
        history.back()
    }

    function onSubmit () {
        let mensagem = {
            idUsuario: $user.id,
            descr: value,
            titulo: 'msg',
            anexos: files
        }
        enviando = true
        if (value.length > 0)
        addMensagem($servico, mensagem)
            .then(()=>getUnique('processo', 'suporte_tecnico', $servico.id))
            .then(servico.set)
            .then(()=>enviando=false)
            .then(voltar)
            .catch(console.error)
        else enviando = false
    }
</script>
<template lang=pug>
    form(on:submit|preventDefault='{onSubmit}')
        textarea.outlined.container(bind:value maxlength=1000 rows=20 cols=60 on:paste!='{({clipboardData:{files}})=>addFiles(files)}')
        br
        Anexos(bind:files bind:addFiles)
        .buttons
            button.action.button(disabled='{enviando}' type='submit') Enviar mensagem
            button.action.button(on:click='{voltar}') Voltar
</template>

<style>
    button:disabled {
        pointer-events: none;
        cursor: not-allowed;
        opacity: 0.5;
    }
    .action.button {
        text-transform: uppercase;
        padding: 0.6em;
        border-radius: 0.5em;
        margin: 1em;
    }
    textarea {
        padding: 1em;
        margin-bottom: 1em;
    }
</style>