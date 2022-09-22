<script>
    import { filtros } from '$lib/stores/cadastros'
    import { getMany } from '$lib/utils/cadastros';
    import { formatTag } from '$lib/utils/utils';
    import { user_names } from '$lib/stores/user';
    import Pagination from './Pagination.svelte';
    import FiltroProcessos, { filter } from './FiltroProcessos.svelte';
    import { onDestroy } from 'svelte';
    export let sort = (a, b)=>b.id-a.id;
    export let tag = undefined;
    export let custom_cadastros = undefined;
    let cadastros = [];
    export let clear_filters = ()=>{}

    const get = custom_cadastros ? ()=>cadastros=custom_cadastros : () => getMany('processo', tag, $filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(oss=>cadastros=oss)
    get()
    const handle = setInterval(get, 1000);
    onDestroy(function(){
        clearTimeout(handle)
    })
</script>
<template lang=pug>
    .filled.container
        .filter
            span Filtrar chamados
            FiltroProcessos(bind:clear!='{clear_filters}' processos!='{cadastros}')
        table
            caption Ordens de Serviço
            thead.underline
                th Filial
                +if('!tag') 
                    th Tipo
                th Ticket
                th De
                th Status
                th Assunto
                th Abertura
            tbody
                Pagination(
                    data!='{cadastros.filter(p=>$filter.fn(p)).sort(sort)}'
                    columns_count!='{!tag ? 7 : 6}')
                    a(slot='page' let:page href='/processos/{page.etapa.Tag}/{page.id}')
                        +const('cadastro=page')
                        +const('campos=Object.fromEntries(cadastro.etapa.campos)')
                        +const('campos_processo=Object.fromEntries(cadastro.campos)')
                        tr
                            td {campos_processo.filial || ''}
                            +if('!tag') 
                                td {formatTag(cadastro.Tag)}
                            td {cadastro.id}
                            td {$user_names[cadastro.idUsuario] || 'Carregando...'}
                            td {campos.status}
                            td {cadastro.log?.at(0)?.titulo.toUpperCase() || 'Carregando'}
                            td {cadastro.createdAt.split('T')[0].split('-').reverse().join('/')}
</template>
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
    .filter {
        padding: 0;
        width: 100%;
        margin: 1em;
    }
    .filter span {
        font-size: larger;
        font-weight: bold;
        margin: 1em;
    }
    .filled.container {
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