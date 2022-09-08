<script context='module'>
    import { updateProcesso, getUnique, getCampo, getDepts, getOpcoes, nextEtapa } from '$lib/utils/cadastros';
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
    import { user } from '$lib/stores/user.js'
    import { tipos_os, categorias_por_tipo_os } from '$lib/stores/local_db';
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import { page } from '$app/stores'
    import { writable } from 'svelte/store';
    import { TimeFromSeconds } from '$lib/utils/utils';
    import { proximo_status, metadado_hora,  } from '$lib/utils/utils';
    import { sendEmail } from '$lib/utils/email'
    console.log(`from layout, ${proximo_status}, ${metadado_hora}`);

    let atendente='', nome='Sem usuário', dept='Sem usuário', anexos = []
    let servico = writable({})
    /**
     * @type {{
           dialog: HTMLDialogElement,
           tipo: string,
           categoria: string,
           _categoria: string,
           prioridade: number,
       }} classificador
     */
    let classificador = writable({}) 
    $classificador = {
        dialog: undefined,
        tipo: '',
        _categoria: '',
        prioridade: 0,
    }
    $classificador.__defineSetter__('categoria', function (categoria) {
        this._categoria = categoria
    })
    $classificador.__defineGetter__('categoria', function () {
        return this.tipo + ' - ' + this._categoria
    })
    let etapa = ''
    const getServico = ()=>getUnique('processo', 'suporte_tecnico', $page.params.servico_id)
        .then(data=>{
            if (data.etapa.Tag === 'finaliza') {
                let new_link = `/processos/finaliza/${$page.params.servico_id}`
                window.location.href = new_link
                console.log(new_link)
            }
            console.log(data)
            servico.set(data)
            etapa = data.etapa.Tag
        })
    getServico()
    $: if ($servico?.idEtapaAtual) 
        getUnique('etapa', etapa, $servico?.idEtapaAtual)
        .then(data=>getCampo('log', data.log[0].Tag, data.log[0].id, 'anexo'))
        .then(files=>anexos=files)
        .catch(()=>{})
    $: servico_new = $processos.find(({id})=>id==$page.params.servico_id)
    $: if (servico_new?.updatedAt !== $servico?.updatedAt) getServico()
    $: console.log($servico)
    
    setContext('servico', servico)
    setContext('getServico', getServico)
    $: setContext('classificador', classificador)
 
    let agora = 0
    let handler_agora = setInterval(()=>agora=Date.now()/1000, 1000)
    onDestroy(()=>clearInterval(handler_agora))
    $: abertura = $servico ? (new Date($servico.createdAt).getTime()/1000) : 0
    $: sla = Math.floor(agora - abertura)
    $: campos_etapa = $servico?.etapa ? Object.fromEntries($servico?.etapa.campos) : {}

    $: isSuporte = $user?.tipo=='suporte'

    $: $servico?.usuarioId, setNomeAndDept()
    $: campos_etapa, setAtendente()

    let canEdit = false
    $: getDepts('suporte_tecnico', etapa).then(depts=>canEdit = ($user?.tipo == 'suporte' && $user?.dept.includes(depts?.find(dept=>dept.id===$servico.etapa.dept)?.departamento) || $user?.cargo == 'admin')) 

    let status_opcoes = []
    $: getOpcoes('etapa', etapa, 'status').then(opcoes=>status_opcoes=opcoes)

    function setAtendente () {
       console.log("Setting atendente")
       console.log(campos_etapa)
       let id = campos_etapa["suporteId"]
       console.log(`atendenteId: ${id}`)
       console.log(`$user?.nome: ${$user?.nome}`)
       if (id)
           if (id == $user?.id)
               atendente=$user?.nome
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
    function onChange (campo) {
        return async ()=>{
            let filial = Object.fromEntries($servico.campos)?.filial;
            let novo_status = proximo_status[campos_etapa.status];
            let update = {};
            update[campo] = campos_etapa[campo];
            if (campo === 'status')
                update[metadado_hora[novo_status]] = (new Date()).toISOString();
            if (novo_status.toLowerCase().includes("aguardando"))
                sendEmail('on_hold', (await getUser($servico.idUsuario)).email, { idOS: $servico.id, status: novo_status });
            if (campo === 'categoria')
                update.suporteId = $user.id
            if (campo==='status' && campos_etapa[campo] === 'fechado')
                await nextEtapa($servico, { 
                        dept:
                        filial === '0101' 
                            ? 9
                            : filial === '0201'
                            ? 22
                            : filial === '0401'
                            ? 29
                            : undefined,
                    })
                    .then(()=>history.back())
                    .catch(console.error)
            else
            await updateProcesso($servico, update)
                .then(getServico)
                .catch(console.error)
        }
    }
</script>
{#if $servico}
{#key $servico?.updatedAt}
<div class='filled container'>
    <div class='wrapper'>
        <h1>Chamado {$servico.id}</h1>{#if $user?.tipo == 'suporte'}<a href='/classificar/{$page.params.servico_id}'><Fa icon={faPen}/></a>{/if}
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
                    {$servico?.createdAt?.split('T')[0].split('-').reverse().join('/')}
                </td>
            </tr>
            <tr class:hidden={!(!!atendente || isSuporte)}>
                <th>
                    Responsável:
                </th>
                <td>
                    <span class:hidden={!atendente}>{atendente}</span>
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

                    <dialog class='filled container' bind:this={$classificador.dialog}>
                        <h2>
                            Classificar chamado
                        </h2>
                        <form on:submit|preventDefault={()=>Promise.all([onChange("categoria")(), onChange("prioridade")()]).then($classificador.dialog.close.bind($classificador.dialog))}>
                            <label>
                                Prioridade
                                <select bind:value={$classificador.prioridade} on:change={()=>campos_etapa["prioridade"]=$classificador.prioridade}>

                                </select>
                            </label>
                            <label>
                                Tipo 
                                <select bind:value={$classificador.tipo}>
                                    {#each $tipos_os as {tipo}}
                                        <option>{tipo}</option>
                                    {/each}
                                </select>
                                <input placeholder="Use isso se não encontrar sua opção acima" bind:value={$classificador.tipo}>
                            </label>
                            <label>
                                Categoria
                                <select bind:value={$classificador._categoria} on:change={()=>campos_etapa["categoria"]=$classificador.categoria}>
                                    {#each $categorias_por_tipo_os[$classificador.tipo] || [] as categoria}
                                        <option>{categoria}</option>
                                    {/each}
                                </select>
                                <input placeholder="Use isso se não encontrar sua opção acima" bind:value={$classificador._categoria} on:change={()=>campos_etapa["categoria"]=$classificador.categoria}>
                            </label>
                            <input type='submit' value='Enviar'>
                            <span>{$classificador.categoria}</span>
                        </form>
                    </dialog>

                </td>
            </tr>
            <tr>
                <th>
                    Status:
                </th>
                <td>
                    <span class:hidden={canEdit}>
                        {campos_etapa["status"]}</span>
                    <select class:hidden={!canEdit} bind:value={campos_etapa["status"]}  on:change={onChange("status")}>
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
    dialog form, dialog label {
        display: flex;
        flex-flow: column;
        gap: 0.5em;
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