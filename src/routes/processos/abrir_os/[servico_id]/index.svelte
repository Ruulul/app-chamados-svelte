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
    import { processos } from '$lib/stores/notifications'
    import { onDestroy, setContext } from 'svelte';
    import { getUser, } from '$lib/utils/db.js'
    import { user } from '$lib/stores/user.js'
    import { tipos_os, categorias_por_tipo_os } from '$lib/stores/local_db';
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import ProcessoTemplate from '../../processo_template.svelte';
    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    import { writable } from 'svelte/store';
    import { notificaEnvolvidos, TimeFromSeconds } from '$lib/utils/utils';
    import { proximo_status, metadado_hora,  } from '$lib/utils/utils';
    import { sendEmail } from '$lib/utils/email'
    import Dialog from '$lib/components/Dialog.svelte';
    console.log(`from layout, ${proximo_status}, ${metadado_hora}`);

    let atendente='', nome='Sem usuário', dept='Sem usuário', anexos = {}
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
                goto(new_link)
            }
            servico.set(data)
            etapa = data.etapa.Tag
        })
    getServico()
    let handler = setTimeout(getServico, 1000);
    onDestroy(()=>clearInterval(handler))
    $: if ($servico?.idEtapaAtual) 
        getUnique('etapa', etapa, $servico?.idEtapaAtual)
        .then(data=>data.log?.forEach(async log => !anexos[log.id] ? anexos[log.id] = await getCampo('log', log.Tag, log.id, 'anexo') : undefined))
        .catch(()=>{})
    $: servico_new = $processos.find(({id})=>id==$page.params.servico_id)
    $: if (servico_new?.updatedAt !== $servico?.updatedAt) getServico()

    setContext('servico', servico)
    setContext('getServico', getServico)
    $: setContext('classificador', classificador)
 
    let agora = 0
    let handler_agora = setInterval(()=>agora=Date.now()/1000, 1000)
    onDestroy(()=>clearInterval(handler_agora))
    $: abertura = $servico ? (new Date($servico.createdAt).getTime()/1000) : 0
    $: sla = Math.floor(agora - abertura)
    $: campos_etapa = $servico?.etapa ? Object.fromEntries($servico?.etapa.campos) : {}

    $: $servico?.usuarioId, setNomeAndDept()
    $: campos_etapa, setAtendente()

    let canEdit = false
    $: getDepts('suporte_tecnico', etapa).then(depts=>canEdit = ($user?.tipo == 'suporte' && $user?.dept.includes(depts?.find(dept=>dept.id===$servico.etapa.dept)?.departamento) || $user?.cargo == 'admin')) 

    let status_opcoes = []
    $: getOpcoes('etapa', etapa, 'status').then(opcoes=>status_opcoes=opcoes)

    function setAtendente () {
       let id = campos_etapa["suporteId"]
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
            let status = campos_etapa.status
            let novo_status = proximo_status[status];
            let update = {};
            update[campo] = campos_etapa[campo];
            if (campo === 'status') {
                $servico.etapa.campos.find(campo=>campo[0]==='status')[1] = novo_status;
                update[metadado_hora[novo_status]] = (new Date()).toISOString();
                await notificaEnvolvidos($servico)
                    .then(getServico)
                    .catch(console.error);
            }
            if (campo === 'categoria')
                update.suporteId = $user.id
            if (campo==='status' && campos_etapa[campo] === 'fechado') {
                if (confirm("Fechar chamado?")) {
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
                }
            }
            else
            await updateProcesso($servico, update)
                .then(getServico)
                .catch(console.error)
        }
    }
    const label_por_status = {
        'em analise': 'Adicionar à fila',
        'pendente': 'Atender chamado',
        'em atendimento': 'Fechar chamado',
    }

    $: a_classificar = campos_etapa.categoria === 'A. D.'
    async function atualizaChamado () {
        let novo_status = proximo_status[campos_etapa.status]
        await update (novo_status)
    }
</script>
<template lang="pug">
    +if('$servico')
        +key('$servico?.updatedAt')
            .filled.container
                .wrapper
                    h1 Chamado {$servico.id}
                    table
                        tr
                            th Tempo decorrido:
                            td {TimeFromSeconds(sla)}
                        tr
                            th Abertura:
                            td {$servico?.createdAt?.split('T')[0].split('-').reverse().join('/')}
                        tr(class:hidden!='{!(!!atendente || canEdit)}')
                            th Responsável:
                            td: span(class:hidden!='{!atendente}') {atendente}
                        tr
                            th Cliente:
                            td {nome}
                        tr
                            th Departamento
                            td {dept}
                        tr
                            th Categoria:
                            td {campos_etapa["categoria"]}
                                Dialog(bind:dialog!='{$classificador.dialog}' title='Classificar chamado')
                                    form(on:submit|preventDefault!='{()=>Promise.all([onChange("categoria")(), onChange("prioridade")()]).then($classificador.dialog.close.bind($classificador.dialog))}')
                                        label Prioridade
                                            select(bind:value!='{$classificador.prioridade}' on:change!='{()=>campos_etapa["prioridade"]=$classificador.prioridade}')
                                                option(value=1) Baixa 
                                                option(value=2) Média
                                                option(value=3) Alta
                                                option(value=4) Urgente
                                        label Área de TI
                                            select(bind:value!='{$classificador.tipo}')
                                                +each('$tipos_os as {tipo}')
                                                    option {tipo}
                                            input(bind:value!='{$classificador.tipo}' placeholder="Use isso se não encontrar sua opção acima")
                                        label Categoria
                                            select(bind:value!='{$classificador._categoria}' on:change!='{()=>campos_etapa["categoria"]=$classificador.categoria}')
                                                +each('$categorias_por_tipo_os[$classificador.tipo] || [] as categoria')
                                                    option {categoria}
                                            input(bind:value!='{$classificador._categoria}' placeholder="Use isso se não encontrar sua opção acima")
                                        input(type="submit" value="enviar")
                                        span {$classificador.categoria}
                        tr
                            th Status:
                            td
                                span(class:hidden!='{canEdit}') {campos_etapa["status"]}
                                select(class:hidden!='{!canEdit}' bind:value!='{campos_etapa["status"]}' on:change!='{()=>onChange("status")()}')
                                    +each('status_opcoes as opcao')
                                        option {opcao}
                    .campo
                        h2 Anexos
                            +each('Object.values(anexos).flat() as anexo')
                                +if('anexo instanceof Object')
                                    +const('title = anexo.title')
                                    +const('data = anexo.data')
                                    ExibeArquivo(title!='{title?.split('-')[1]}' '{data}')
                .container
                    ProcessoTemplate(getProcesso!='{getServico}' processo!='{$servico}')
                        button.action.button(slot='buttons' on:click!='{a_classificar ? $classificador.dialog.showModal.bind($classificador.dialog) : atualizaChamado}') {a_classificar ? 'Classificar e Assumir' : label_por_status[campos_etapa.status]}

</template>
<style>
    .action.button {
        text-transform: uppercase;
        padding: 0.6em;
        border-radius: 0.5em;
        margin: 1em;
    }
    .filled.container {
        margin: auto;
        flex-flow: row;
    }
    form, label {
        display: flex;
        flex-flow: column;
        gap: 0.5em;
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