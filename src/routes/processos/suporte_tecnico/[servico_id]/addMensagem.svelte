<script>
    import { addMensagem } from '$lib/utils/cadastros.js'
    import { parseMD } from '$lib/utils/utils';
    import { user } from '$lib/stores/user.js'
    import { getContext } from 'svelte';
    import Anexos from '$lib/components/Anexos.svelte';
    
    let value = '';
    let files = [];
    let addFiles = undefined;
    $: parsed = parseMD(value)
    const servico = getContext('servico')

    function voltar () {
        history.back()
    }

    function onSubmit () {
        let mensagem = {
            idUsuario: $user.id,
            descr: value,
            titulo: 'msg',
            anexo: files[0]
        }
        if (value.length > 0)
        addMensagem($servico.id, mensagem)
            .then(chat=>$servico.chat = chat)
            .then(voltar)
    }
</script>
<form on:submit|preventDefault={onSubmit}>
    <p>
        Prévia:
    </p>
        {@html parsed}
    <textarea class='outlined container' bind:value maxlength="1000" rows='20' cols='60' on:paste={({clipboardData:{files}})=>addFiles(files)}/>
        <br>
        <Anexos bind:files bind:addFiles/>
    <div class='buttons'>
        <button class='action button' type='submit'>Enviar mensagem</button>
        <button class='action button' on:click={voltar}>Voltar</button>
    </div>
</form>

<style>
    .action.button {
        text-transform: uppercase;
        padding: 0.6em;
        border-radius: 0.5em;
        margin: 1em;
    }
    textarea {
        padding: 1em;
    }
</style>