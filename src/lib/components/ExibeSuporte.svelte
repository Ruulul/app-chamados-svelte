<script>
    export let nome = 'Carregando...'
    export let atendendo = '...'
    export let id
    export let atendido_hoje = '...'
    export let atendido_semana = '...'
    import { get_file } from '$lib/utils/db.js'
</script>

<div>
    {#await get_file('ProfileIcon' + id)}
        <p>Carregando foto de perfil...</p>
    {:then src}
        {#if !src || src === 'Não autorizado'}
            <p>Sem foto de perfil</p>
        {:else}
            <img alt='' {src} />
        {/if}
    {/await}
    <h3>{nome}</h3>
    <h4>Chamados</h4>
    <p>Em atendimento: {atendendo}</p>
    <p>Resolvidos hoje: {atendido_hoje}</p>
    <p>Outros resolvidos na semana: {atendido_semana}</p>
</div>

<style>
    div {
        display: flex;
        flex-flow: column;
        border: thin blue solid;
        width: fit-content;
        padding: 1em;
        float: left;
    }

    img {
        width: 8em;
        height: 10em;
        display: block;
        margin: auto;
        border: thin crimson solid;
        border-radius: 4em 4em 2em 2em;
        padding: 0.2em;
    }
</style>