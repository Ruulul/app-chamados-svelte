<script context='module'>
    export async function load() {
        return {
            stuff: {
                title: 'Cadastro de Produto'
            }
        }
    }
</script>
<script>
    import ListarProcessos from "$lib/components/ListarProcessos.svelte";
</script>
<ListarProcessos tag='cadastro_produto'/>