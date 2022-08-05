<script>
    import { onDestroy } from 'svelte';
    import { filtros } from '$lib/stores/cadastros';
    import { getMany, getDepts } from '$lib/utils/cadastros';
    export let sort;
    let cadastros = [], depts = [];

    $: getMany('processos', 'cadastro_produto',$filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(oss=>cadastros=oss)
    getDepts('cadastro_produto').then(datap=>depts=datap)

    let agora = Date.now()/1000
    let handlerAgora = setInterval(()=>{
        getMany('processos', 'cadastro_produto',$filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(oss=>cadastros=oss)
        agora=Date.now()/1000
    }, 1000)
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
            ID
        </th>
        <th>
            Status
        </th>
        <th>
            Departamento
        </th>
        <th>
            Assunto
        </th>
        <th>
            Abertura
        </th>
        <th class='filtro'/>
    </thead>
    <tbody>
        {#each cadastros.sort(sort) as cadastro(cadastro.id)}
            {@const campos = Object.fromEntries(cadastro.etapa.campos)}
        <a href={cadastro.etapa.Tag === 'cadastro_produto' ? `/cadastro/${cadastro.id}` : '#'}>
            <tr>
                <td>
                    {cadastro.campos.find(campo=>campo.campo==='filial').valor}
                </td>
                <td>
                    Sla
                </td>
                <td>
                    {cadastro.id}
                </td>
                <td>
                    {campos.status 
                        ? campos.status 
                        : campos.finalizado==='true'
                            ? 'finalizado' 
                            : 'aguardando finalização'}
                </td>
                <td>
                    {depts.find(dept=>dept.id===cadastro.etapa.dept)?.departamento}
                </td>
                <td>
                    {cadastro.log[0].titulo}
                </td>
                <td>
                    {cadastro.createdAt.split('T')[0].split('-').reverse().join('/')}
                </td>
            </tr>
        </a>
        {/each}
    </tbody>
</table>
</div>
<style>
    table {
        justify-content: center;
        text-align: center;
    }
    a {
        display: contents;
    }
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