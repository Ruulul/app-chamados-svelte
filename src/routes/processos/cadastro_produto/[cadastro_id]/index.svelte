<script>
    import { getContext } from 'svelte'
    import { getUser } from '$lib/utils/db.js'
    import { user } from '$lib/stores/user.js'
    import { parseMD } from '$lib/utils/utils'
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import { addMensagem, getUnique } from '$lib/utils/cadastros';

    const cadastro = getContext('cadastro')
    let value = ''
    $: log = ($cadastro) ? [...$cadastro.log].reverse() : []

    $: mensagem = {
        titulo: 'mensagem',
        descr: value,
    }
    $: console.log(mensagem)
</script>
<div class='campo filled container assunto'>
    Assunto:
    {$cadastro?.log[0]?.titulo}
</div>
<div class='messages'>
    {#each $cadastro?.log.sort((a, b)=>b.id-a.id) || [] as {idUsuario, titulo, descr, createdAt, metadados}}
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
            {@html parseMD(descr)}
            <dd>{data + ' ' + hora}</dd>
        </div>
    {/each}
</div>
<textarea bind:value/>
<button on:click={()=>
    addMensagem($cadastro, mensagem)
    .then(()=>getUnique('processo', $cadastro.Tag, $cadastro.id))
    .then(cadastro.set)
    .then(()=>value='')
    } class='action button'>Nova mensagem</button>

<style>
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