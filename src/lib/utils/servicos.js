/**
 * @typedef {Object} Mensagem
 * @property {Number} id identificação única da mensagem no banco de dados
 * @property {Number} autorId identificação única do usuário autor da mensagem
 * @property {string} mensagem string contendo a mensagem
 */

/** 
 * @typedef {Object} OS
 * @property {Number} id
 * @property {Number} filialId
 * @property {string} usuarioId
 * @property {string} autorId
 * @property {string} atendenteId
 * @property {string} assunto
 * @property {Array<Mensagem>} chat
 */

import { requestGet, requestPost } from "./network.js"
import { sendEmail } from './email.js'
import { get_user } from "./db.js";

export {
	update_servico,
	add_mensagem,
	get_servico,
    get_servicos,
	get_id_nova_os,
	abrir_os
}

/**
 * Faz uma requisição POST para a API, para abrir uma nova O.S.
 * @param {OS} os 
 */
 async function abrir_os (os) {
	let in_os = {...os}
	delete os.anexos
	let created_os = await requestPost('/novo/servico', in_os)
	for (let anexo in os.anexos)
		try {
			await requestPost(`/update/servico/${created_os.id}/arquivo`, {title: anexo.name, data: anexo.data})
		} catch(e) {
			console.error(e)
		}
}

/**
 * Atualiza a OS com um objeto de atualização parcial.
 * @param {Number} id Id da OS. 
 * @param {Object} update Objeto que possui os parâmetros a serem atualizados 
 * @returns {Promise<OS>} OS atualizada
 */
async function update_servico (id, update) {
	let servico = await get_servico(id)
	for (let [key, value] of Object.entries(update))
		servico[key] = value
	return requestPost('/update/servico/' + id, servico)
		.then(/**@param {OS} os */async os=>{
			const { nome } = await get_user(os.autorId)
			await sendEmail({id: 4, nome})
			return os
		})
		.catch(console.error)
}

/**
 * Adiciona mensagem a uma OS.
 * @param {Number} id id da OS na API.
 * @param {Mensagem} mensagem 
 * @returns {Promise<Mensagem[]>}
 */
async function add_mensagem (id, mensagem) {
	let { chat } = await get_servico(id)
	chat.push(mensagem)
	return update_servico(id, {chat})
		.then(({chat})=>chat)
		.catch(console.error)
}

/**
 * Obtém as informações de uma OS específica
 * @param {Number} id 
 * @returns {Promise<OS>} Ordem de Serviço
 */
 async function get_servico (id) {
	return requestGet('/servico/' + id)
			.catch(console.error)
}


/**
 * Retorna um array das OSs acessíveis para o usuário atual
 * @returns {Promise<Array<OS>>}
 */
 async function get_servicos (filtro = undefined, tipo_filtro = 'status') {
	let path = '/servicos/'
	if (filtro) path += tipo_filtro + '/' + filtro
	return requestGet(path)
			.catch(console.error)
}


/**
 * Obtém o id sequencial da Ordem de Serviço a ser aberta.
 * @returns {Promise<Number>} id nova filial
 */
 async function get_id_nova_os () {
	return requestGet('/monitoring')
			.then(function ({chamados}){
				return chamados.length !== 0 ? chamados.at(-1).id + 1 : 0
			})
			.catch(function (error) {
				console.error(error)
				return 0
			})
}
