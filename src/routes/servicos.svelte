<svelte:head>
    <title>
        Chamados
    </title>
</svelte:head>
<script>
    import { get_servicos } from '$lib/utils/db.js'

    let servicos = []
    get_servicos().then((data)=>servicos=data.reverse())

    $: servicos_pendentes = servicos.filter(servico=>servico.status==='pendente')
</script>

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
        {#each servicos_pendentes as servico}
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
    }
</style>