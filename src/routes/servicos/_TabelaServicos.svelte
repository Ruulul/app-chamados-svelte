<script>
    import { get_user } from '$lib/utils/db.js'
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate'
    import { onDestroy } from 'svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    export let sort;
    export let servicos;
    let sinal = 1;
    let agora = Date.now()/1000
    let handlerAgora = setInterval(()=>agora=Date.now()/1000, 1000)
    let ISOd = getDateFromISO
    
    onDestroy(()=>clearInterval(handlerAgora))


    function getDateFromISO (ISODate) {
        return ISODate?.split('T')[0].split('-').reverse().join('/') || ''
    }
</script>
<table>
    <caption>Ordens de Serviço</caption>
    <thead>
        <th>
            ID
        </th>
        <th>
            Assunto
        </th>
        <th>
            Status
        </th>
        <th class='filtro'>
            <button on:click={()=>sinal*=-1}>
                {sinal==1 ? '▲' : '▼'}
            </button>
        </th>
    </thead>
    <tbody>
        {#each servicos.sort((a,b)=>sinal==1?sort(a,b):!sort(a,b)) as servico(servico.id)}
            {@const prazoDateObj = new Date(servico.prazo)}
            {@const prazo = prazoDateObj.getTime()/1000}
            {@const diffTime = Math.floor(prazo - agora)}
            {@const expired = diffTime < 0}
            <tr 
                transition:fly={{y: 100}} 
                animate:flip
                class:expired>
                <td>
                    {servico.id}
                </td>
                <td>
                    <a sveltekit:prefetch href="/servico/{servico.id}">{servico.assunto}</a>
                </td>
                <td>
                    {servico.status}
                </td>
                    <td>
                        {#key agora}
                        <span class='tempo'>
                            {Math.floor(diffTime/86400)} dias <br> 
                            {Math.floor(diffTime/3600) % 24}h 
                            {Math.floor(diffTime/60)%60}min {diffTime%60}s
                        </span>
                        {/key}
                        <span class='prazo'>{ISOd(servico.prazo)}</span>
                        <span class='abertura'>{ISOd(servico.createdAt)}</span>
                        <span class='prioridade'>{['Baixa', 'Média', 'Alta', 'Urgente'][servico.prioridade-1]}</span>
                    </td>
                <Tooltip>
		            Tipo: {servico.tipo}<br>
		            Categoria: {servico.subCategoria}<br>
		            Aberto em: {ISOd(servico.createdAt)}
		            {#if servico.assumido_em}
		            Assumido em {ISOd(servico.assumido_em)}<br>
		            {/if}
                    Prioridade: {['Baixa', 'Média', 'Alta', 'Urgente'][servico.prioridade-1]}<br>
		            Prazo estimado: {ISOd(servico.prazo)}<br>
		            Tempo {expired ? 'passado' : 'restante'} : 
		            <br>{Math.floor(diffTime/86400)} dias 
		            <br> {Math.floor(diffTime/3600) % 24}h 
		            {Math.floor(diffTime/60)%60}min {diffTime%60}s<br>
		            {#if servico.atendenteId}
		            {#await get_user(servico.atendenteId) then {nome}}
		            Assistente: {nome}<br>
		            {/await}
		            {/if}
                </Tooltip>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    span.tempo {
        display: var(--active-tempo, none);
    }
    span.prazo {
        display: var(--active-prazo, none);
    }
    span.abertura {
        display: var(--active-abertura, none);
    }
    span.prioridade {
        display: var(--active-prioridade, none);
    }
    th.filtro::before {
        content: var(--active, 'filtro');
        text-transform: capitalize;
    }
    .expired {
        background-color: rgb(196, 30, 30);
        color: white
    }
    .expired :link {
        color: yellow
    }
    .expired :visited {
        color: aliceblue
    }
    tr {
        text-align: center;
    }
    tr:hover :global(.anchor .tooltip) {
        opacity: 1;
    }
    table {
        justify-content: space-around;
        width: 75%;
    }
    caption {
        caption-side: bottom;
        text-align: left;
        padding: 1em;
    }
</style>