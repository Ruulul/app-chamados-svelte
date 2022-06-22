<script>
    export let nome = 'Carregando...'
    export let atendendo = '...'
    export let id
    export let atendido_hoje = '...'
    export let atendido_semana = '...'
    import ExibeArquivo from "./ExibeArquivo.svelte";

    const css_perfil = {
        width: '8em',
        height: '10em',
        display: 'block',
        margin: 'auto',
        border: 'thin crimson solid',
        'border-radius': '4em 4em 2em 2em',
        padding: '0.2em'
    }
</script>

<div>
    <ExibeArquivo filename={'ProfileIcon' + id} abrir={false} alt={'Foto de perfil de ' + nome} sem_arquivo='' style={css_perfil}/>
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