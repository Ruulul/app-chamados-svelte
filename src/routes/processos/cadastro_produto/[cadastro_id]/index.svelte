<script>
    import { getContext } from 'svelte'
    import { getUser } from '$lib/utils/db.js'
    import { parseMD } from '$lib/utils/utils'
    import { user } from '$lib/stores/user';
    import { addMensagem, deleteMensagem, getUnique } from '$lib/utils/cadastros';

    import { notifications } from '$lib/stores/cadastros';

    const cadastro = getContext('cadastro')
    const getProcesso = getContext('getProcesso')
    let value = ''

    $: mensagem = {
        titulo: 'mensagem',
        descr: value,
    }

    function deleteMsg (id) {
        return async function () {
            await deleteMensagem(id)
            getProcesso()
        }
    }
</script>
<div class='campo filled container assunto'>
    Assunto:
    {$cadastro?.log[0]?.titulo}
</div>
<div class='messages'>
    {#each $cadastro?.log.sort((a, b)=>b.id-a.id) || [] as {idUsuario, titulo, descr, createdAt, id}, index}
        {@const data_obj = new Date(createdAt)}
        {@const data = data_obj?.toLocaleDateString() || '[??/??/??'}
        {@const hora = data_obj?.toLocaleTimeString() || '[??:??:??]'}
        <div class='campo filled container'>
            <h3>
                {#await getUser(idUsuario)}
                    Carregando...
                {:then {nome}}
                {nome || 'Sem atendente'}
                {/await}
            </h3>
            <h3 class:hidden={titulo==='mensagem'}>{titulo}</h3> <span class:hidden={idUsuario!==$user.id} class=close-button on:click={deleteMsg(id)}>X</span>
            <dd class:hidden={$notifications[$cadastro.id] >= id} class=mark-as-read on:click={notifications.markAsRead($cadastro.id, id)}>Marcar como lido</dd>
            <dd class:hidden={$notifications[$cadastro.id] <  id} class=mark-as-read on:click={notifications.markAsRead($cadastro.id, $cadastro.log.length > 1 ? $cadastro.log.at(index - 1).id : 0)}>Marcar como não lido</dd>
            {@html parseMD(descr)}
            <dd>{data + ' ' + hora}</dd>
        </div>
    {/each}
</div>
<textarea bind:value/>
<button on:click={()=>
    addMensagem($cadastro, mensagem)
        .then(getProcesso)
        .then(()=>value='')
        } class='action button'>Nova mensagem</button>

<style>
    .mark-as-read {
        text-decoration: underline;
        cursor: pointer;
    }
    .hidden {
        display: none;
    }
    .close-button {
        position: absolute;
        right: 1em;
        border: solid var(--text-color) 1px;
        padding: 3px;
        border-radius: 2em;
        cursor: pointer;
    }
    .hidden {
        display: none;
    }
    .messages {
        max-height: 30em;
        overflow-y: scroll;
        width: 100%;
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