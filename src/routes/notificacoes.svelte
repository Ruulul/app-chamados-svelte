<script>
import ListarProcessos from "$lib/components/ListarProcessos.svelte";
import { notifications } from "$lib/stores/cadastros";
import { processos } from "$lib/stores/notifications";

</script>

<ListarProcessos custom_cadastros={$processos.filter(notifications.isRead)} />