<script>
    import { setContext } from 'svelte';
    import { get_user, } from '$lib/utils/db.js'
    import { get_servico, update_servico } from '$lib/utils/servicos';
    import { converteDateToISO } from '$lib/utils/utils.js'
    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    import { user } from '$lib/stores/user.js'
    import { writable } from 'svelte/store';
    import { fade } from 'svelte/transition';
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';

    let servico
    let servico_store = writable()
    setContext('servico', servico_store)
    function liberaChamado () {
        let update = {
            atendimento: false,
            atendenteId: ''
        }
        update_servico(servico.id, update, 'released').then(setServico)
    }

    function assumeChamado () {
        let update = {
            atendimento: true,
            atendenteId: $user.id,
            assumido_em: converteDateToISO(Date())
        }
        update_servico(servico.id, update, 'taken').then(setServico)
    }

    async function get_servico_and_clone () {
        let servico = await get_servico($page.params.servico_id)
        setServico(servico)
    }

    function setServico (novo_servico) {
        servico = novo_servico
        servico_store.set(novo_servico)
    }
</script>
<svelte:head>
    <title>
        Chamado {$page.params.servico_id}
    </title>
</svelte:head>
{#key servico?.updatedAt}
{#await get_servico_and_clone()}
    <h1>Carregando...</h1>
    {:then}
    {#if servico === 'Não autorizado'}
    {goto('/login')}
    {:else}
    <h1>Chamado {servico.id}</h1>
    <div transition:fade={{duration: 200, easing:(t)=>Math.log1p(t)}} class='wrapper'>
        <div class='container'>
            <div class='campo'>
                <h2>Assunto</h2>
                {servico.assunto}
            </div>
            <div class='campo'>
                <h2>Atendente</h2>
                {#if servico.atendenteId && servico.atendenteId !== 'undefined'}
                    {#if servico.atendenteId == $user.id}
                        {$user.nome}<br>
                        <button on:click={liberaChamado}>Liberar chamado?</button>
                    {:else}
                        {#await get_user(servico.atendenteId)}
                            Carregando...
                        {:then {nome}}
                        {nome || 'Sem atendente'}
                        {/await}
                    {/if}
                {:else} 
                    Sem atendente<br>
                    {#if $user.tipo == 'suporte'}
                        <button on:click={assumeChamado}>Assumir chamado?</button>
                    {/if}
                {/if}
            </div>
            <div class='campo'>
                <h2>Atendido</h2>
                {#await get_user(servico.usuarioId)}
                    Carregando...
                {:then {nome}}
                {nome || 'Sem usuário'}
                {/await}
            </div>
            <div class='campo'>
                <h2>Categoria</h2>
                {servico.subCategoria}
            </div>
            <div class='campo'>
                <h2>Status</h2>
                {servico.status}
            </div>
            <div class='campo'>
            <h2>Anexo</h2>
                <ExibeArquivo filename={servico.anexo} />
            </div>
        </div>
        <div class='container'>
            <slot/>
         </div>
    </div>
    {/if}
{/await}
{/key}

<style>
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
</style>