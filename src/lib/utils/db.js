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
import { filiais_validas_por_id, setFiliaisValidas, setFilial } from './filial.js'

export { filial, filiais_validas, filiais_validas_por_id } from './filial.js'

export {
	auth,
	config,
	getFile,
	getMonitoring,
	getUser
}

/**
 * Funções de parâmetros
 */
const config = {
	/**
	 * Obtém os tipos de {@link OS} da API.
	 * @returns {Promise<Array<OS>>} Lista de tipos de {@link OS} no sistema.
	 */
	 getTipos () {
		return requestGet('/tipos', )
			.catch(console.error)
	},
	/**
	 * Obtém as categorias de {@link OS} da API.
	 * @returns {Promise<Array<Categoria>>} Lista de categorias de {@link OS} no sistema.
	 */
	 getCategorias () {
		return requestGet('/servicos/categorias')
			.catch(console.error)
	}
}

/**
 * Funções de autenticação
 */
const auth = {
	/**
	 * Realiza a autenticação na API.
	 * @param {AuthData} auth 
	 * @returns 
	 */
	login (auth) {
		return requestPost('/login', auth).catch(console.error)
	},
	/**
	 * Realiza a desautenticação na API.
	 * @returns 
	 */
	logout () {
		return requestPost('/logout').catch(console.error)
	},
	/**
	 * Obtém as informações de {@link PerfilData perfil} do usuário autenticado no momento.
	 * @returns {PerfilData} perfil
	 */
	getPerfil () {
		return requestGet('/perfil')
				.then(async profile=>{
					let filiais = await requestGet('/all').catch(console.error)
					if(Array.isArray(filiais)){
						setFiliaisValidas(filiais.map(filial=>filial.codigo))
						filiais_validas_por_id.set(filiais.map(filial=>[filial.id, filial.codigo]))
						setFilial(filiais[0].codigo)
					} 
					return profile
				})
				.catch(console.error)
	}
}


async function getMonitoring () {
	return requestGet('/monitoring')
		.then(async function ({chamados, atendentes}) {
			let response = []
			let hojeOSI = converteDateToISO(Date())
			let date_7daysOSI = converteDateToISO(new Date(Date.now()-6.048e8).toString())
			for (let atendente of atendentes) {
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
async function getFile (filename) {
	return requestGet('/files/' + filename)
		.catch(console.error)
}

/**
 * Pega da API um usuário pelo Id
 * @param {Number | string} id Id válida de usuário
 * @returns {Promise} Usuário pelo id
 */
async function getUser (id) {
	return requestGet('/usuario/' + id)
		.catch(console.error)
}
