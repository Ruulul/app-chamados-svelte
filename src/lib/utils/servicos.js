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
import { sendEmail, email_suporte } from './email.js'
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
				.then(async (os) => {
					let { email } = await get_user(os.autorId)
					return sendEmail('open', [email, email_suporte], {idOS: os.id})
				})
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
async function update_servico (id, update, flag) {
	let servico = await get_servico(id)
	for (let [key, value] of Object.entries(update))
		servico[key] = value
	return requestPost('/update/servico/' + id, servico)
		.then(/**@param {OS} os */async os=>{
			const { email } = await get_user(os.autorId)
			const { email : emailSuporte } = await get_user(os.suporteId)
			if (flag) sendEmail(flag, [email, emailSuporte], {idOS: os.id, ...update})
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
	return update_servico(id, { chat })
		.then(({ chat, autorId, suporteId })=>{
			const { email : emailUsuario } = await get_user(autorId)
			const { email : emailSuporte } = await get_user(suporteId)
			sendEmail('message', [emailUsuario, emailSuporte])
			return chat
		})
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
