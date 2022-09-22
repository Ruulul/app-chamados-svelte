<script>
    import { filter } from '$lib/components/FiltroProcessos.svelte';

    import { processos } from '$lib/stores/notifications'
    import { filterPendente, assignVencimento, filterVencidos } from "$lib/utils/utils";
    let pendentes = [];
    /**Tag da etapa filtrada*/
    export let Tag;
    /**
     * Título a ser apresentado no card
     */
    export let titulo;

    export let campos_dict = {
        status: [
            'em analise',
            'pendente',
            'em atendimento',
        ]
    }

    $: por_tag = $processos.filter(processo=>processo.etapa.Tag === Tag);
    $: pendentes = por_tag.filter(filterPendente)
    $: por_vencimento = pendentes.map(({etapa, createdAt})=>assignVencimento({...etapa, createdAt}))
    const hora = 1000 * 60 * 60 * 24
    const dia = hora * 24
    const semana = dia * 7
    $: vencidos = por_vencimento.filter(filterVencidos())
    $: vencem_hoje = por_vencimento.filter(p=>filterVencidos(dia)(p)&&!vencidos.includes(p))
    $: vencem_semana = por_vencimento.filter(p=>filterVencidos(semana)(p)&&!vencidos.includes(p)&&!vencem_hoje.includes(p))
</script>

<template lang=pug>
    .outlined.container
        h3
            a(href="/processos/{Tag}")
                | {titulo}
                |
                i.fas.fa-eye
        h2
            i.fas.fa-headset
            |
            | Meus tickets
        .divider
        a.action.button(sveltekit:prefetch href="/processos/{Tag}/novo") Abrir Chamado
        +each('Object.entries(campos_dict) as [key, values]')
            ul
                li.no-link
                    span Por {key}
                +each('values as value')
                    li
                        a(href='/processos/{Tag}' on:click!="{()=>{$filter[key] = value}}")
                            | {pendentes.filter(p=>Object.fromEntries(p.etapa.campos)[key] === value).length} {value}
        | Total: {pendentes.length}
        .divider
        ul
            li 🟥 {vencidos.length} venceram
            li 🟨 {vencem_hoje.length} vencem hoje
            li 🟩 {vencem_semana.length} vencem essa semana
</template>

<style>
    .hidden {
        display: none;
    }
    .outlined.container {
        padding: 2em;
        padding-right: 1em;
        width: 12%;
        min-height: 30em;
        justify-content: end;
        gap: 1.5em;
    }
    h3 {
        font-size: larger;
        text-align: center;
    }
    h3, h2 {
        font-weight: lighter;
        margin-top: 0;
    }

    ul {
        list-style: none;
    }
    li {
        position: relative;
    }
    li span {
        display: block;
        padding: 1em;
    }
    a {
        position: relative;
    }
</style>
<!--
    
    li::before {
        content: '';
        position: absolute;
        left: -10%;
        bottom:35%;
        border-style: solid;
        border-color: black black transparent transparent;
        transform: rotate(45deg);
    }
-->