<script>
    import { parseMD } from "$lib/utils/utils";
    export let last_msg = ''
    export let idOS
</script>
<h1>
    O chamado de id {idOS} acaba de ser fechado.
</h1>

{@html parseMD(last_msg)}