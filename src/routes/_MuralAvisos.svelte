<script>
    import FiltroProcessos, { filter } from "$lib/components/FiltroProcessos.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import { notifications } from "$lib/stores/cadastros";
    import { processos } from "$lib/stores/notifications";
    import { user_names } from "$lib/stores/user";
    import { filterPendente, formatTag } from "$lib/utils/utils";
    import { onMount } from "svelte";

    let loading = {}

    let clear = ()=>{}

    onMount(()=>clear())
</script>
<template lang=pug>
    .filled.container
        .title
            h2
                i.fas.fa-thumbtack
                | 
                | Mural de avisos
                FiltroProcessos(bind:clear processos!='{$processos.filter(filterPendente)}')
        .divider
        table
            thead
                th Notificação
                th Tipo
                th Etapa
                th Status
                th De
                th Marcar como lido
            tbody
                Pagination(
                    items_per_page=5
                    data!='{$processos.sort((a, b)=>b.id-a.id).filter(p=>filterPendente(p)&&$filter.fn(p)&&notifications.isNotRead(p))}'
                    columns_count=6)
                    tr(slot='page' let:page)
                        +const('{id, idUsuario, log} = page')
                        +const('process_tag = page.Tag')
                        +const('{Tag, campos} = page.etapa')
                        +const('etapa_campos = Object.fromEntries(campos)')
                        a(href='/processos/{Tag}/{id}')
                            td {id} - {log[0]?.titulo.toUpperCase()}
                            td {formatTag(process_tag)}
                            td {formatTag(Tag)}
                            td {etapa_campos.status}
                            td {$user_names[idUsuario] || 'Carregando...'}
                            td: i(
                                class!=`{'mark-as-read fas ' 
                                        +(loading[page.id] || false 
                                            ? 'fa-spinner fa-spin'  
                                            : 'fa-circle-dot')}
                                    on:click!='{()=>(loading[page.id]=true, 
                                    notifications.markAsRead(page.id, 
                                        page.log.sort((a, b)=>b.id - a.id).at(-1).id))}`)
</template>
<style>
    .mark-as-read {
        cursor: pointer;
    }
    .divider {
        margin-bottom: 1em;
        width: 100%;
        height: 0.3em;
    }
    .title {
        flex-flow: row;
        width: 100%;
    }
    a {
        display: contents;
    }
    * {
        font-weight: lighter;
    }
    .filled.container {
        flex: 0.9;
    }
    tr :not(:first-child) {
        padding-top: 1em;
        text-align: center;
    }
    h2 {
        width: 100%;
    }
</style>