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
    let contagem = 0, contagem_total = 0
    let status = 'pendente'
    let tipo = ''
    let sort = (a, b)=>b.id-a.id

    $: servicos, status, tipo, filtraChamados()

    function filtraChamados() {
        if (status === 'atendimento')
            if (tipo)    
            servicos_filtrados = servicos.filter(servico=>servico.status === 'pendente' && servico.tipo === tipo && servico.atendimento === 'true')
            else servicos_filtrados = servicos.filter(servico=>servico.status === 'pendente' && servico.atendimento === 'true')
        else if (status && tipo)
        servicos_filtrados = servicos.filter(servico=>servico.status === status && servico.tipo === tipo)
        else if (status)
        servicos_filtrados = servicos.filter(servico=>servico.status === status)
        else if (tipo)
        servicos_filtrados = servicos.filter(servico=>servico.tipo === tipo)
        else servicos_filtrados = servicos
        contagem = servicos_filtrados.length
        contagem_total = servicos.length
    }
</script>
<Filtros bind:tipo bind:status bind:sort>
    <p>{contagem} serviço{contagem.length === 1 ? '' : 's'} listados no momento;</p>
    <p>{contagem_total} serviço{contagem_total.length === 1 ? '' : 's'} no total.</p>
</Filtros>
<Tabela {sort} servicos={servicos_filtrados}/>