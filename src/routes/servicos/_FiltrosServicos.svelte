<script>
    import Filtro from '$lib/components/Filtro.svelte'
    import { tipos_os } from '$lib/stores/local_db.js'
    export let tipo
    export let status
    export let sort
    export let limpaFiltros
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
                {value: 'fechado', label: 'Fechado'}
            ]
        }
        bind:value={status}
    />
    <button title='Limpar status' on:click={()=>status=undefined}>X</button>
    <Filtro
        label='Ordenar por'
        options={
            [
                {value: function porAssunto(a, b){return a.assunto > b.assunto}, label: 'assunto'},
                {value: function porPrazo(a, b){return a.prazo > b.prazo}, label: 'prazo'},
                {value: function porTempo(a, b){return a.prazo > b.prazo}, label: 'tempo restante'},
                {value: function porAbertura(a, b){return a.createdAt > b.createdAt}, label: 'abertura'},
                {value: function porPrioridade(a, b){return a.prioridade > b.prioridade}, label: 'urgência'},
            ]
        }
        bind:value={sort}
    />
    <button title='Limpar filtro' on:click={()=>sort=(a, b)=>b.id-a.id}>X</button>
    <button on:click={limpaFiltros}>Limpar filtros!</button>
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