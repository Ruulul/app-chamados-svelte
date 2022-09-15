<script>
    import { getContext } from 'svelte'
    import { goto } from '$app/navigation'
    import { getUser } from '$lib/utils/db.js'
    import { updateProcesso, getCampo, getUnique, nextEtapa } from '$lib/utils/cadastros';
    import { user } from '$lib/stores/user.js'
    import { parseMD } from '$lib/utils/utils'
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import { metadado_hora, proximo_status } from '$lib/utils/utils';
import { sendEmail } from '$lib/utils/email';
    /**
     * Objeto que mapeia o label do botão de alterar status com o status em si
     */
    const label_por_status = {
        'em analise': 'Adicionar à fila',
        'pendente': 'Atender chamado',
        'em atendimento': 'Fechar chamado',
    }

    const servico = getContext('servico')
    const getServico = getContext('getServico')
    const classificador = getContext('classificador')
    $: campos_etapa = $servico?.etapa ? Object.fromEntries($servico?.etapa.campos) : {};
    $: console.log(campos_etapa)

    let files = {};
    $: $servico.log?.forEach(async log => files[log.id] = await getCampo('log', log.Tag, log.id, 'anexo'))
    $: console.log(files)
    function adicionaMensagem () {
        goto('addMensagem', {
            noscroll: true,
        })
    }

    async function atualizaChamado () {
        let novo_status = proximo_status[campos_etapa.status]
        let filial = Object.fromEntries($servico.campos)?.filial;
        let update;
        if (novo_status)
            update = {status: novo_status, [metadado_hora[novo_status]]:(new Date()).toISOString()};
        if (novo_status === 'em atendimento')
            update.suporteId = $user.id;
        await updateProcesso($servico, update)
            .then(async function(){
                if (novo_status.toLowerCase().includes("aguardando"))
                    sendEmail('on_hold', (await getUser($servico.idUsuario)).email, { idOS: $servico.id, status: novo_status });
            })
            .then(getServico)
            .catch(console.error)
        if (novo_status === 'fechado')
            await nextEtapa($servico, { 
                    dept:
                    filial === '0101' 
                        ? 9
                        : filial === '0201'
                        ? 22
                        : filial === '0401'
                        ? 29
                        : undefined,
                })
                .then(()=>history.back())
                .catch(console.error)
    }

    $: console.log($servico?.log)
    $: a_classificar = campos_etapa.categoria === 'A. D.'
</script>
<div class='campo filled container assunto'>
    Assunto:
    {$servico && $servico.log ? $servico.log[0].titulo : 'Carregando'}
</div>
<div class='messages'>
    {#each $servico?.log?.sort((a, b)=>b.id-a.id) || [] as {id, idUsuario, titulo, descr, createdAt}}
        {@const data_array = createdAt.split('T')}
        {@const data = data_array[0].split('-').reverse().join('/')}
        {@const hora = data_array[1].split('.')[0]}
        <div class='campo filled container'>
            <h3>
                {#await getUser(idUsuario)}
                    Carregando...
                {:then {nome}}
                {nome || 'Sem atendente'}
                {/await}
            </h3>
            <h3>{titulo}</h3>
            <div class='campo'>
                {@html parseMD(descr)}
                <dd>{data + ' ' + hora}</dd>
                {#each Array.isArray(files[id]) ? Object.values(files[id]) : [] as {data = 'data:;base64,', title}}
                    <ExibeArquivo {data} title={title?.split('-')[1]}/>
                {/each}

            </div>
        </div>
    {/each}
</div>
{#if $servico?.status != 'fechado'}
    <div class='buttons'>
        {#if [$servico?.atendenteId, $servico?.usuarioId].includes($user.id.toString()) || $user.cargo === 'admin'}
            <button class='action button' on:click={a_classificar ? $classificador.dialog.showModal.bind($classificador.dialog) : atualizaChamado}>{a_classificar ? 'Classificar e Assumir' : label_por_status[campos_etapa.status]}</button>
        {/if}
        <button class='action button' on:click={adicionaMensagem}>Adicionar Mensagem</button>
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