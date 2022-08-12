<script>
    import { user } from "$lib/stores/user";
    import Fa from 'svelte-fa'
    import { faEye as faEye } from '@fortawesome/free-solid-svg-icons'
    import { processos } from '$lib/stores/notifications'
    let pendentes = 0;
    export let Tag;
    export let titulo;
    $: pendentes = $processos.filter(processo=>processo.Tag===Tag).length

    $:hidden = !pendentes
</script>

<div class='outlined container'>
    <h3>{titulo} <a href='/processos/{Tag}'><Fa icon={faEye}/></a></h3>
    <div class='divider'/>
    {pendentes} pendentes
    <div class='divider'/>
    <a class='action button' sveltekit:prefetch href='/processos/{Tag}/novo'>Iniciar</a>
    <!--ul>
        <li>Vencem essa semana</li>
    </ul-->
</div>

<style>
    .outlined.container {
        flex-shrink: 0;
        height: fit-content;
        gap: 0.5em;
        padding: 2em;
        width: 10%;
    }
    h3 {
        font-weight: lighter;
        margin-top: 0;
    }
    ul {
        list-style: none;
    }
    li {
        position: relative;
    }
    li::before {
        content: '';
        position: absolute;
        left: -10%;
        bottom:35%;
        border-style: solid;
        border-color: black black transparent transparent;
        transform: rotate(45deg);
    }
    a {
        position: relative;
    }
</style>