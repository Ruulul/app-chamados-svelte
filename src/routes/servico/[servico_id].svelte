<script>
    import { get_servico, get_file } from '$lib/utils/db.js'
    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    let servico
    let wrapper;
    $: width = wrapper?.offsetWidth || 0
    $: console.log(width)
    get_servico($page.params.servico_id).then((data)=>servico=data)
</script>
<svelte:head>
    <title>
        Chamado {$page.params.servico_id}
    </title>
</svelte:head>

{#if !servico}
<h1>Carregando...</h1>
{:else if servico === 'Não autorizado'}
{goto('/login')}
{:else}
<h1>Chamado {servico.id}</h1>
<div class='big-wrapper'>
<div class='wrapper' bind:this={wrapper}>
    <div class='container'>
        <div class='campo'>
            <h2>Assunto</h2>
            {servico.assunto}
        </div>
        <div class='campo'>
            <h2>Atendente</h2>
            {servico.atendenteId || 'Sem atendente'}
        </div>
        <div class='campo'>
            <h2>Atendido</h2>
            {servico.usuarioId}
        </div>
        <div class='campo'>
            <h2>Categoria</h2>
            {servico.subCategoria}
        </div>
        <div class='campo'>
            <h2>Status</h2>
            {servico.status}
        </div>
    </div>
    <div class='container'>
        <h2>
            Mensagens
        </h2>
        <div class='messages'>
            {#each servico.chat.reverse() as message}
                <div class='campo'>
                    <h3>
                        {message.autorId}
                    </h3>
                    <p>
                        {message.mensagem}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</div>
<div class='wrapper'>
    <div class='campo'>
        <h2>Anexo</h2>
        {#await get_file(servico.anexo)}
        Carregando...
        {:then anexo}
        {#if anexo.includes('image')}
            <img alt='' src={anexo}/>
        {:else}
            <object title='anexo' alt='' data={anexo}>
                Não pudemos exibir
            </object>
            <a href={anexo} target='_blank'>Abrir anexo</a>
        {/if}
        {/await}
    </div>
    <div class='buttons'>
        <button>Adicionar Mensagem</button>
        <button>Fechar Chamado</button>
    </div>
</div>
</div>
{/if}

<style>
    .big-wrapper {
        display: flex;
        flex-flow: column;
        justify-content: flex-end;
        width: 80%;
    }
    .wrapper {
        display: flex;
        flex-flow: row;
        border: red solid;
        border-radius: 1.5em;
    }
    .campo {
        font-size: small;
        border: grey solid;
        margin: 1em;
        padding: 1em;
        border-radius: 2em;
    }
    .container {
        width: 50%;
        display: flex;
        flex-flow: column;
    }
    .messages {
        height: 35em;
        overflow: auto;
    }
    .buttons {
        display: flex;
        width: 100%;
        height: fit-content;
        place-content: center;
        margin-top: 3em;
    }
    .buttons button {
        padding: 0.2em;
        margin: 1em;
    }
    img {
        width: 100%;
    }
</style>