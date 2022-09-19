<script>
import ListarProcessos from "$lib/components/ListarProcessos.svelte";
import { notifications } from "$lib/stores/cadastros";
import { processos } from "$lib/stores/notifications";
import { filterPendente } from "$lib/utils/utils";

</script>

<ListarProcessos custom_cadastros={$processos.filter(p=>filterPendente(p)&&notifications.isNotRead(p))} />