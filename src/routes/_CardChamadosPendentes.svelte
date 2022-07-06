<script>
    import { user } from "$lib/stores/user";
	import { servicos as servicos_store } from '$lib/stores/servicos';
    import { converteDateToISO } from "$lib/utils/utils";
    $: servicos = $servicos_store.filter(({status})=>status=='pendente')
	$: pendentes = servicos.length
	$: novos = servicos.filter(({createdAt})=>createdAt.split('T')[0]===converteDateToISO(Date())).length
	$: atendimento = servicos.filter(({atendimento})=>atendimento==='true').length
	$: parados = pendentes - atendimento
    $: vencidos = servicos.filter(({prazo})=>prazo.split('T')[0]<converteDateToISO(Date())).length
    $: hoje = servicos.filter(({prazo})=>prazo.split('T')[0]==converteDateToISO(Date())).length
</script>

<div class='outlined container'>
    <h2>
        Olá, <span>{$user.nome}</span>
    </h2>
    <h3>Meus tickets</h3>
    <div class='divider'/>
    <a class='action button' sveltekit:prefetch href='/abrir_os'>Abrir Chamado</a>
    <ul>
        <li>{novos} abertos hoje</li>
        <li>{parados} parados</li>
        <li>{atendimento} em atendimento</li>
    </ul>
    <div class='divider'/>
    <ul>
        <li>{vencidos} venceram</li>
        <li>{hoje} vencem hoje</li>
        <li>Vencem essa semana</li>
    </ul>
</div>

<style>
    span {
        color: var(--dark);
    }
    h2, h3 {
        font-weight: lighter;
    }
    h3 {
        margin-top: 0;
    }
    ul {
        list-style: none;
    }
    ul::before {
        width: 1em;
        height: 1em;
        background-color: var(--dark);
    }
</style>