<script context='module'>
	export function load () {
		return {
			stuff: {
				title: 'Chamados'
			}
		}
	}
</script>
<script>
    import { servicos as servicos_store } from '$lib/stores/servicos';
    import Tabela from './_TabelaServicos.svelte'
    import Filtros from './_FiltrosServicos.svelte'


    $: servicos = $servicos_store
    let servicos_filtrados = []
    let status = 'pendente'
    let tipo = ''
    let sort = (a, b)=>b.id-a.id
    let filial = ''

    $: servicos, status, tipo, filtraChamados()

    function filtraChamados() {
        if (filial) 
            servicos_filtrados = servicos.filter(servico=>servico.filialId==filial)
        else
            servicos_filtrados = servicos 
        if (status === 'atendimento')
            if (tipo)    
            servicos_filtrados = servicos_filtrados.filter(servico=>servico.status === 'pendente' && servico.tipo === tipo && servico.atendimento === 'true')
            else servicos_filtrados = servicos_filtrados.filter(servico=>servico.status === 'pendente' && servico.atendimento === 'true')
        else if (status && tipo)
        servicos_filtrados = servicos_filtrados.filter(servico=>servico.status === status && servico.tipo === tipo)
        else if (status)
        servicos_filtrados = servicos_filtrados.filter(servico=>servico.status === status)
        else if (tipo)
        servicos_filtrados = servicos_filtrados.filter(servico=>servico.tipo === tipo)
        else servicos_filtrados = servicos
    }
</script>
<Tabela {sort} servicos={servicos_filtrados}>
    <Filtros bind:tipo bind:status bind:sort bind:filial />
</Tabela>