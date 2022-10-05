<script context='module'>

	export async function load ({params}) {
		return {
			stuff: {
				title: `Chamado ${params.processo_id}`
			},
		}
	}

</script>
<script>
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import { page } from '$app/stores'
    import { user } from '$lib/stores/user';
    import { getUnique, getDepts, getOpcoes, updateProcesso, getCampo } from '$lib/utils/cadastros';
    import { getUser } from '$lib/utils/db';
    import { setContext, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { notificaEnvolvidos } from '$lib/utils/utils';
    import ProcessoTemplate from '../../processo_template.svelte'
    let processo = writable(), cliente, depts, status_opcoes = [], status = '', updating = false
    setContext('processo', processo)

    let anexos = writable({})
    $: console.log($anexos)
    setContext('anexos', anexos)
    const getProcesso = 
    () => getUnique('processo', 'finaliza', $page.params.processo_id)
    .then(data=>{
        $processo=data;
        status=Object.fromEntries(data.etapa.campos)["status"]
        data.log?.forEach(async log => !$anexos[log.id] ? $anexos[log.id] = await getCampo('log', log.Tag, log.id, 'anexo') : undefined)
    })
    getProcesso()
    let handler = setTimeout(getProcesso, 1000);
    onDestroy(()=>clearInterval(handler))
    $: etapa = $processo?.etapa.Tag
    $: getDepts($processo?.Tag, 'finaliza').then(data=>depts=data)
    $: getOpcoes('etapa', etapa, 'status').then(data=>status_opcoes=data.map(s=>s.toString()))
    $: getUser($processo?.idUsuario).then(user=>cliente=user)

    let canEdit = false
    $: canEdit = $user.dept.includes(depts?.find(dept=>dept.id===$processo.etapa.dept)?.departamento) || $user.cargo == 'admin'
    function onChange() {
        updating = true
        $processo.etapa.campos.find(campo=>campo[0]==='status')[1] = status;
        notificaEnvolvidos($processo);
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
            <h2>Anexos</h2>
                {#each Object.values($anexos).flat() as anexo}
                    {#if anexo instanceof Object}
                        {@const title = anexo.title}
                        {@const data = anexo.data}
                        <ExibeArquivo title={title?.split('-')[1]} {data}/>
                    {/if}
                {/each}
            </div>

    </div>
    <div class='container'>
        <ProcessoTemplate {getProcesso} processo={$processo}/>
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