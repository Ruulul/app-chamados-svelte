<script>
    export let pendentes 
    export let novos
    export let parados
    export let atendimento
</script>

<div>
	<h2>Chamados</h2>
    <ul>
	<li><h3>Pendentes: {pendentes}</h3></li>
        <li>
            <div class='hook'>
                <p class="novos">Novos: {novos}</p>
            </div>
        </li>
    <li>Parados: {parados}</li>
	<li>Em atendimento: {atendimento}</li>
</ul>
</div>

<style>
    div {
        width: 20%;
        height: 40%;
        padding: 2em;
		padding-top: 0;
        border: thin blue solid;
    }
    ul {
        list-style: none;
        margin-left: -2.5em;
    }
    p {
        margin: 0
    }
    li {
        padding: 0;
    }
    .hook {
        position: relative;
        width: 0;
        height: 0;
        padding: 0;
        margin: 0;
        border: none;
    }
    .novos {
        position: absolute;
        display: flex;
        left: 10em;
        top: -3em;
        padding: 1em;
        border: orange solid;
        border-radius: 1em;
    }
</style>