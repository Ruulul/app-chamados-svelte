<script>
    import Filtro from '$lib/components/Filtro.svelte'
    import { tipos_os } from '$lib/stores/local_db.js'
    export let tipo
    export let status
    export let sort

    const style = document.documentElement.style

    function changeActive (name) {
        let active = style.getPropertyValue('--active')
        style.setProperty('--active-'+active.slice(1,-1), 'none')
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
    <Filtro 
        label='Tipo' 
        options={$tipos_os?.map(({tipo})=>tipo) || []}
        bind:value={tipo}
    /><button title='Limpar tipo' on:click={()=>tipo=undefined}>X</button>
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
    <button title='Limpar status' on:click={()=>status=undefined}>X</button>
    <br><button on:click={limpa(limpaFiltros)}>Limpar filtros!</button><br>
    <Filtro
        label='Ordenar por'
        options={
            [
                {value: function porAssunto(a, b){
                    changeActive('assunto')
                    return a.assunto > b.assunto
                }, label: 'assunto'},
                {value: function porPrazo(a, b){
                    changeActive('prazo')
                    return a.prazo > b.prazo}, label: 'prazo'
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
                    return a.prioridade > b.prioridade
                }, label: 'urgência'},
            ]
        }
        bind:value={sort}
    />
    <button title='Limpar filtro' on:click={limpa(limpaOrdena)}>X</button>
    <slot/>
</aside>

<style>
    aside {
        float: left;
        display: flex;
        flex-flow: column;
        width: 7vw;
    }
</style>