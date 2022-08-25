<script>
    import { user } from "$lib/stores/user";
    import Fa from 'svelte-fa'
    import { faEye as faEye, faHeadset } from '@fortawesome/free-solid-svg-icons'
    import { processos } from '$lib/stores/notifications'
    let pendentes = 0;
    export let Tag;
    export let titulo;
    $: pendentes = $processos.filter(processo=>processo.Tag===Tag).length

    $:hidden = !pendentes
</script>

<div class='outlined container'>
    <h3>{titulo} <a href='/processos/{Tag}'><Fa icon={faEye}/></a></h3>
    <h2><Fa icon={faHeadset}/> Meus tickets</h2>
    <div class='divider'/>
    <a class='action button' sveltekit:prefetch href='/processos/{Tag}/novo'>Abrir Chamado</a>
    <ul>
        <li>{pendentes} pendentes</li>
        <li>0 parados</li>
        <li>0 em atendimento</li>
    </ul>
    <div class='divider'/>
    <ul>
        <li>🟥 venceram</li>
        <li>🟨 vencem hoje</li>
        <li>🟩 vencem essa semana</li>
    </ul>
    <!--ul>
        <li>Vencem essa semana</li>
    </ul-->
</div>

<style>
    .outlined.container {
        padding: 2em;
        width: 12%;
        height: 30em;
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