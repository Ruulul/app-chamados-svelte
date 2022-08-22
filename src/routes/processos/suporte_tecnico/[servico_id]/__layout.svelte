<script context='module'>
	export async function load ({params}) {
		return {
			stuff: {
				title: `Chamado ${params.servico_id}`
			}
		}
	}

</script>
<script>
    import Fa from 'svelte-fa';
    import {faPen} from '@fortawesome/free-solid-svg-icons';
    import { processos } from '$lib/stores/notifications'
    import { onDestroy, setContext } from 'svelte';
    import { getUser, } from '$lib/utils/db.js'
    import { updateProcesso, getUnique, getCampo, getDepts, getOpcoes, nextEtapa } from '$lib/utils/cadastros';
    import { user } from '$lib/stores/user.js'
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import { page } from '$app/stores'
    import { writable } from 'svelte/store';
    import { TimeFromSeconds } from '$lib/utils/utils';

    let atendente='', nome='Sem usuário', dept='Sem usuário', anexos = []
    let servico = writable({})
    $servico = $processos.find(({id})=>id==$page.params.servico_id)
    $: etapa = $servico?.etapa.Tag
    $: if ($servico?.idEtapaAtual) 
        getUnique('etapa', etapa, $servico?.idEtapaAtual)
        .then(data=>getCampo('log', data.log[0].Tag, data.log[0].id, 'anexo'))
        .then(files=>anexos=files)
        .catch(()=>{})
    $: servico_new = $processos.find(({id})=>id==$page.params.servico_id)
    $: if (servico_new?.updatedAt !== $servico?.updatedAt) $servico = servico_new
    $: console.log($servico)
    
    setContext('servico', servico)

    function liberaChamado () {
        let update = {
            atendimento: false,
            suporteId: ''
        }
        updateProcesso($servico, update)
            .then(()=>getUnique('processo', $servico.Tag, $servico.id))
            .then(servico.set)
            .then(()=>atendente='')
            .catch(console.error)
    }

    function assumeChamado () {
        let update = {
            atendimento: true,
            suporteId: $user.id,
            assumido_em: (new Date()).toISOString()
        }
        updateProcesso($servico, update)
            .then(()=>getUnique('processo', $servico.Tag, $servico.id))
            .then(servico.set)
            .catch(console.error)
    }

    let agora = 0
    let handler_agora = setInterval(()=>agora=Date.now()/1000, 1000)
    onDestroy(()=>clearInterval(handler_agora))
    $: abertura = $servico ? (new Date($servico.createdAt).getTime()/1000) : 0
    $: sla = Math.floor(agora - abertura)
    $: campos_etapa = $servico ? Object.fromEntries($servico?.etapa.campos) : {}

    $: isSuporte = $user.tipo=='suporte'
    $: canRelease = campos_etapa["suporteId"] == $user.id && $servico?.status !== 'fechado'

    $: $servico?.usuarioId, setNomeAndDept()
    $: campos_etapa, setAtendente()

    let canEdit = false
    $: getDepts(etapa).then(depts=>canEdit = $user.dept.includes(depts?.find(dept=>dept.id===$servico.etapa.dept)?.departamento))

    let status_opcoes = []
    $: getOpcoes('etapa', etapa, 'status').then(opcoes=>status_opcoes=opcoes)

    function setAtendente () {
        console.log("Setting atendente")
        console.log(campos_etapa)
        let id = campos_etapa["suporteId"]
        console.log(`atendenteId: ${id}`)
        console.log(`$user.nome: ${$user.nome}`)
        if (id)
            if (id == $user.id)
                atendente=$user.nome
            else getUser(id).then(user=>(atendente=user.nome, user)).then(console.log)
    }
    function setNomeAndDept () {
        let id = $servico?.idUsuario
        if (id)
            getUser(id).then(({nome : gettedNome, dept : gettedDept})=>{
                nome = gettedNome;
                dept = gettedDept;
            })
    }
    function onChange() {
        if (campos_etapa["status"] === 'finalizado')
            return nextEtapa($servico)
                .then(()=>history.back())
                .catch(console.error)
        return updateProcesso($servico, {status: campos_etapa["status"]})
            .then(()=>getUnique('processo', $servico.Tag, $servico.id))
            .then(servico.set)
            .catch(console.error)
    }
</script>
{#if $servico}
{#key $servico?.updatedAt}
<div class='filled container'>
    <div class='wrapper'>
        <h1>Chamado {$servico.id}</h1>{#if $user.tipo == 'suporte'}<a href='/classificar/{$page.params.servico_id}'><Fa icon={faPen}/></a>{/if}
        <table> 
            <tr>
                <th>
                    Tempo decorrido:
                </th>
                <td>
                    {TimeFromSeconds(sla)}
                </td>
            </tr>
            <tr>
                <th>
                    Abertura:
                </th>
                <td>
                    {$servico.createdAt.split('T')[0].split('-').reverse().join('/')}
                </td>
            </tr>
            <tr class:hidden={!(!!atendente || isSuporte)}>
                <th>
                    Responsável:
                </th>
                <td>
                    <span class:hidden={!atendente}>{atendente}</span>
                    <button on:click={assumeChamado} class:hidden={!(!atendente && isSuporte)}>Assumir chamado?</button>
                    <button on:click={liberaChamado} class:hidden={!(canRelease)}>Liberar chamado</button>
                </td>
            </tr>
            <tr>
                <th>
                    Cliente:
                </th>
                <td>
                    {nome}
                </td>
            </tr>
            <tr>
                <th>
                    Departamento:
                </th>
                <td>
                    {dept}
                </td>
            </tr>
            <tr>
                <th>
                    Categoria:
                </th>
                <td>
                    {campos_etapa["categoria"]}
                </td>
            </tr>
            <tr>
                <th>
                    Status:
                </th>
                <td>
                    <span class:hidden={canEdit}>
                        {campos_etapa["status"]}</span>
                    <select class:hidden={!canEdit} bind:value={campos_etapa["status"]} on:change={onChange}>
                        {#each status_opcoes as opcao}
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
{/key}
{/if}
<style>
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