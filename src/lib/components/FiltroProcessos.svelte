<script context='module'>
    export const filter = writable({
        tipo: undefined,
        etapa: undefined,
        status: undefined,
        fn(processo) {
            let tipo_filter = !this.tipo ? true : processo.Tag === this.tipo;
            let etapa_filter = !this.etapa ? true : processo.etapa.Tag === this.etapa;
            let status_filter = !this.status ? true : Object.fromEntries(processo.etapa.campos).status === this.status;

            return tipo_filter && etapa_filter && status_filter;
        },
    })
</script>
<script>
    import { user_names } from "$lib/stores/user";
    import { writable } from "svelte/store";
    let tipos = []
    let etapas = []
    let status = []
    export let processos
    
    $: processos.map(({idUsuario: id, Tag: tipo, etapa: {campos, Tag: tag_etapa}})=>{
        user_names.add(id)
        if(!tipos.includes(tipo))
            tipos[tipos.length] = tipo
        if(!etapas.includes(tag_etapa))
            etapas[etapas.length] = tag_etapa
        const campos_obj = Object.fromEntries(campos)
        if(!status.includes(campos_obj.status))
            status[status.length] = campos_obj.status
    })
</script>
<form>
    <label>
        Tipo
        <select bind:value={$filter.tipo}>
            <option value={undefined}>Escolha...</option>
            {#each tipos as tipo}
                <option>{tipo}</option>
            {/each}
        </select>
    </label>
    <label>
        Etapa
        <select bind:value={$filter.etapa}>
            <option value={undefined}>Escolha...</option>
            {#each etapas as etapa}
                <option>{etapa}</option>
            {/each}
        </select>
    </label>
    <label>
        Status
        <select bind:value={$filter.status}>
            <option value={undefined}>Escolha...</option>
            {#each status as stat}
                <option>{stat}</option>
            {/each}
        </select>
    </label>
</form>