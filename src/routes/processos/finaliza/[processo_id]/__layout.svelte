<script context='module'>

	export async function load ({params}) {
		return {
			stuff: {
				title: `Chamado ${params.cadastro_id}`
			},
		}
	}

</script>
<script>
    import { page } from '$app/stores'
    import { user } from '$lib/stores/user';
    import { getUnique, getDepts, getOpcoes, updateProcesso, nextEtapa } from '$lib/utils/cadastros';
    import { getUser } from '$lib/utils/db';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    let processo = writable(), cliente, depts, status_opcoes = [], status = '', updating = false
    setContext('processo', processo)
    getUnique('processos', 'finaliza', $page.params.processo_id)
    .then(data=>{
        $processo=data;
        console.log(data)
        status=data.etapa.campos.find(({campo})=>campo==='finalizado').valor
        status = status.toString()
    })
    $: etapa = $processo?.etapa.Tag
    getDepts('finaliza').then(data=>depts=data)
    $: console.log(etapa)
    $: getOpcoes('etapa', etapa, 'finalizado').then(data=>(console.log(data),status_opcoes=data.map(s=>s.toString())))
    $: getUser($processo?.idUsuario).then(user=>cliente=user)

    let canEdit = false
    $: if (cliente && depts) {
        canEdit = !$user.dept.includes(depts?.find(dept=>dept.id===$processo.etapa.dept)?.departamento)
    }
    $: console.log(canEdit)
    function onChange() {
        updating = true
        if (status === 'finalizado')
        return updateProcesso($processo, {status})
            .then(()=>updating = false)
    }
</script>
<div class='filled container'>
    <div class='wrapper'>
        <h1>Chamado {$processo?.id}</h1>
        <table> 
            <tr>
                <th>
                    Cliente:
                </th>
                <td>
                    {cliente?.nome}
                </td>
            </tr>
            <tr>
                <th>
                    Produto:
                </th>
                <td>
                    {$processo?.log[0].titulo}
                </td>
            </tr>
            <tr>
                <th>
                    Descrição:
                </th>
                <td>
                    {$processo?.log[0].descr}
                </td>
            </tr>
            <tr class:hidden={canEdit}>
                <th>
                    Finalizar?
                </th>
                <td>
                    <button>OK</button>
                </td>
            </tr>
            <tr class:hidden={!canEdit}>
                <th>
                    Status
                </th>
                <td>
                    {status==true ? 'finalizado' : 'pendente'}
                </td>
            </tr>
        </table>
        <div class='campo'>
        <h2>Anexo</h2>
        </div>

    </div>
    <div class='container'>
        <slot/>
    </div>
</div>
<style>
    .updating::after {
        content: '...',
        
    }
    .filled.container {
        margin: auto;
        flex-flow: row;
    }
    .wrapper {
        justify-content: flex-start;
        border-right: var(--dark) solid;
        padding-right: 2em;
    }
    .hidden {
        display: none;
    }
    .campo {
        font-size: small;
    }
    table {
        display: grid;
    }
    tr {
        padding: 0.5em;
        border-bottom: 0.1em var(--dark) solid;
    }
</style>