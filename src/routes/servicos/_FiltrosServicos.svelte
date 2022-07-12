<script>
    import Filtro from '$lib/components/Filtro.svelte'
    import { tipos_os } from '$lib/stores/local_db.js'
    export let tipo
    export let status
    export let sort
    let activeSort = ''
    let visible = false;
    let heights = Array(5)
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

    function limpaOrdena () {
        sort=(a, b)=>b.id-a.id
    }

    function limpa (limpa) {
        return function () {
            limpa()
            changeActive('none')
        }
    }
</script>
<aside class='filtros'>
    <input bind:checked={visible} type='checkbox' id='menu-filtros-servicos'>
    <label on:input={()=>visible=!visible} class='action button' for='menu-filtros-servicos'>
        Painel de controle
    </label>
    <span class='underline tooltip'>
        <Filtro 
            label=''
            options={
                [
                    {value: 'pendente', label: 'Pendente'}, 
                    {value: 'atendimento', label: 'Em Atendimento'},
                    {value: 'resolvido', label: 'Resolvido'},
                    {value: 'fechado', label: 'Fechado'}
                ]
            }
            bind:value={status}
        />
        <span class='tooltip-text'>Status</span>
        <button title='Limpar status' on:click={()=>status=''}>X</button>
    </span>
    <span class='underline tooltip'>
        <Filtro 
            label='' 
            options={$tipos_os?.map(({tipo})=>tipo) || []}
            bind:value={tipo}
        />
        <span class='tooltip-text'>Tipo</span>
        <button title='Limpar tipo' on:click={()=>tipo=''}>X</button>
    </span>
    <span class='underline tooltip'>
        <Filtro
            label=''
            options={
                [
                    {value: function porAssunto(a, b){
                        changeActive('assunto')
                        if (a.assunto == b.assunto)
                            return 0
                        return a.assunto > b.assunto
                    }, label: 'assunto'},
                    {value: function porPrazo(a, b){
                        changeActive('prazo')
                        return a.prazo > b.prazo
                    }, label: 'prazo'
                    },
                    {value: function porTempo(a, b){
                        changeActive('tempo')
                        return a.prazo > b.prazo}, label: 'tempo restante'
                    },
                    {value: function porAbertura(a, b){
                        changeActive('abertura')
                        return a.createdAt > b.createdAt}, label: 'abertura'
                    },
                    {value: function porPrioridade(a, b){
                        changeActive('prioridade')
                        if (a.prioridade == b.prioridade)
                            return 0
                        return a.prioridade < b.prioridade
                    }, label: 'urgência'},
                ]
            }
            bind:value={sort}
        />
        <span class='tooltip-text'>Ordenar por</span>
        <button title='Limpar filtro' on:click={limpa(limpaOrdena)}>X</button>
    </span>
    <span class='underline'>
        <button on:click={limpa(limpaFiltros)}>Limpar filtros!</button><br>
    </span>
    <slot/>
</aside>

<style>
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
    .tooltip .tooltip-text {
        position: absolute;
        z-index: -5;
        opacity: 0;
        background-color: var(--grey);
        border-radius: 1em;
        border: thin var(--dark) solid;
        margin: auto;
        transition: all 0.2s ease 0.2s;
        padding-top: 0.5rem;
        top: 100%;
        right: -25%;
    }
    .tooltip:hover .tooltip-text {
        display: flex;
        z-index: 5;
        opacity: 1;
    }
    aside {
        border-radius: 50%;
        position: relative;
        display: flex;
    }
    input[type='checkbox'] {
        display: none;
        height: 100%;
        width: 100%;
        display: pointer;
    }
    label {
        width: 10em;
        cursor: pointer;
        float: left;
        display: flex;
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

</style>