<script>
    import { get_servico, get_file } from '$lib/utils/db.js'
    import { page } from '$app/stores'
    let servico
    get_servico($page.params.servico_id).then((data)=>servico=data)
</script>
<svelte:head>
    <title>
        Chamado {$page.params.servico_id}
    </title>
</svelte:head>

{#if !servico}
<h1>Carregando...</h1>
{:else}
<h1>Chamado {servico.id}</h1>
<div class='wrapper'>
    <div class='container'>
        {#each Object.entries(servico).filter(
            campo=>!['id', 'prazo', 'updatedAt','autorId', 'chat', 'createdAt', 'filialId'].includes(campo[0])
        ) as campo}
        <div class='campo'>
            <h2>{campo[0]}</h2>
            {#if campo[0] == 'anexo'}
                {#await get_file(campo[1]) then src}
                    <img alt='' {src}/>
                {/await}
            {:else}
            <p>{campo[1]}</p>
            {/if}
        </div>
        {/each}
    </div>
    <div class='container'>
    </div>
</div>
{/if}

<style>
    .wrapper {
        display: flex;
        flex-flow: row;
    }
    .campo {
        font-size: small;
    }
    .container {
        width: 50%;
        border: red solid;
        display: flex;
        flex-flow: column;
    }
    img {
        width: 100%;
    }
</style>