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
    let status = 'pendente'
    let tipo = 'Infraestrutura'
    $: $filial, get_servicos().then((data)=>servicos=data.reverse())

    $: servicos, status, tipo, filtraChamados()

    function filtraChamados() {
        if (status === 'atendimento')
            if (tipo)    
            return servicos_filtrados = servicos.filter(servico=>servico.status === 'pendente' && servico.tipo === tipo && servico.atendimento === 'true')
            else return servicos_filtrados = servicos.filter(servico=>servico.status === 'pendente' && servico.atendimento === 'true')
        if (status && tipo)
        return servicos_filtrados = servicos.filter(servico=>servico.status === status && servico.tipo === tipo)
        if (status)
        return servicos_filtrados = servicos.filter(servico=>servico.status === status)
        if (tipo)
        return servicos_filtrados = servicos.filter(servico=>servico.tipo === tipo)
        return servicos_filtrados = servicos
    }

    function limpaFiltros() {
        status = undefined
        tipo = undefined
    }
</script>

<div>
    <Filtro 
        label='Tipo' 
        options={$tipos_os.map(tipo=>tipo.tipo)}
        bind:value={tipo}
    />
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
    />
    <button on:click={limpaFiltros}>Limpar filtros!</button>
</div>
<table>
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
    table {
        justify-content: space-around;
        width: 80%;
    }
    tr {
        text-align: center;
    }

    img {
        width: 1.5em;
        margin: 0.2em;
        color: green;
    }
</style>