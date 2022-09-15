import { user } from "$lib/stores/user";
import { get } from "svelte/store";
import { requestGet, requestPost, requestPut, requestDelete } from "./network";

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
let interval = 1000

async function post (model, tag, os) {
    if (Date.now() < last_request + interval ) return
    last_request = Date.now()
    let { anexos } = os;
    delete os.anexos;
    let processo = await requestPost(`/${model}/${tag}`, os);
    if (anexos) {
        let processoMeta = await requestGet(`/meta/processo/${tag}`)
        let etapaMeta = processoMeta.etapas.find(etapa=>!etapa.prev)
        let etapa = await requestGet(`/processo/${processo.Tag}/${processo.id}/etapa/${etapaMeta.Tag}/${processo.idEtapaAtual}`)
        console.log(etapa)
        let msg = etapa.log[0]
        let model = 'log'
        console.log({etapa, msg, model, tag})
        await Promise.all(anexos.map(anexo=>requestPost(`/${model}/${msg.Tag}/${msg.id}/campo/anexo`, anexo))).catch(console.error);
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
        if (Date.now() < last_request + interval ) return
        last_request = Date.now()
        return requestPut(`/etapa/${processo.etapa.Tag}/${processo.etapa.id}`, update)
}
async function nextEtapa (processo, props) {
    if (Date.now() < last_request + interval ) return
    last_request = Date.now()
    let dept = await getDept(processo.etapa.dept)
    const initial_props = {
        finaliza: {
            status: get(user).dept.map(({departamento})=>departamento).includes(dept.departamento) ? "fechado" : "em analise",
        }
    }
    let meta_processos = await requestGet('/meta/processo/' + processo.Tag)
    let meta_etapa_atual = meta_processos.etapas.find(etapa=>etapa.Tag===processo.etapa.Tag)
    let meta_etapa_next = meta_processos.etapas.find(etapa=>etapa.id===meta_etapa_atual.next)
    if (meta_etapa_next)
        return requestPost(`/processo/${processo.Tag}/${processo.id}/etapa/${meta_etapa_atual.next}`, { ...props, ...initial_props[meta_etapa_next.Tag] })
}

async function addMensagem (processo, mensagem) {
    if (Date.now() < last_request + interval ) return
    last_request = Date.now()
    let { anexos } = mensagem;
    delete mensagem.anexos;
    let new_message = await requestPost(`/processo/${processo.Tag}/${processo.id}/etapa/${processo.etapa.Tag}/${processo.etapa.id}/mensagem`, mensagem)
    if (anexos?.length > 0) return Promise.all(anexos.forEach(anexo=>requestPost(`/log/${new_message.Tag}/${new_message.id}/campo/anexo`, anexo)))
}

async function deleteMensagem(id) {
    if (Date.now() < last_request + interval ) return
    last_request = Date.now()
    return requestDelete(`/mensagem/${id}`)
}