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
    import { onMount } from "svelte";
    
    let clear_filters = ()=>{}

    onMount(()=>clear_filters())
</script>
<ListarProcessos bind:clear_filters/>