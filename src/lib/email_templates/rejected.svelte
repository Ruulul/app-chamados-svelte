<script>
    import { parseMD } from "$lib/utils/utils";
    export let last_msg = ''
    export let idOS
</script>
<h1>
    O chamado de id {idOS} foi rejeitado.
</h1>

{@html parseMD(last_msg)}