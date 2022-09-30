import { user } from "$lib/stores/user";
import { get } from "svelte/store";
import { getUser } from "./db";
import { sendEmail } from "./email";
import { requestGet, requestPost, requestPut, requestDelete } from "./network";
import { getEmailsEnvolvidos } from "./utils";

export {
    post,
    getUnique,
    getMany,
    getCampo,
    getOpcoes,
    getDepts,
    getDept,
    getCount,
    getEtapas,
    updateProcesso,
    addMensagem,
    deleteMensagem,
    nextEtapa,
}

let last_request = Date.now();
let interval = 5000

async function post (model, tag, os) {
    if (Date.now() < last_request + interval ) return console.log('too quick')
    last_request = Date.now()
    let { anexos } = os;
    delete os.anexos;
    let processo = await requestPost(`/${model}/${tag}`, os);
    if (anexos) {
        let etapa = await requestGet(`/etapa/${processo.idEtapaAtual}`)
        let msg = etapa.log[0]
        await Promise.all(anexos.map(anexo=>requestPost(`/log/${msg.Tag}/${msg.id}/campo/anexo`, anexo))).catch(console.error);
    }
    if (['fechado', 'finalizado'].includes(os.status)) {
        return await nextEtapa(processo, {}, { no_cooldown: true });
    }
    return processo
}
async function getUnique (model, tag, id) {
    return await requestGet(`/${model}/${tag}/` + id)
        .catch(console.error)
}
async function getMany (model, tag = '') {
    return await requestGet(`/${model}/${tag}`)
        .catch(console.error)
}
async function getCampo (model, tag, id, campo) {
    return await requestGet(`/${model}/${tag}/${id}/campo/${campo}`)
        .catch(console.error)
}
async function getOpcoes (model, tag, campo) {
    let campos = await requestGet(`/meta/${model}/${tag}/campos`)
    return Array.isArray(campos) ? campos?.find(({campoMeta})=>campoMeta===campo)?.opcoes : []
}
async function getDepts (tag_processo, tag_etapa) {
    let meta = await requestGet(`/meta/etapa/`)
    meta = meta?.filter(meta=>meta.processoTag === tag_processo).find(etapa=>etapa.Tag === tag_etapa)
    return meta?.dept ? [meta.dept] : meta?.depts
}
async function getDept (idDept) {
    return requestGet(`/departamentos/${idDept}`)
        .catch(console.error)
}
async function getEtapas (idEtapaAtual) {
    let etapa_atual = await requestGet(`/etapa/${idEtapaAtual}`).catch(()=>({}))
    while (etapa_atual.next) etapa_atual = await requestGet(`/etapa/${etapa_atual.next}`).catch(()=>({}))
    let etapas = [etapa_atual]
    while (etapa_atual.prev) {
        etapa_atual = await requestGet(`/etapa/${etapa_atual.prev}/`).catch(()=>({}))
        etapas.push(etapa_atual)
    }
    return etapas
}
async function getCount (model, tag, filtros) {
    return (await getMany(model, tag)).length
}

async function updateProcesso (processo, update) {
    console.log('updating process')
        if (Date.now() < last_request + interval ) return console.log('too quick')
        last_request = Date.now()
        return requestPut(`/etapa/${processo.etapa.Tag}/${processo.etapa.id}`, update)
}
async function nextEtapa (processo, props = {}, options) {
    if (!options?.no_cooldown && Date.now() < last_request + interval) return console.log('too quick')
    last_request = Date.now()
    let meta_processos = await requestGet('/meta/processo/' + processo.Tag)
    let etapa = await requestGet('/etapa/' + processo.idEtapaAtual)
    let meta_etapa_atual = meta_processos.etapas.find(etapa_meta=>etapa_meta.Tag===etapa.Tag)
    let meta_etapa_next = meta_processos.etapas.find(etapa_meta=>etapa_meta.id===meta_etapa_atual.next)
    let dept = await getDept(props.dept ? props.dept : meta_etapa_next.dept)
    const initial_props = {
        finaliza: {
            status: get(user).dept.includes(dept.departamento) ? "fechado" : "em analise",
        }
    }
    if (meta_etapa_next)
        return requestPost(`/processo/${processo.Tag}/${processo.id}/etapa/${meta_etapa_atual.next}`, { ...props, ...initial_props[meta_etapa_next.Tag] })
}

async function addMensagem (processo, mensagem) {
    if (Date.now() < last_request + interval ) return console.log('too quick')
    last_request = Date.now()
    let { anexos } = mensagem;
    delete mensagem.anexos;
    let new_message = await requestPost(`/processo/${processo.Tag}/${processo.id}/etapa/${processo.etapa.Tag}/${processo.etapa.id}/mensagem`, mensagem)
    if (anexos?.length > 0) return Promise.all(anexos.forEach(anexo=>requestPost(`/log/${new_message.Tag}/${new_message.id}/campo/anexo`, anexo)))
    let emails = await getEmailsEnvolvidos(processo);
    let nomeAutor = (await getUser(mensagem.idUsuario).catch(()=>({nome: '[erro obtendo nome]'})))?.nome
    await sendEmail('message', emails, {
        idOS: processo.id,
        nomeAutor,
        mensagem: mensagem.descr,
        tag: processo.Tag,
    });
}

async function deleteMensagem(id) {
    if (Date.now() < last_request + interval ) return console.log('too quick')
    last_request = Date.now()
    return requestDelete(`/mensagem/${id}`)
}