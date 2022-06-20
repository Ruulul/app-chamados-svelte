<svelte:head>
    <title>
        Chamados
    </title>
</svelte:head>
<script>
    import { get_servicos, filial } from '$lib/utils/db.js'
    import { tipos_os } from '$lib/stores/local_db.js'
    import Filtro from '$lib/components/Filtro.svelte'


    let servicos = []
    let servicos_filtrados = []
    let contagem = 0, contagem_total = 0
    let status = 'pendente'
    let tipo = 'Infraestrutura'
    $: $filial, get_servicos().then((data)=>servicos=data.reverse())

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

    function limpaFiltros() {
        status = undefined
        tipo = undefined
    }
</script>

<div class='filtros'>
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
</div>
<table>
    <caption>Ordens de Serviço</caption>
    <thead>
        <th>
            Abrir
        </th>
        <th>
            Assunto
        </th>
        <th>
            Status
        </th>
    </thead>
    <tbody>
        {#each servicos_filtrados as servico}
            <tr>
                <td>
                    <a href="/servico/{servico.id}"><img alt='' src='/abrir-chamado.svg'/></a>
                </td>
                <td>
                    {servico.assunto}
                </td>
                <td>
                    {servico.status}
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    div {
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
    tr {
        text-align: center;
    }
    caption {
        caption-side: bottom;
        text-align: left;
        padding: 1em;
    }

    img {
        width: 1.5em;
        margin: 0.2em;
        color: green;
    }
</style>