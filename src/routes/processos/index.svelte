<script context='module'>
    export async function load() {
        return {
            stuff: {
                title: 'Processos'
            }
        }
    }
</script>
<script>
    import ListarProcessos from "$lib/components/ListarProcessos.svelte";
</script>
<ListarProcessos/>