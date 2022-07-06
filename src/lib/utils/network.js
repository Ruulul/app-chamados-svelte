

export const origin = 'https://10.0.0.5:5000'
const server = origin + '/api/'//'https://45.177.254.161:5000/api/'
const api =  () => server + filial
import { browser } from '$app/env'
import { filial as filial_store } from './filial.js'
export { requestGet, requestPost }

let filial = '0101'
filial_store.subscribe((value)=>filial=value)

let headers = new Headers([
	['Content-Type', 'application/json'],
])
let init = {
	headers,
	credentials: 'include'
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
