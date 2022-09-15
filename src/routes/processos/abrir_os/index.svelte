<script context='module'>
    export async function load() {
        return {
            stuff: {
                title: 'Suporte Técnico'
            }
        }
    }
</script>
<script>
    import ListarProcessos from "$lib/components/ListarProcessos.svelte";
</script>
<ListarProcessos tag='suporte_tecnico'/>