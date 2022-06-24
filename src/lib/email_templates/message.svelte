<script>
    import { parseMD } from "$lib/utils/utils";
    export let nome
    export let nomeAutor
    export let mensagem = ''
    export let idOS
</script>
<h1>
    Olá {nome} <br> Nova mensagem no chamado {idOS}
</h1>
    <p>
        De: {nomeAutor}
    </p>
    {@html parseMD(mensagem)}