<script>
    import { filial, get_user } from '$lib/utils/db.js'
    import { get_servicos } from '$lib/utils/servicos.js'
    import { tipos_os } from '$lib/stores/local_db.js'
    import Filtro from '$lib/components/Filtro.svelte'
    import { onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate'


    let servicos = []
    let servicos_filtrados = []
    let contagem = 0, contagem_total = 0
    let status = 'pendente'
    let tipo = ''
    let tooltipX, tooltipY;
    $: $filial, get_servicos().then((data)=>servicos=data.reverse())
    let agora = Date.now()/1000
    let handlerAgora = setInterval(()=>agora=Date.now()/1000, 1000)

    $: servicos, status, tipo, filtraChamados()

    function filtraChamados() {
        if (status === 'atendimento')
            if (tipo)    
            servicos_filtrados = servicos.filter(servico=>servico.status === 'pendente' && servico.tipo === tipo && servico.atendimento === 'true')
            else servicos_filtrados = servicos.filter(servico=>servico.status === 'pendente' && servico.atendimento === 'true')
        else if (status && tipo)
        servicos_filtrados = servicos.filter(servico=>servico.status === status && servico.tipo === tipo)
        else if (status)
        servicos_filtrados = servicos.filter(servico=>servico.status === status)
        else if (tipo)
        servicos_filtrados = servicos.filter(servico=>servico.tipo === tipo)
        else servicos_filtrados = servicos
        contagem = servicos_filtrados.length
        contagem_total = servicos.length
    }

    function limpaFiltros () {
        status = undefined
        tipo = undefined
    }

    onDestroy(()=>clearInterval(handlerAgora))

    function updateTooltipPosition (mouseEvent) {
        [tooltipX, tooltipY] = [mouseEvent.clientX+10+'px', mouseEvent.clientY+10+'px']
    }

    function getDateFromISO (ISODate) {
        return ISODate.split('T')[0].split('-').reverse().join('/')
    }
</script>
<svelte:head>
    <title>
        Chamados
    </title>
</svelte:head>
<aside class='filtros'>
    <Filtro 
        label='Tipo' 
        options={$tipos_os?.map(({tipo})=>tipo) || []}
        bind:value={tipo}
    /><button title='Limpar tipo' on:click={()=>tipo=undefined}>X</button>
    <Filtro 
        label='Status' 
        options={
            [
                {value: 'pendente', label: 'Pendente'}, 
                {value: 'atendimento', label: 'Em Atendimento'},
                {value: 'fechado', label: 'Fechado'}
            ]
        }
        bind:value={status}
    /><button title='Limpar status' on:click={()=>status=undefined}>X</button>
    <button on:click={limpaFiltros}>Limpar filtros!</button>
    <p>{contagem} serviço{contagem.length === 1 ? '' : 's'} listados no momento;</p>
    <p>{contagem_total} serviço{contagem_total.length === 1 ? '' : 's'} no total.</p>
</aside>
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
    </thead>
    <tbody>
        {#each servicos_filtrados as servico(servico.id)}
            {@const prazoDateObj = new Date(servico.prazo)}
            {@const diffTime = Math.floor(prazoDateObj.getTime()/1000 - agora)}
            {@const expired = diffTime < 0}
            <tr 
                transition:fly={{y: 100}} 
                animate:flip
                class:expired 
                on:mousemove={updateTooltipPosition} 
                style="--tooltip-x:{tooltipX};--tooltip-y: {tooltipY}">
                <td>
                    {servico.id}
                </td>
                <td>
                    <a sveltekit:prefetch href="/servico/{servico.id}">{servico.assunto}</a>
                </td>
                <td>
                    {servico.status}
                </td>
                <div class='anchor'>
                    <div class='tooltip'>
                        Tipo: {servico.tipo}<br>
                        Categoria: {servico.subCategoria}<br>
                        Aberto em: {getDateFromISO(servico.createdAt)}
                        {#if servico.assumido_em}
                        Assumido em {getDateFromISO(servico.assumido_em)}<br>
                        {/if}
                        Prazo estimado: {getDateFromISO(servico.prazo)}<br>
                        Tempo {expired ? 'passado' : 'restante'} : <br>{Math.floor(diffTime/86400)} dias <br> {Math.floor(diffTime/3600) % 24}h {Math.floor(diffTime/60)%60}min {diffTime%60}s<br>
                        {#if servico.atendenteId}
                        {#await get_user(servico.atendenteId) then {nome}}
                        Assistente: {nome}<br>
                        {/await}
                        {/if}
                    </div>
                </div>
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
    .anchor {
        position: fixed;
        width: 0;
        height: 0;
        left: var(--tooltip-x, 50%);
        top: var(--tooltip-y, 50%);
    }
    .tooltip {
        position: absolute;
        z-index: 999;
        background-color: aqua;
        color: black;
        padding: 0.5em;
        width: 10em;
        font-size: small;
        transition: opacity 0.2s;
        opacity: 0;
    }
    tr:hover .anchor .tooltip {
        opacity: 1;
    }
    aside {
        float: left;
    }
    .filtros {
        display: flex;
        flex-flow: column;
        width: 7vw;
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