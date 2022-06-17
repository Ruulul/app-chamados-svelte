let filial = '0101'
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
 * Configura nova filial para todas as requisições da API
 * @param {string} nova_filial 
 * @returns 
 */
export const set_filial = (nova_filial) => filial = nova_filial

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
 * Faz uma requisição POST para a API, para abrir uma nova O.S.
 * @param {{
 * assunto: string, 
 * anexo: {
 * 	name: string,
 * 	data: string,
 * 	descr: string,
 * },
 * anexos: Array<Object>,
 * }} os 
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
 * Retorna um array das O.S's acessíveis para o usuário atual
 * @returns {Array<Object>}
 */
export async function get_servicos () {
	return requestGet('/servicos/')
			.catch(console.error)
}

/**
 * Obtém as informações de uma O.S. específica
 * @param {Number} id 
 * @returns Ordem de Serviço
 */
export async function get_servico (id) {
	return requestGet('/servico/' + id)
			.catch(console.error)
}

/**
 * Funções de parâmetros
 */
export const config = {
	/**
	 * Obtém os tipos de O.S. da API.
	 * @returns {Array<Object>} Lista de tipos de O.S. no sistema.
	 */
	getTipos: function getTipos () {
		return requestGet('/tipos')
			.catch(console.error)
	},
	/**
	 * Obtém as categorias de O.S. da API.
	 * @returns {Array<Object>} Lista de categorias de O.S. no sistema.
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
	 * @param {{email: string, senha: string}} auth 
	 * @returns 
	 */
	login: function login (auth) {
		let { email, senha } = auth
		let login = { email, senha }
		return requestPost('/login', login).catch(console.error)
	},
	/**
	 * Realiza a desautenticação na API.
	 * @returns 
	 */
	logout: function logout () {
		return requestPost('/logout').catch(console.error)
	},
	/**
	 * Obtém as informações de perfil do usuário autenticado no momento.
	 * @returns {Object} perfil
	 */
	getPerfil:  function getPerfil () {
		return requestGet('/perfil')
				.then(async profile=>{
					let filiais = await requestGet('/all').catch(console.error)
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
 * @returns Recurso requisitado
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
 * @returns
 */
function requestPost(path, body, options={}) {
	return request(path, {	
		...options, 
		method: 'POST',
		body: JSON.stringify(body)
	})	
}

/**
 * Realiza requisições na API.
 * @param {string} path 
 * @param {Object} options 
 * @returns Response
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
 * @returns {Object | string} Response.
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
