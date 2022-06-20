<script>
    export let nome = 'Suporte'
    export let atendendo = 0
    export let atendido_hoje = 0
    export let atendido_semana = 0
</script>

<div>
    <h3>{nome}</h3>
    <h4>Chamados</h4>
    <p>Em atendimento: {atendendo}</p>
    <p>Resolvidos hoje: {atendido_hoje}</p>
    <p>Outros resolvidos na semana: {atendido_semana}</p>
</div>

<style>
    div {
        display: flex;
        flex-flow: column;
        border: thin blue solid;
        width: fit-content;
        padding: 1em;
        float: left;
    }
</style>