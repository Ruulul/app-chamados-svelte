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

    $:hidden = !pendentes
</script>

<div class='outlined container'>
    <h2>
        Olá, <span>{$user.nome}</span>
    </h2>
    <h3>Meus tickets</h3>
    <div class='divider'/>
    <a class='action button' sveltekit:prefetch href='/abrir_os'>Abrir Chamado</a>
    <a class='action button' sveltekit:prefetch href='/servicos'>Ver Chamados<div class='counter' class:hidden style:--count={'"' + pendentes + '"'}/></a>
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
    .counter {
		position: absolute;
		width: 0;
		height: 0;
        right: 5%;
        top: -25%;
	}
    .counter::after {
        content: var(--count);
		position: absolute;
		font-size: small;
		background-color: darkred;
		color: white;
		transition: width 0.2s, height 0.2s, font-size 0.2s;
		width: 1.5em;
		height: 1.5em;
		border-radius: 2em;
		display: grid;
		place-content: center;
    }
	.counter.hidden::after {
		width: 0;
		height: 0;
		font-size: 0;
	}
</style>