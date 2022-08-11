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
    import { filtros, count, pages } from '$lib/stores/servicos';
    import Tabela from './_TabelaServicos.svelte'
    import Filtros from './_FiltrosServicos.svelte'
    import { getServicosPageCount } from '$lib/utils/servicos';


    let status = 'pendente'
    let countPages;
    getServicosPageCount($filtros.chamados, $filtros.limit).then(count=>countPages=count)
    $: console.log(countPages, $count, $pages)
    let tipo = ''
    let sort = (a, b)=>b.id-a.id
    let filial = ''
</script>
<Tabela {sort}>
    <Filtros bind:tipo bind:status bind:sort bind:filial />
</Tabela>
<ul>
    {countPages} {$count} {$pages}
</ul>