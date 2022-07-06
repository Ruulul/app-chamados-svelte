<script>
    import { goto } from '$app/navigation'
    import { add_mensagem } from '$lib/utils/servicos.js'
    import { parseMD } from '$lib/utils/utils';
    import { user } from '$lib/stores/user.js'
    import { getContext } from 'svelte';
    
    let value = '';
    $: parsed = parseMD(value)
    const servico = getContext('servico')

    function voltar () {
        goto('/servico/' + $servico.id, {
            noscroll: true,
        })
    }

    function onSubmit () {
        let mensagem = {
            autorId: $user.id,
            mensagem: value
        }
        if (value.length > 0)
        add_mensagem($servico.id, mensagem)
            .then(chat=>$servico.chat = chat)
            .then(voltar)
    }
</script>
<form on:submit|preventDefault={onSubmit}>
    <p>
        Prévia:
    </p>
        {@html parsed}
    <textarea class='outlined container' bind:value maxlength="1000" rows='20' cols='60' />
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
</style>