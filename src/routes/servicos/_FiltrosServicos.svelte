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
    <span class='underline'>
        {[tipo, status, activeSort].filter(Boolean)}
    </span>
    <ul class:visible class='action button'>
            <li 
                bind:offsetHeight={heights[0]}
                style:--height={heights.slice(0, 0).reduce((pv, cv)=>pv+cv, 0)}>
                <Filtro 
                    label='Tipo' 
                    options={$tipos_os?.map(({tipo})=>tipo) || []}
                    bind:value={tipo}
                /><button title='Limpar tipo' on:click={()=>tipo=''}>X</button>
            </li>
            <li
            bind:offsetHeight={heights[1]}
            style:--height={heights.slice(0, 1).reduce((pv, cv)=>pv+cv, 0)}>
                <Filtro 
                    label='Status' 
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
                <button title='Limpar status' on:click={()=>status=''}>X</button>
            </li>
            <li
            bind:offsetHeight={heights[2]}
            style:--height={heights.slice(0, 2).reduce((pv, cv)=>pv+cv, 0)}>
                <Filtro
                    label='Ordenar por'
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
                                return a.prioridade > b.prioridade
                            }, label: 'urgência'},
                        ]
                    }
                    bind:value={sort}
                />
                <button title='Limpar filtro' on:click={limpa(limpaOrdena)}>X</button>
            </li>
            <li
            bind:offsetHeight={heights[3]}
            style:--height={heights.slice(0, 3).reduce((pv, cv)=>pv+cv, 0)}>
            </li>
            <li
            bind:offsetHeight={heights[4]}
            style:--height={heights.slice(0, 4).reduce((pv, cv)=>pv+cv, 0)}>
                <button on:click={limpa(limpaFiltros)}>Limpar filtros!</button><br>
            </li>
    </ul>
    <slot/>
</aside>

<style>
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
    ul {
        display: flex;
        position: absolute;
        overflow: hidden;
        color: var(--text-color);
        top: 3em;
        left: 2em;
        width: 0;
        height: 0;
        border-radius: 2em;
        flex-direction: column;
        list-style: none;
        margin: 0;
        padding: 0;
        z-index: 1;
        transition: width 1s, height 1s, padding 1s;
    }
    ul.visible {
        width: 10em;
        height: 15em;
        padding: 2em;
    }
    ul > li {
        margin: 0;
        opacity: 0;
        position: absolute;
        transition: opacity 1s, top 1s;
        top: 0;
    }
    ul.visible > li {
        overflow: visible;
        top: calc(var(--height) * 1px + 1em);
        opacity: 1;
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