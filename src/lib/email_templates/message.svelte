<script>
    export let nome = 'Dummy'
    export let nomeAutor
    export let mensagem
    export let idOS
    import { parseMD } from "$lib/utils/utils";
</script>
<h1>
    Olá {nome} <br> Nova mensagem no chamado {idOS}
</h1>
    <p>
        De: {nomeAutor}
    </p>
    {@html parseMD(mensagem)}