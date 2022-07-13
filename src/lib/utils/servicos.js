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
import { get_user, filiais_validas } from "./db.js";
import { get } from "svelte/store";

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
	let in_os = {...os, tipo: 'A.D.', subCategoria: 'A.D.', prioridade: 0}
	delete os.anexos
	let created_os = await requestPost('/novo/servico', in_os)
	for (let anexo in os.anexos)
		requestPost(`/update/servico/${created_os.id}/arquivo`, {title: anexo.name, data: anexo.data})
			.then(async (os) => {
				console.log(`Arquivo ${anexo.name} enviado`)
			})
			.catch(()=>console.log(`Arquivo ${anexo.name} falhou no envio`))
	let { email } = await get_user(os.usuarioId || os.autorId)
	return sendEmail('open', [email, email_suporte], {idOS: os.id, assunto : os.assunto})
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
			console.log(os)
			const { nome, email } = await get_user(os.usuarioId || os.autorId)
			const { nome : nomeSuporte, email : emailSuporte } = await get_user(os.atendenteId)
			if (flag) sendEmail(flag, [email, emailSuporte], {idOS: os.id, nome, nomeSuporte, ...update})
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
		.then(async ({ chat, autorId, usuarioId, atendenteId })=>{
			const { nome : nomeUsuario, email : emailUsuario } = await get_user(usuarioId || autorId)
			const { email : emailSuporte } = await get_user(atendenteId)
			const { nome: nomeAutor } = await get_user(mensagem.autorId)
			sendEmail('message', [emailUsuario, emailSuporte], {...mensagem, nome : nomeUsuario, nomeAutor, idOS : id})
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
	let servicos = []
	let filiais = get(filiais_validas);
	let path = '/servicos/'
	if (filtro) path += tipo_filtro + '/' + filtro
	for (let filial of filiais) {
		servicos = [...servicos, ...await requestGet(path, filial)
				.catch(console.error)]
	}
	return servicos
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
