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
    let cadastro = writable(), cliente, depts, status_opcoes = [], status = '', updating = false
    setContext('cadastro', cadastro)
    getUnique('processos', 'cadastro_produto', $page.params.cadastro_id)
    .then(data=>{
        $cadastro=data;
        status=data.etapa.campos.find(({campo})=>campo==='status').valor
        status = status.toString()
    })
    $: etapa = $cadastro?.etapa.Tag
    getDepts('cadastro_produto').then(data=>depts=data)
    $: getOpcoes('etapa', etapa,'status').then(data=>status_opcoes=data)
    $: getUser($cadastro?.idUsuario).then(user=>cliente=user)

    let canEdit = false
    $: if (cliente && depts) {
        console.log`${cliente}${depts}${$cadastro}`
        canEdit = $user.dept.includes(depts?.find(dept=>dept.id===$cadastro.etapa.dept)?.departamento)
    }
    $: console.log(canEdit)
    function onChange() {
        updating = true
        if (status === 'finalizado')
            return nextEtapa($cadastro)
                .then(()=>updating = false)
                .then(()=>history.back())
        return updateProcesso($cadastro, {status})
            .then(()=>updating = false)
    }
</script>
<div class='filled container'>
    <div class='wrapper'>
        <h1>Chamado {$cadastro?.id}</h1>
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
                    {$cadastro?.log[0].titulo}
                </td>
            </tr>
            <tr>
                <th>
                    Unidade:
                </th>
                <td>
                    {$cadastro?.etapa.campos.find(campo=>campo.campo==='unidade')?.valor}
                </td>
            </tr>
            <tr>
                <th>
                    Descrição:
                </th>
                <td>
                    {$cadastro?.log[0].descr}
                </td>
            </tr>
            <tr>
                <th>
                    Status:
                </th>
                <td>
                    <span class:hidden={canEdit}>
                        {status}</span>
                    <select class:updating class:hidden={!canEdit} bind:value={status} on:change={onChange}>
                        {#each status_opcoes as opcao}
                            <option>{opcao}</option>
                        {/each}
                    </select>
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