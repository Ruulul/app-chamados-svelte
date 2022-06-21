<script>
    import { goto } from '$app/navigation'
    import { update_servico } from '$lib/utils/db.js'
    import { user } from '$lib/stores/user.js'
    let value;

    function voltar () {
        goto(`../`, {
            noscroll: true,
        })
    }

    function onSubmit () {

    }
</script>
<form on:submit={onSubmit}>
    <textarea bind:value maxlength="1000" rows='20' cols='60' />
    <div class='buttons'>
        <button type='submit'>Enviar mensagem</button>
        <button on:click={voltar}>Voltar</button>
    </div>
</form>

<style>
    form {
        display: block;
        margin: auto;
        margin-top: 2em;
    }
    textarea {
        border: thin blue solid;
        padding: 1em;
        border-radius: 3em;
    }
    .buttons {
        display: flex;
        height: fit-content;
        place-content: center;
        margin-top: 3em;
    }
    .buttons button {
        padding: 0.2em;
        margin: 1em;
    }
</style>