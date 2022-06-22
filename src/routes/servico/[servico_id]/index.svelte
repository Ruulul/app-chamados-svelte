<script>
    import { getContext } from 'svelte'
    import { goto } from '$app/navigation'
    import { get_user } from '$lib/utils/db.js'
    import { update_servico } from '$lib/utils/servicos';
    import { user } from '$lib/stores/user.js'
    import { parseMD } from '$lib/utils/utils'

    /**
     * Objeto que mapeia o label do botão de alterar status com o status em si
     */
    const label_por_status = {
        pendente: 'Resolver chamado',
        resolvido: 'Fechar chamado',
        fechado: ''
    }
    /**
     * Lista encadeada de status com status.
     */
    const proximo_status = {
        pendente: 'resolvido',
        resolvido: 'fechado'
    }

    const servico = getContext('servico')
    function adicionaMensagem () {
        goto('addMensagem', {
            noscroll: true,
        })
    }

    function atualizaChamado () {
        let novo_status = proximo_status[$servico.status]
        if (novo_status)
        update_servico($servico.id, {status: novo_status})
            .then(os=>servico.set(os))
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
            {@html parseMD(message.mensagem)}
        </div>
    {/each}
</div>
{#if $servico?.status != 'fechado'}
    <div class='buttons'>
        <button on:click={adicionaMensagem}>Adicionar Mensagem</button>
        {#if [$servico?.atendenteId, $servico?.usuarioId].includes($user.id.toString())}
            <button on:click={atualizaChamado}>{label_por_status[$servico?.status]}</button>
        {/if}
    </div>
{/if}

<style>
    .messages {
        max-height: 55%;
        overflow-y: scroll;
    }
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