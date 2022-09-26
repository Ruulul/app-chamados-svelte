<script>
    import { filtros } from '$lib/stores/cadastros'
    import { getMany } from '$lib/utils/cadastros';
    import { formatTag } from '$lib/utils/utils';
    import { user_names } from '$lib/stores/user';
    import Pagination from './Pagination.svelte';
    import PaginationBar from './PaginationBar.svelte';
    import FiltroProcessos, { filter } from './FiltroProcessos.svelte';
    import ExibeNome from './ExibeNome.svelte';
    import { onDestroy, onMount } from 'svelte';

    export let sort = (a, b)=>b.id-a.id;
    export let tag = undefined;
    export let custom_cadastros = undefined;
    export let clear_filters = ()=>{}

    let cadastros = [];
    const get = custom_cadastros ? ()=>cadastros=custom_cadastros : () => getMany('processo', tag, $filtros.chamados, {limit: $filtros.limit, page: $filtros.page}).then(oss=>cadastros=oss)
    get()

    $: data = cadastros.filter(p=>$filter.fn(p)).sort(sort)
    let page = 1

    const handle = setInterval(get, 5000);
    onDestroy(function(){
        clearTimeout(handle)
    })

    let container_height
    let filter_height
    let caption_height
    let head_height
    let row_height
    let pagination_height
    $: calc_height = (container_height - filter_height - caption_height - head_height - pagination_height)
    $: items_per_page = Math.floor(calc_height/row_height) - 5 || 1
</script>
<template lang=pug>
    .filled.container(bind:clientHeight!='{container_height}')
        .filter(bind:clientHeight!='{filter_height}')
            span Filtrar chamados
            FiltroProcessos(bind:clear!='{clear_filters}' processos!='{cadastros}')
        table
            caption(bind:clientHeight!='{caption_height}') Ordens de Serviço
            thead.underline(bind:clientHeight!='{head_height}')
                th Filial
                +if('!tag') 
                    th Tipo
                th Ticket
                th De
                th Status
                th Assunto
                th Abertura
            tbody
                Pagination('{data}' bind:page '{items_per_page}')
                    a(slot='page' let:page let:index href='/processos/{page.etapa.Tag}/{page.id}')
                        +const('cadastro=page')
                        +const('campos=Object.fromEntries(cadastro.etapa.campos)')
                        +const('campos_processo=Object.fromEntries(cadastro.campos)')
                        tr(bind:clientHeight!='{row_height}')
                            td {campos_processo.filial || ''}
                            +if('!tag')
                                td {formatTag(cadastro.Tag)}
                            td {cadastro.id}
                            ExibeNome(id!='{cadastro.idUsuario}')
                            td {campos.status}
                            td {cadastro.log?.at(0)?.titulo.toUpperCase() || 'Carregando'}
                            td {cadastro.createdAt.split('T')[0].split('-').reverse().join('/')}
        PaginationBar(n_items!='{data.length}' bind:page '{items_per_page}' bind:height!='{pagination_height}')
        | {data.length} items
</template>
<style>
    .filled.container {
        padding-top: 0;
        padding-right: 1em;
        padding-left: 1em;
        width: auto;
        height: 95%;
        justify-content: flex-start;
        gap: 1.2em;
    }
    .filter {
        padding: 0;
        width: 100%;
        margin: 1em;
    }
    .filter span {
        font-size: larger;
        font-weight: bold;
        margin-top: 0.2em;
    }
    a {
        display: contents;
    }
    th {
        padding-bottom: 1em;
    }
    caption {
        caption-side: bottom;
        text-align: left;
        padding: 1em;
    }
</style>