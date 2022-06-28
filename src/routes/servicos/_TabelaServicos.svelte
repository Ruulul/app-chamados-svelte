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
    
    onDestroy(()=>clearInterval(handlerAgora))


    function getDateFromISO (ISODate) {
        return ISODate.split('T')[0].split('-').reverse().join('/')
    }

    function getCampoFiltro (servico, name) {
        switch (name) {
            case 'abertura':
                return getDateFromISO(servico.createdAt)
            case 'prazo':
                return getDateFromISO(servico[name])
            case 'assumido_em':
                return getDateFromISO(servico.assumido_em)
            case 'prioridade':
                return ['Baixa', 'Média', 'Alta', 'Urgente'][servico[name]-1]
            case 'tempo':
            let prazoDateObj = new Date(servico.prazo)
            let prazo = prazoDateObj.getTime()/1000
            let diffTime = Math.floor(prazo - agora)
            let dias = Math.floor(diffTime/86400)
            let horas = Math.floor(diffTime/3600) % 24
            return  (dias!=0?`${dias} dias `:' ')+
                    (horas!=0?`${horas} h `:' ')+
                    `${Math.floor(diffTime/60)%60}min ${diffTime%60}s`
        }
        return servico[name]
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
        {#if !['sort', 'porAssunto'].includes(sort.name)}
        {@const name=sort.name.slice(3)}
            <th transition:fly={{x:200}}>
                {name}
                <button on:click={()=>sinal*=-1}>
                    {sinal==1 ? '▲' : '▼'}
                </button>
            </th>
        {/if}
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
                {#if !['sort', 'porAssunto'].includes(sort.name)}
                {@const name=sort.name.slice(3).toLowerCase()}
                    <td transition:fly={{x:200}}>
                        {#key agora}
                        {getCampoFiltro(servico, name)}
                        {/key}
                    </td>
                {/if}
                <Tooltip>
		            Tipo: {servico.tipo}<br>
		            Categoria: {servico.subCategoria}<br>
		            Aberto em: {getDateFromISO(servico.createdAt)}
		            {#if servico.assumido_em}
		            Assumido em {getDateFromISO(servico.assumido_em)}<br>
		            {/if}
		            Prazo estimado: {getDateFromISO(servico.prazo)}<br>
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