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
    import { getUnique, getDepts, getOpcoes, updateProcesso } from '$lib/utils/cadastros';
    import { getUser } from '$lib/utils/db';
    import { setContext, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { notificaEnvolvidos } from '$lib/utils/utils';
    let processo = writable(), cliente, depts, status_opcoes = [], status = '', updating = false
    setContext('processo', processo)
    const getProcesso = 
    () => getUnique('processo', 'finaliza', $page.params.processo_id)
    .then(data=>{
        $processo=data;
        console.log(data)
        status=Object.fromEntries(data.etapa.campos)["status"]
    })
    getProcesso()
    let handler = setTimeout(getProcesso, 1000);
    onDestroy(()=>clearInterval(handler))
    $: etapa = $processo?.etapa.Tag
    $: getDepts($processo?.Tag, 'finaliza').then(data=>depts=data)
    $: console.log(etapa)
    $: getOpcoes('etapa', etapa, 'status').then(data=>(console.log(data),status_opcoes=data.map(s=>s.toString())))
    $: getUser($processo?.idUsuario).then(user=>cliente=user)

    let canEdit = false
    $: canEdit = $user.dept.includes(depts?.find(dept=>dept.id===$processo.etapa.dept)?.departamento) || $user.cargo == 'admin'
    $: console.log({user_dept: $user.dept, depts})
    $: console.log(canEdit)
    function onChange() {
        updating = true
        return updateProcesso($processo, {status})
            .then(()=>getProcesso())
            .then(()=>notificaEnvolvidos($processo))
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
        <div class='campo'>
        <h2>Anexo</h2>
        </div>

    </div>
    <div class='container'>
        <slot/>
    </div>
</div>
<style>
    .updating {
        opacity: 0.2;
    }
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