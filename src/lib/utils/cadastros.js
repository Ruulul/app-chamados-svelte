import { requestGet, requestPost, requestPut } from "./network";

export {
    post,
    getUnique,
    getMany,
    getOpcoes,
    getDepts,
    getCount,
    updateProcesso,
    addMensagem,
    nextEtapa
}

async function post (model, tag, os) {
    return await requestPost(`/${model}/${tag}`, os)
}
async function getUnique (model, tag, id) {
    return await requestGet(`/${model}/${tag}/` + id).then(data=>(console.log(data), data))
        .catch(console.error)
}
async function getMany (model, tag) {
    return await requestGet(`/${model}/${tag}`).then(data=>(console.log(data),data))
        .catch(console.error)
}
async function getOpcoes (model, tag, campo) {
    let campos = await requestGet(`/meta/${model}/${tag}/campos`)
    return campos.find(({campoMeta})=>campoMeta===campo)?.opcoes || []
}
async function getDepts (tag) {
    let meta = await requestGet(`/meta/etapa/${tag}`)
    return meta.dept ? [meta.dept] : meta.depts
}
async function getCount (model, tag, filtros) {
    return (await getMany(model, tag)).length
}
async function getProcessosPageCount () {}

async function updateProcesso (processo, update) {
        return requestPut(`/processos/${processo.Tag}/${processo.id}/etapas/${processo.etapa.Tag}/${processo.etapa.id}`, update)
}
async function nextEtapa (processo) {
    if (processo.Tag === 'cadastro_produto')
    return requestPost(`/processos/${processo.Tag}/${processo.id}/etapas/4`, {finalizado: false})
}

async function addMensagem (processo, mensagem) {
    return requestPost(`/processos/${processo.Tag}/${processo.id}/etapas/${processo.etapa.Tag}/${processo.etapa.id}/mensagem`, mensagem)
}