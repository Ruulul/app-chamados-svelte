<script>
    import { user } from "$lib/stores/user";
    export let novos
    export let parados
    export let atendimento
</script>

<div>
    <h2>
        Olá, <span>{$user.nome}</span>
    </h2>
    <div class='divider'></div>
	<h3>Meus tickets</h3>
    <a sveltekit:prefetch href='/abrir_os'>Abrir Chamado</a>
    <ul>
        <li>{novos} abertos hoje</li>
        <li>{parados} parados</li>
	    <li>{atendimento} em atendimento</li>
    </ul>
    <div class='divider'></div>
    <ul>
        <li>Venceram</li>
        <li>Vencem hoje</li>
        <li>Vencem essa semana</li>
    </ul>
</div>

<style>
    :not(span) {
        color: grey;
    }
    div {
        justify-content: center;
        width: 20%;
        height: 40%;
        padding: 2em;
		padding-top: 0;
        border: thin blue solid;
        color: grey;
    }
    .divider {
        width: 100%;
        height: 0.3em;
        padding: 0;
        border: none;
        background-color: grey;
    }
    ul {
        list-style: none;
    }
    li {
        padding: 0;
    }
    a {
        background-color: var(--dark);
        border-radius: 2em;
        padding: 0.5em;
        color: white;
        text-decoration: none;
    }
</style>