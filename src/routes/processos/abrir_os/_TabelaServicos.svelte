<script>
    import { onDestroy } from 'svelte';
    import LinhaTabelaServicos from './_LinhaTabelaServicos.svelte';
    import { filtros } from '$lib/stores/servicos';
    import { getServicos,} from '$lib/utils/servicos';
    export let sort;
    let servicos = [];

    $: getServicos($filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(oss=>servicos=oss)

    let agora = Date.now()/1000
    let handlerAgora = setInterval(()=>agora=Date.now()/1000, 1000)
    onDestroy(()=>clearInterval(handlerAgora))

</script>
<div class='filled container'>
    <slot/>
<table>
    <caption>Ordens de Serviço</caption>
    <thead class='underline'>
        <th>
            Filial
        </th>
        <th>
            Sla
        </th>
        <th>
            ID
        </th>
        <th>
            Status
        </th>
        <th>
            Assistente
        </th>
        <th>
            Assunto
        </th>
        <th>
            Abertura
        </th>
        <th>
            Fechamento
        </th>
        <th class='filtro'/>
    </thead>
    <tbody>
        {#each servicos.sort(sort) as servico(servico.id)}
            <LinhaTabelaServicos {agora} id={servico.id}/>
        {/each}
    </tbody>
</table>
</div>
<style>
    th {
        padding-top: 1em;
        padding-bottom: 1em;
    }
    th.filtro::before {
        content: var(--active, 'filtro');
        text-transform: capitalize;
    }
    div {
        padding-top: 0;
        padding-right: 1em;
        padding-left: 1em;
        width: auto;
        height: 100%;
        justify-content: flex-start;
        gap: 1.2em;
    }
    caption {
        caption-side: bottom;
        text-align: left;
        padding: 1em;
    }
</style>