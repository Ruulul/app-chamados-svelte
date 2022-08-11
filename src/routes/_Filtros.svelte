<script>
    import Filtro from '$lib/components/Filtro.svelte'
    import { tipos_os } from '$lib/stores/local_db.js'
    import { filiais_validas_por_id } from '$lib/utils/filial';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import { filtros, servicos, pages } from '$lib/stores/servicos';
    import { setFilial } from '$lib/utils/filial'
    let tipo
    let status
    let filial = ''
    let hide = true;
    $: if (status || tipo || filial) {
        let filtro = [];
        if (status) filtro.push(['status', status == 'atendimento' ? 'pendente' : status])
        if (status == 'atendimento') filtro.push(['atendimento', true])
        if (tipo) filtro.push(['tipo', tipo])
        if (filial) {
            filtro.push(['filialId', filial])
            setFilial(filial)
        }
        console.log(filtro)
        $filtros.chamados = filtro
        servicos.update()
    } else {
        $filtros.chamados = []
        servicos.update()
    }
    let activeSort = ''
    let visible = false;
    $: console.log(visible)

    const style = document.documentElement.style

    function changeActive (name) {
        activeSort = style.getPropertyValue('--active').slice(1,-1)
        style.setProperty('--active-'+activeSort, 'none')
        style.setProperty('--active-'+name, 'block')
        style.setProperty('--active', "'"+name+"'")
    }

    function limpaFiltros () {
        tipo = ''
        status = ''
    }

    function limpa (limpa) {
        return function () {
            limpa()
            changeActive('none')
        }
    }
</script>
<aside class='filtros'>
    <button class='action button' on:click={()=>hide=!hide}>
        Filtros 
    </button>
    <span class:hide class=page-selection>
        <label>
            Página
            <input type=number bind:value={$filtros.page}> {$pages}
        </label>
    </span>
    <div class:hide>
        <span class='underline tooltip'>
            <Filtro 
                label=''
                placeholder='todos'
                options={
                    [
                        {value: 'pendente', label: 'Pendente'}, 
                        {value: 'atendimento', label: 'Em Atendimento'},
                        {value: 'resolvido', label: 'Resolvido'},
                        {value: 'fechado', label: 'Fechado'},
                    ]
                }
                bind:value={status}
            />
            <Tooltip>Status</Tooltip>
            <button title='Limpar status' on:click={()=>status=''}>X</button>
        </span>
        <span class='underline tooltip'>
            <Filtro 
                label='' 
                options={$tipos_os?.map(({tipo})=>tipo) || []}
                bind:value={tipo}
            />
            <Tooltip>Tipo</Tooltip>
            <button title='Limpar tipo' on:click={()=>tipo=''}>X</button>
        </span>
        <span class='underline tooltip'>
            <Filtro
                label=''
                options={
                    Object.entries($filiais_validas_por_id).map(([value, label])=>({value, label}))
                }
                bind:value={filial}
            />
            <Tooltip>Filial</Tooltip>
            <button title='Limpar filtro' on:click={()=>filial=''}>X</button>
        </span>
            <button class='limpar-geral' on:click={limpa(limpaFiltros)}>Limpar filtros!</button><br>
        <slot/>
    </div>
</aside>

<style>
    .page-selection {
        padding-bottom: 30%;
    }
    .filtros div {
        gap: 1em;
        transition: all 0.5s;
    }
    .filtros div {
        width: 15em;
        height: 15em;
    }
    * {
        font-size: 1em;
        height: fit-content;
    }
    .filtros .hide {
        font-size: 0;
        width: 0;
        height: 0;
        overflow: hidden;
    }

    .filtros > * {
        margin-left: 0;
    }
    .tooltip {
        position: relative;    
        border: 1px solid var(--select-border);
        border-radius: 0.25em;
        padding: 0.25em 0.5em;
        font-size: 1.25rem;
        background-color: #f7f7f7;
    }
    .tooltip :global(select) {
        appearance: none;
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 0 1em 0 0;
    }
    .tooltip :global(button) {
        appearance: none;
        border: none;
        padding: 0 1em;
    }
    .tooltip:hover :global(.anchor .tooltip) {
        display: flex;
        z-index: 5;
        opacity: 1;
        width: fit-content;
    }
    aside {
        border-radius: 50%;
        position: relative;
        display: flex;
    }
    .action.button {
        width: 10em;
        margin-left: 0;
    }
    span {
        display: flex;
        width: fit-content;
        padding-right: 1em;
        padding-left: 1em;
        padding-bottom: 0.5em;
        margin-left: 1em;
        place-self: flex-end;
    }
    span::after {
        border-width: thin;
    }
    button:not(.action.button) {
        background-color: transparent;
    }
    button.limpar-geral {
        background-color: unset;
    }
</style>