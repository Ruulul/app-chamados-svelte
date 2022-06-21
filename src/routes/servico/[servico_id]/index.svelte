<script>
    import { getContext } from 'svelte'
    import { goto } from '$app/navigation'
    import { get_user } from '$lib/utils/db.js'
    import { user } from '$lib/stores/user.js'

    const servico = getContext('servico')
    function adicionaMensagem () {
        goto('addMensagem', {
            noscroll: true,
        })
    }

    function atualizaChamado () {

    }

</script>
<h2>
    Mensagens
</h2>
<div class='messages'>
    {#each $servico?.chat.sort((a, b)=>b.id-a.id) || [] as message}
        <div class='campo'>
            <h3>
                {#await get_user(message.autorId)}
                    Carregando...
                {:then {nome}}
                {nome || 'Sem atendente'}
                {/await}
            </h3>
            <p>
                {message.mensagem}
            </p>
        </div>
    {/each}
</div>
<div class='buttons'>
    <button on:click={adicionaMensagem}>Adicionar Mensagem</button>
    {#if $servico?.status != 'fechado' && [$servico?.atendenteId, $servico?.usuarioId].includes($user.id.toString())}
        <button on:click={atualizaChamado}>Fechar Chamado</button>
    {/if}
</div>

<style>
    .campo {
        font-size: small;
        border: grey solid;
        margin: 1em;
        padding: 1em;
        border-radius: 2em;
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