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
    import { filtros, pages, servicos } from '$lib/stores/servicos';
    import Tabela from './_TabelaServicos.svelte'
    import Filtros from './_FiltrosServicos.svelte'


    let status = 'pendente'
    let tipo = ''
    let sort = (a, b)=>b.id-a.id
    let filial = ''
    $: status, tipo, sort, filial, servicos.update()
</script>
<Tabela {sort}>
    <Filtros bind:tipo bind:status bind:sort bind:filial /><br>
    <div>
        <label>
            Página:
            <input type=number bind:value={$filtros.page} on:change={servicos.update}/> de {$pages}
        </label>
        <label>
            Chamados por página(por filial):
            <input type=number bind:value={$filtros.limit} on:change={servicos.update}/>
        </label>
    </div>
</Tabela>

<style>
    div, label {
        display: flex;
    }
    div {
        width: 100%;
        flex-flow: row;
        justify-content: space-between;
    }
    label {
        flex-flow: column;
    }
    input {
        width: 3em;
    }
</style>