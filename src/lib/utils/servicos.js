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
import { getUser, filiais_validas } from "./db.js";
import { get } from "svelte/store";

export {
	updateServico,
	addMensagem,
	getServico,
    getServicos,
	getIdNovaOs,
	abrirOs,
	getPrazo
}

async function getPrazo(prioridade, createdAt) {
	let data = createdAt ? new Date(createdAt) : new Date();
	switch (parseInt(prioridade)) {
	  case 1:
		data.setDate(data.getDate()+7)
	  case 2:
		data.setDate(data.getDate()+3)
	  case 3:
		data.setDate(data.getDate()+1)
	  default:
		data = new Date(data.getTime()+28800000)
	}
	return data.toISOString();
  }
/**
 * Faz uma requisição POST para a API, para abrir uma nova O.S.
 * @param {OS} os 
 */
 async function abrirOs (os) {
	os = {...os, tipo: 'A.D.', subCategoria: 'A.D.', prioridade: 0, prazo: await getPrazo(os.prioridade)}
	let { anexos } = os;
	delete os.anexos
	let created_os = await requestPost('/novo/servico', os)
	for (let anexo of anexos){
		requestPost(`/update/servico/${created_os.id}/arquivo`, anexo)
			.then(async (os) => {
				console.log(`Arquivo ${anexo.title} enviado para chamado ${created_os.id}`)
			})
			.catch(()=>console.log(`Arquivo ${anexo.title} falhou no envio`))
	}
	let { email } = await getUser(os.usuarioId || os.autorId)
	return sendEmail('open', [email, email_suporte], {idOS: created_os.id, assunto : os.assunto})
}

/**
 * Atualiza a OS com um objeto de atualização parcial.
 * @param {Number} id Id da OS. 
 * @param {Object} update Objeto que possui os parâmetros a serem atualizados 
 * @returns {Promise<OS>} OS atualizada
 */
async function updateServico (id, update, flag) {
	let servico = await getServico(id)
	for (let [key, value] of Object.entries(update))
		servico[key] = value
	return requestPost('/update/servico/' + id, servico)
		.then(/**@param {OS} os */async os=>{
			console.log(os)
			const { nome, email } = await getUser(os.usuarioId || os.autorId)
			const { nome : nomeSuporte, email : emailSuporte } = await getUser(os.atendenteId)
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
async function addMensagem (id, mensagem) {
	let { chat } = await getServico(id)
	let { anexo } = mensagem;
	delete mensagem.anexo;
	chat.push(mensagem);
	return updateServico(id, { chat })
		.then(async ({ chat, autorId, usuarioId, atendenteId })=>{
			if (anexo) {
				console.log(mensagem)
				console.log(chat)
				let { id : mensagem_id, chamadoId: chamado_id } = chat.at(-1);
				console.log(id)
				requestPost(`/update/mensagem/${mensagem_id}/arquivo`, anexo)
					.then(()=>console.log(`Anexo no chamado ${chamado_id} na mensagem ${mensagem_id} salvo com sucesso`))
			}
			const { nome : nomeUsuario, email : emailUsuario } = await getUser(usuarioId || autorId)
			const { email : emailSuporte } = await getUser(atendenteId)
			const { nome: nomeAutor } = await getUser(mensagem.autorId)
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
 async function getServico (id) {
	return requestGet('/servico/' + id)
			.catch(console.error)
}


/**
 * Retorna um array das OSs acessíveis para o usuário atual
 * @returns {Promise<Array<OS>>}
 */
 async function getServicos (filtro = undefined, tipo_filtro = 'status') {
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
 async function getIdNovaOs () {
	return requestGet('/monitoring')
			.then(function ({chamados}){
				return chamados.length !== 0 ? chamados.at(-1).id + 1 : 0
			})
			.catch(function (error) {
				console.error(error)
				return 0
			})
}
