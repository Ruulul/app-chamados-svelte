<script>
    import { onDestroy } from 'svelte';
    import { filtros } from '$lib/stores/cadastros'
    import { getMany } from '$lib/utils/cadastros';
    import { filterPendente } from '$lib/utils/utils';
    import { getUser } from '$lib/utils/db';
    export let sort;
    let cadastros = [];

    let filtros_enum = createEnum(['abertos', 'fechados']);
    let filtro = filtros.abertos;

    $: getMany('processo', 'suporte_tecnico', $filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(oss=>cadastros=oss)

    let usuarios = {}
    
    let agora = Date.now()/1000
    let handlerAgora = setInterval(()=>{
        getMany('processo', 'suporte_tecnico', $filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(async oss=>{
            cadastros=oss
            Promise.all(cadastros.map(async ({idUsuario: id})=>!usuarios[id] ? usuarios[id] = (await getUser(id).catch(()=>({nome: 'Erro'}))).nome : undefined))
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
        {#each 
            cadastros
            .filter(processo=>
                filtro===filtros_enum.abertos
                    ? filterPendente(processo) 
                    : !filterPendente(processo)
            )
            .sort(sort) 
        as cadastro(cadastro.id)}
            {@const campos = Object.fromEntries(cadastro.etapa.campos)}
            {@const campos_processo = Object.fromEntries(cadastro.campos)}
        <a href={cadastro.etapa.Tag === 'abrir_os' ? `${cadastro.id}` : `../finaliza/${cadastro.id}`}>
            <tr>
                <td>
                    {campos_processo.filial}
                </td>
                <td>
                    {cadastro.id}
                </td>
                <td>
                    {usuarios[cadastro.idUsuario] || 'Carregando...'}
                </td>
                <td>
                    {campos.status 
                        ? campos.status 
                        : campos.finalizado==='true'
                            ? 'finalizado' 
                            : 'aguardando finalização'}
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