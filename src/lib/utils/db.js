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
 * @property {string} assunto
 * @property {Array<Mensagem>} chat
 */
/** 
 * @typedef {Object} Categoria
 * @property {Number} id
 * @property {Number} filialId
 * @property {string} tipo
 * @property {string} categoria
 */
/** 
 * @typedef {Object} AuthData
 * @property {string} email
 * @property {string} senha
 */ 
/** 
 * @typedef {Object} PerfilData
 * @property {Number} id
 * @property {Number} filialId
 * @property {string} nome
 * @property {string} email
 * @property {Array<string>} filiais
 * @property {Array<string>} dept
 */

/**
 * @typedef {Object} Store
 * @property {SubscribeStore} subscribe
 * @property {Function} set
 * @typedef {Function} SubscribeStore
 * @param {Function} subscription
 * @returns {Function} unsubscribe
 */

import { converteDateToISO } from './utils.js'

let filial = '0101'
let filiais_validas = [filial]
let server = 'https://10.0.0.5:5000/api/'//'https://45.177.254.161:5000/api/'
let api =  () => server + filial
import { browser } from '$app/env'

let headers = new Headers([
	['Content-Type', 'application/json'],
])
let init = {
	headers,
	credentials: 'include'
}

/**
 * Store (padrão Observer) que mantém sincronizado as informações atuais da filial,
 * permitindo reatividade assim que ela muda, para quando há valores que dependem disso
 */
const filial_store = {
	/**@type {Array<Function>} Lista de Observers*/
	observers: [],
	/**Adiciona inscrição aos Observers
	 * @param {SubscribeStore} subscription Inscrição. Executar essa função atualiza o Observer.
	 * @returns {Function} Desfazer inscrição. Remove da lista de Observers.
	 */
	subscribe: function (subscription) {
		subscription(filial);
		this.observers.push(subscription)
		return ()=>this.observers.filter(sub=>sub!==subscription)
	},
	/**Notifica todos os Observers registrado */
	notify: function () {
		this.observers.forEach(subscription=>subscription(filial))
	},
	setFilial: function (nova_filial) {
		if (!filiais_validas.includes(nova_filial))
			return;
		filial = nova_filial;
		this.notify();
	}
}

/**
 * @type {Store}
 */
const filial_store_interface = {
	subscribe: filial_store.subscribe.bind(filial_store), 
	set: filial_store.setFilial.bind(filial_store)
}

export {filial_store_interface as filial}
/**
 * Obtém o id sequencial da Ordem de Serviço a ser aberta.
 * @returns {Number} id nova filial
 */
export async function get_id_nova_os () {
	return requestGet('/monitoring')
			.then(function ({chamados}){
				return chamados.length !== 0 ? chamados.at(-1).id + 1 : 0
			})
			.catch(function (error) {
				console.error(error)
				return 0
			})
}

export function get_monitoring () {
	return requestGet('/monitoring')
		.then(async function ({chamados, atendentes}) {
			let response = []
			let hojeOSI = converteDateToISO(Date())
			let date_7daysOSI = converteDateToISO(new Date(Date.now()-6.048e8).toString())
			console.log(hojeOSI, date_7daysOSI)
			for (let atendente of atendentes) {
				console.log(atendente)
				let { id, nome } = atendente
				let chamados_atendente = chamados.filter(({atendenteId})=>atendenteId==id)
				let chamados_pendentes = chamados_atendente.filter(({status})=>status==='pendente')
				let atendendo = chamados_pendentes.filter(({atendimento})=>atendimento==='true').length
				let atendido_hoje = chamados_atendente.filter(({fechado_em})=>fechado_em?.split('T')[0]===hojeOSI).length
				let atendido_semana = chamados_atendente.filter(({fechado_em})=>fechado_em?.split('T')[0]>=date_7daysOSI).length
				let atendente_monitoring = {
					id,
					nome,
					atendendo,
					atendido_hoje,
					atendido_semana
				}
				response.push(atendente_monitoring)
			}
			return response
		})


}

/**
 * pega da API um arquivo pelo nome
 * @param {string} filename 
 * @returns {Promise<string>} base64url do arquivo
 */
export async function get_file (filename) {
	return requestGet('/files/' + filename)
		.catch(console.error)
}

/**
 * Pega da API um usuário pelo Id
 * @param {Number} id 
 * @returns {Promise} Usuário pelo id
 */
export async function get_user (id) {
	return requestGet('/usuario/' + id)
		.catch(console.error)
}

/**
 * Faz uma requisição POST para a API, para abrir uma nova O.S.
 * @param {OS} os 
 */
export async function abrir_os (os) {
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
 * Retorna um array das {@link OS}s acessíveis para o usuário atual
 * @returns {Promise<Array<OS>>}
 */
export async function get_servicos (filtro = undefined, tipo_filtro = 'status') {
	let path = '/servicos/'
	if (filtro) path += tipo_filtro + '/' + filtro
	return requestGet(path)
			.catch(console.error)
}

/**
 * Obtém as informações de uma {@link OS} específica
 * @param {Number} id 
 * @returns {Promise<OS>} Ordem de Serviço
 */
export async function get_servico (id) {
	return requestGet('/servico/' + id)
			.catch(console.error)
}

export async function update_servico (id, update) {
	let servico = await get_servico(id)
	for (let [key, value] of Object.entries(update))
		servico[key] = value
	return requestPost('/update/servico/' + id, servico)
		.catch(console.error)
}

/**
 * Funções de parâmetros
 */
export const config = {
	/**
	 * Obtém os tipos de {@link OS} da API.
	 * @returns {Promise<Array<OS>>} Lista de tipos de {@link OS} no sistema.
	 */
	getTipos: function getTipos () {
		return requestGet('/tipos')
			.catch(console.error)
	},
	/**
	 * Obtém as categorias de {@link OS} da API.
	 * @returns {Promise<Array<Categoria>>} Lista de categorias de {@link OS} no sistema.
	 */
	getCategorias: function getCategorias () {
		return requestGet('/servicos/categorias')
			.catch(console.error)
	}
}

/**
 * Funções de autenticação
 */
export const auth = {
	/**
	 * Realiza a autenticação na API.
	 * @param {AuthData} auth 
	 * @returns 
	 */
	login: function login (auth) {
		return requestPost('/login', auth).catch(console.error)
	},
	/**
	 * Realiza a desautenticação na API.
	 * @returns 
	 */
	logout: function logout () {
		return requestPost('/logout').catch(console.error)
	},
	/**
	 * Obtém as informações de {@link PerfilData perfil} do usuário autenticado no momento.
	 * @returns {PerfilData} perfil
	 */
	getPerfil:  function getPerfil () {
		return requestGet('/perfil')
				.then(async profile=>{
					let filiais = await requestGet('/all').catch(console.error)
					filiais_validas = Array.isArray(filiais) ? filiais.map(filial=>filial.codigo) : [filial]
					filial = Array.isArray(filiais) ? filiais.find(filial=>filial.id===profile.filialId).codigo : filial
					return profile
				})
				.catch(console.error)
	}
}

/**
 * Realiza requisições GET na API.
 * @param {string} path 
 * @param {Object} options 
 * @returns {Promise<any>} Recurso requisitado
 */
function requestGet(path, options={}) {
	return request(path, {	
		...options, 
		method: 'GET'
	})
}

/**
 * Realiza requisições POST na API.
 * @param {string} path 
 * @param {Object} options 
 * @returns {Promise}
 */
function requestPost(path, body, options={}) {
	return request(path, {	
		...options, 
		method: 'POST',
		body: JSON.stringify(body)
	})	
}

/**
 * Realiza requisições na API e trata o Response.
 * @param {string} path 
 * @param {Object} options 
 * @returns {Promise}
 */
function request(path, options={}) {
	return browser ? fetch(api() + path, {
		...init,
		...options
	}).then(handleResponse) : Promise.resolve(null)
}

/**
 * Lida com a resposta de uma requisição Fetch, 
 * retornando o JSON se for possível, ou texto se não.
 * @param {Response} response 
 * @returns {Promise<Object | string>} Response.
 */
async function handleResponse (response) {
	let text = await response.text()
	let maybeParsed = parseIfParsable(text)
	return maybeParsed
	
	function parseIfParsable (text) {
		try {
			let parse = JSON.parse(text)
			return parse
		} catch (e) {
			return text
		}
	}
}
