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
    let { anexos } = os;
    delete os.anexos;
    let processo = await requestPost(`/${model}/${tag}`, os);
    if (anexos)
    await Promise.all(anexos.map(anexo=>requestPost(`/${model}/${tag}/${processo.id}/anexo`, anexo))).catch(console.error);
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
        return requestPut(`/processo/${processo.Tag}/${processo.id}/etapa/${processo.etapa.Tag}/${processo.etapa.id}`, update)
}
async function nextEtapa (processo) {
    if (processo.Tag === 'cadastro_produto')
    return requestPost(`/processo/${processo.Tag}/${processo.id}/etapa/4`, {finalizado: false})
}

async function addMensagem (processo, mensagem) {
    return requestPost(`/processo/${processo.Tag}/${processo.id}/etapa/${processo.etapa.Tag}/${processo.etapa.id}/mensagem`, mensagem)
}