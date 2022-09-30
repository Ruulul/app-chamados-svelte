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
    import ProcessoTemplate from '../../processo_template.svelte';
    import { user } from '$lib/stores/user';
    import { getUnique, getCampo, getDepts, getOpcoes, updateProcesso, nextEtapa } from '$lib/utils/cadastros';
    import { getUser } from '$lib/utils/db';
    import { notificaEnvolvidos } from '$lib/utils/utils';
    import { setContext, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    let cadastro = writable(), campos = {}, cliente, depts, status_opcoes = [], status = '', updating = false, anexos = {}
    setContext('cadastro', cadastro)
    const getProcesso = ()=>getUnique('processo', 'cadastro_produto', $page.params.cadastro_id)
        .then(data=>{
            $cadastro=data;
            campos = data ? Object.fromEntries(data.etapa.campos) : {}
            status = campos["status"]
        })
    getProcesso()
    let handler = setTimeout(getProcesso, 1000);
    onDestroy(()=>clearInterval(handler))
    setContext('getProcesso', getProcesso)
    $: etapa = $cadastro?.etapa.Tag
    $: if ($cadastro?.idEtapaAtual) 
        getUnique('etapa', etapa, $cadastro?.idEtapaAtual)
        .then(data=>data.log?.forEach(async log => !anexos[log.id] ? anexos[log.id] = await getCampo('log', log.Tag, log.id, 'anexo') : undefined))
    getDepts('cadastro_produto', 'cadastro_produto').then(data=>depts=data)
    $: getOpcoes('etapa', etapa, 'status').then(data=>status_opcoes=data)
    $: getUser($cadastro?.idUsuario).then(user=>cliente=user)

    let canEdit = false
    $: canEdit = $user.dept.includes(depts?.find(dept=>dept.id===$cadastro?.etapa.dept)?.departamento) || $user.cargo == 'admin'
    function onChange() {
        updating = true
        $cadastro.etapa.campos.find(campo=>campo[0]==='status')[1] = status;
        if (status !== 'finalizado') notificaEnvolvidos($cadastro);
        if (status === 'finalizado') {
            if (confirm("Fechar chamado?")) { 
                notificaEnvolvidos($cadastro);
                return nextEtapa($cadastro)
                    .then(()=>history.back())
            }
        }
        else return updateProcesso($cadastro, {status})
            .then(getProcesso)
            .then(()=>etapa==='finaliza' && status==='finalizado' ? history.back() : undefined)
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
                        {status}
                    </span>
                    <select class:updating class:hidden={!canEdit} bind:value={status} on:change={()=>onChange()}>
                        {#each status_opcoes || [] as opcao}
                            <option>{opcao}</option>
                        {/each}
                    </select>
                </td>
            </tr>
        </table>
        <div class='campo'>
        <h2>Anexo</h2>
            {#each Object.values(anexos).flat() as anexo}
                {#if anexo instanceof Object}
                    {@const title = anexo.title}
                    {@const data = anexo.data}
                    <ExibeArquivo title={title?.split('-')[1]} {data}/>
                {/if}
            {/each}
        </div>
    </div>
    <div class='container'>
        <ProcessoTemplate {getProcesso} processo={$cadastro}/>
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