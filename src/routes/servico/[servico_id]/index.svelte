<script>
    import { getContext } from 'svelte'
    import { goto } from '$app/navigation'
    import { getUser } from '$lib/utils/db.js'
    import { updateServico } from '$lib/utils/servicos';
    import { user } from '$lib/stores/user.js'
    import { parseMD } from '$lib/utils/utils'
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
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

    /**
     * Lista encadeada de status com metadado
     */
    const metadado_hora = {
        resolvido: 'resolvido_em',
        fechado: 'fechado_em'
    }

    const servico = getContext('servico')
    function adicionaMensagem () {
        goto('addMensagem', {
            noscroll: true,
        })
    }

    function atualizaChamado () {
        let novo_status = proximo_status[$servico.status]
        let update;
        if (novo_status)
            update = {status: novo_status, [metadado_hora[novo_status]]:(new Date()).toISOString()}
        if (update)
            updateServico($servico.id, update, novo_status === 'fechado' ? 'closed' : undefined)
                .then(servico.set)
                .then(function(){if(novo_status==='fechado')window.history.back()})
    }

</script>
<div class='campo filled container assunto'>
    Assunto:
    {$servico.assunto}
</div>
<div class='messages'>
    {#each $servico?.chat.sort((a, b)=>b.id-a.id) || [] as {autorId, mensagem, metadados}}
    {@const title = metadados.find(({nome})=>nome=='anexo')?.valor}
        <div class='campo filled container'>
            <h3>
                {#await getUser(autorId)}
                    Carregando...
                {:then {nome}}
                {nome || 'Sem atendente'}
                {/await}
            </h3>
            {@html parseMD(mensagem)}
            <ExibeArquivo {title} sem_arquivo=''/>
        </div>
    {/each}
</div>
{#if $servico?.status != 'fechado'}
    <div class='buttons'>
        <button class='action button' on:click={adicionaMensagem}>Adicionar Mensagem</button>
        {#if [$servico?.atendenteId, $servico?.usuarioId].includes($user.id.toString())}
            <button class='action button' on:click={atualizaChamado}>{label_por_status[$servico?.status]}</button>
        {/if}
    </div>
{/if}

<style>
    .messages {
        max-height: 30em;
        overflow-y: scroll;
    }
    .messages .campo::before {
        content: ' ';
        position: absolute;
        left: -1em;
        border-top: 1em solid transparent;
        border-left: 1em solid white;
        border-bottom: 1em solid transparent;
    }
    .assunto {
        width: 100%;
    }
    .campo {
        font-size: small;
        --fill-color: white;
        padding: 1em;
        margin: 1em;
    }
    .action.button {
        text-transform: uppercase;
        padding: 0.6em;
        border-radius: 0.5em;
        margin: 1em;
    }
</style>