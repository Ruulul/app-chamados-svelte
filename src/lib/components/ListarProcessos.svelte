<script>
    import { onDestroy } from 'svelte';
    import { filtros } from '$lib/stores/cadastros'
    import { getMany } from '$lib/utils/cadastros';
    import { filterPendente, formatTag } from '$lib/utils/utils';
    import { user_names } from '$lib/stores/user';
import Pagination from './Pagination.svelte';
    export let sort = (a, b)=>b.id-a.id;
    export let tag = undefined;
    let cadastros = [];

    let filtros_enum = createEnum(['abertos', 'fechados']);
    let filtro = filtros.abertos;

    $: getMany('processo', tag, $filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(oss=>cadastros=oss)

    
    let agora = Date.now()/1000
    let handlerAgora = setInterval(()=>{
        getMany('processo', tag, $filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(async oss=>{
            cadastros=oss
            oss.forEach(({idUsuario:id})=>user_names.add(id))
        })
        agora=Date.now()/1000
    }, 1000)
    onDestroy(()=>clearInterval(handlerAgora))

    function createEnum(entries) {
        const enumObject = {};
        for (const entry of entries) enumObject[entry] = entry;
        return Object.freeze(enumObject);
    }
</script>
<div class='filled container'>
    <form>
        <label>
            Filtrar chamados:
            <br>
            <select bind:value={filtro}>
                <option value={filtros_enum.abertos}>Abertos</option>
                <option value={filtros_enum.fechados}>Fechados</option>
            </select>
        </label>
    </form>
<table>
    <caption>Ordens de Serviço</caption>
    <thead class='underline'>
        <th>
            Filial
        </th>
        {#if !tag}
        <th>
            Tipo
        </th>
        {/if}
        <th>
            Ticket
        </th>
        <th>
            De
        </th>
        <th>
            Status
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
        <Pagination 
        data={cadastros
            .filter(processo=>
                filtro===filtros_enum.abertos
                    ? filterPendente(processo) 
                    : !filterPendente(processo)
            )
            .sort(sort)}>
        <a slot='page' let:page href={`/processos/${page.etapa.Tag}/${page.id}`}>
            {@const cadastro = page}
            {@const campos = Object.fromEntries(cadastro.etapa.campos)}
            {@const campos_processo = Object.fromEntries(cadastro.campos)}
            <tr>
                <td>
                    {campos_processo.filial || ''}
                </td>
                {#if !tag}
                <td>
                    {formatTag(cadastro.Tag)}
                </td>
                {/if}
                <td>
                    {cadastro.id}
                </td>
                <td>
                    {$user_names[cadastro.idUsuario] || 'Carregando...'}
                </td>
                <td>
                    {campos.status 
                        ? campos.status 
                        : campos.finalizado==='true'
                            ? 'finalizado' 
                            : 'aguardando finalização'}
                </td>
                <td>
                    {cadastro.log[0].titulo.toUpperCase()}
                </td>
                <td>
                    {cadastro.createdAt.split('T')[0].split('-').reverse().join('/')}
                </td>
            </tr>
        </a>
        </Pagination>
    </tbody>
</table>
</div>
<style>
    form {
        padding-top: 1.5em;
        padding-left: 1em;
    }
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