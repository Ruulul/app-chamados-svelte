<script>
    import { notifications } from "$lib/stores/cadastros";
    import { user } from "$lib/stores/user";
    import ExibeNome from "$lib/components/ExibeNome.svelte";
    import { parseMD } from "$lib/utils/utils";
    import { addMensagem } from "$lib/utils/cadastros";
    export let getProcesso
    export let processo
    let value = ''
    let sending = false;

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
    {processo?.log?.at(0)?.titulo}
</div>
<div class='messages'>
    {#each processo?.log?.sort((a, b)=>b.id-a.id) || [] as {idUsuario, titulo, descr, createdAt, id}, index}
        {@const data_obj = new Date(createdAt)}
        {@const data = data_obj?.toLocaleDateString() || '[??/??/??'}
        {@const hora = data_obj?.toLocaleTimeString() || '[??:??:??]'}
        <div class='campo filled container'>
            <h3>
                <ExibeNome id={idUsuario}/>
            </h3>
            <h3 class:hidden={titulo==='mensagem'}>{titulo}</h3> <span class:hidden={idUsuario!==$user.id} class=close-button on:click={deleteMsg(id)}>X</span>
            <dd class:hidden={$notifications[processo.id] >= id} class=mark-as-read on:click={notifications.markAsRead(processo.id, id)}>Marcar como lido</dd>
            <dd class:hidden={$notifications[processo.id] <  id} class=mark-as-read on:click={notifications.markAsRead(processo.id, processo.log.length > 1 ? processo.log.at(index - 1).id : 0)}>Marcar como não lido</dd>
            {@html parseMD(descr)}
            <dd>{data + ' ' + hora}</dd>
        </div>
    {/each}
</div>
<textarea bind:value/>
<div class='buttons'>
    <slot name='buttons'/>
    <button on:click={async ()=>{
        sending = true;
        await addMensagem(processo, mensagem)
            .then(getProcesso)
            .then(()=>value='')
        sending = false;
        }} class='action button' class:disabled={sending}>Nova mensagem</button>
</div>

<style>
    .mark-as-read {
        text-decoration: underline;
        cursor: pointer;
    }
    .close-button {
        position: absolute;
        right: 1em;
        border: solid var(--text-color) 1px;
        padding: 3px;
        border-radius: 2em;
        cursor: pointer;
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