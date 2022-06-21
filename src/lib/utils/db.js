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
 * @typedef {Object} Categoria
 * @property {Number} id
 * @property {Number} filialId
 * @property {string} tipo
 * @property {string} categoria
 */

import { converteDateToISO } from './utils.js'
import { requestGet, requestPost } from './network.js'
import { setFiliaisValidas, setFilial } from './filial.js'

export { filial } from './filial.js'

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
					if(Array.isArray(filiais)){
						setFiliaisValidas(filiais.map(filial=>filial.codigo))
						setFilial(filiais[0].codigo)
					} 
					return profile
				})
				.catch(console.error)
	}
}
