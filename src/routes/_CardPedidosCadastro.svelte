<script>
    import { user } from "$lib/stores/user";
    import { getCadastrosCount as getCadastros } from '$lib/utils/cadastros'
    let pendentes, atendimento, parados;
    getCadastros([['status', 'pendente']]).then(count=>pendentes=count)
    getCadastros([['status', 'pendente'], ['atendimento', true]]).then((count)=>atendimento=count)
    getCadastros([['status', 'pendente'], ['atendimento', false]]).then((count)=>parados=count)

    $:hidden = !pendentes
</script>

<div class='outlined container'>
    <h3>Cadastros</h3>
    <div class='divider'/>
    <a class='action button' sveltekit:prefetch href='/solicitacao/cadastro'>Novo Chamado</a>
    <a class='action button' sveltekit:prefetch href='/cadastros'>Ver Chamados<div class='counter' class:hidden style:--count={'"' + pendentes + '"'}/></a>
    <ul>
        <li>{pendentes} pendentes</li>
        <li>{parados} parados</li>
        <li>{atendimento} em atendimento</li>
    </ul>
    <div class='divider'/>
    <!--ul>
        <li>Vencem essa semana</li>
    </ul-->
</div>

<style>
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