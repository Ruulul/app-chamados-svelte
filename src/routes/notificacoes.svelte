<script>
import ListarProcessos from "$lib/components/ListarProcessos.svelte";
import { notifications } from "$lib/stores/cadastros";
import { processos } from "$lib/stores/notifications";
import { filterPendente } from "$lib/utils/utils";
import { onMount } from "svelte";

let clear_filters = ()=>{}

onMount(()=>clear_filters())
</script>

<ListarProcessos bind:clear_filters custom_cadastros={$processos.filter(p=>filterPendente(p)&&notifications.isNotRead(p))} />