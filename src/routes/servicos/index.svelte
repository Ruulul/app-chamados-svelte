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
    import { servicos, filtros } from '$lib/stores/servicos';
    import Tabela from './_TabelaServicos.svelte'
    import Filtros from './_FiltrosServicos.svelte'
    import { getServicosPageCount } from '$lib/utils/servicos';


    let status = 'pendente'
    let countPages;
    let tipo = ''
    let sort = (a, b)=>b.id-a.id
    let filial = ''
    $: if (status || tipo || filial) {
        let filtro = [];
        if (status) filtro.push(['status', status == 'atendimento' ? 'pendente' : status])
        if (status == 'atendimento') filtro.push(['atendimento', true])
        if (tipo) filtro.push(['tipo', tipo])
        console.log(filtro)
        $filtros.chamados = filtro
    } else {
        $filtros.chamados = []
    }
    $: getServicosPageCount($filtros.chamados, $filtros.limit).then(count=>countPages=count)
</script>
<Tabela {sort} servicos={$servicos} {countPages} bind:page={$filtros.page}>
    <Filtros bind:tipo bind:status bind:sort bind:filial />
</Tabela>