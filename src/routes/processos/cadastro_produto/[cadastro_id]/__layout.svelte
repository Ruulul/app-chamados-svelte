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
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import { user } from '$lib/stores/user';
    import { getUnique, getCampo, getDepts, getOpcoes, updateProcesso, nextEtapa } from '$lib/utils/cadastros';
    import { getUser } from '$lib/utils/db';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    let cadastro = writable(), campos = {}, cliente, depts, status_opcoes = [], status = '', updating = false, anexos = []
    setContext('cadastro', cadastro)
    getUnique('processo', 'cadastro_produto', $page.params.cadastro_id)
    .then(data=>{
        $cadastro=data;
        campos = data ? Object.fromEntries(data.etapa.campos) : {}
        status = campos["status"]
    })
    $: etapa = $cadastro?.etapa.Tag
    $: if ($cadastro?.idEtapaAtual) 
        getUnique('etapa', etapa, $cadastro?.idEtapaAtual)
        .then((data)=>getCampo('log', data.log[0]?.Tag, data.log[0]?.id, 'anexo'))
        .then(files=>anexos=files)
    getDepts('cadastro_produto').then(data=>depts=data)
    $: console.log(`Getting "etapa/campos/${etapa}/status"`)
    $: getOpcoes('etapa', etapa, 'status').then(data=>status_opcoes=data)
    $: getUser($cadastro?.idUsuario).then(user=>cliente=user)

    let canEdit = false
    $: canEdit = $user.dept.includes(depts?.find(dept=>dept.id===$cadastro?.etapa.dept)?.departamento) || $user.cargo == 'admin'
    function onChange() {
        updating = true
        if (status === 'finalizado')
            return nextEtapa($cadastro)
                .then(()=>history.back())
        return updateProcesso($cadastro, {status})
            .then(()=>getUnique('processo', 'cadastro_produto', $page.params.cadastro_id))
            .then(cadastro.set)
            .then(()=>etapa==='finaliza'&&status==='true' ? history.back() : undefined)
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
                    {campos["unidade"]}
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
                        {#each status_opcoes || [] as opcao}
                            <option>{opcao}</option>
                        {/each}
                    </select>
                </td>
            </tr>
        </table>
        <div class='campo'>
        <h2>Anexo</h2>
            {#each anexos as {data, title}}
                <ExibeArquivo title={title?.split('-')[1]} {data}/>
            {/each}
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