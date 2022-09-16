<script>
    import { processos } from '$lib/stores/notifications'
    import { filterPendente, assignVencimento, filterVencidos } from "$lib/utils/utils";
    let pendentes = 0;
    /**Tag da etapa filtrada*/
    export let Tag;
    /**
     * Título a ser apresentado no card
     */
    export let titulo;
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

<div class='outlined container'>
    <h3><a href='/processos/{Tag}'>{titulo} <i class='fas fa-eye'/></a></h3>
    <h2><i class='fas fa-headset'/> Meus tickets</h2>
    <div class='divider'/>
    <a class='action button' sveltekit:prefetch href='/processos/{Tag}/novo'>Abrir Chamado</a>
    <ul>
        <li>{pendentes.filter(p=>Object.fromEntries(p.etapa.campos).status==='em analise').length} em análise</li>
        <li>{pendentes.filter(p=>Object.fromEntries(p.etapa.campos).status==='pendente').length} pendentes</li>
        <li>{pendentes.filter(p=>Object.fromEntries(p.etapa.campos).status==='em atendimento').length} em atendimento</li>
    </ul>
    <div class='divider'/>
    <ul>
        <li>🟥 {vencidos.length} venceram</li>
        <li>🟨 {vencem_hoje.length} vencem hoje</li>
        <li>🟩 {vencem_semana.length} vencem essa semana</li>
    </ul>
    <!--ul>
        <li>Vencem essa semana</li>
    </ul-->
</div>

<style>
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