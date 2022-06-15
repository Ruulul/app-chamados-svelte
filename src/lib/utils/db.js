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
export const set_filial = (nova_filial) => filial = nova_filial
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

export async function get_file (filename) {
	return requestGet('/files/' + filename)
		.catch(console.error)
}

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
export async function get_servicos () {
	return requestGet('/servicos/')
			.catch(console.error)
}
export async function get_servico (id) {
	return requestGet('/servico/' + id)
			.catch(console.error)
}
export const config = {
	getTipos: function getTipos () {
		return requestGet('/tipos')
			.catch(console.error)
	},
	getCategorias: function getCategorias () {
		return requestGet('/servicos/categorias')
			.catch(console.error)
	}
}
export const auth = {
	login: function login (auth) {
		let { email, senha } = auth
		let login = { email, senha }
		return requestPost('/login', login).catch(console.error)
	},
	logout: function logout () {
		return requestPost('/logout').catch(console.error)
	},
	getPerfil:  function getPerfil () {
		return requestGet('/perfil')
				.then(async profile=>{
					let filiais = await requestGet('/all').catch(console.error)
					filial = filiais.find(filial=>filial.id===profile.filialId).codigo
					return profile
				})
				.catch(console.error)
	}
}

function requestGet(path, options={}) {
	return request(path, {	
		...options, 
		method: 'GET'
	})
}

function requestPost(path, body, options={}) {
	return request(path, {	
		...options, 
		method: 'POST',
		body
	})	
}

function request(path, options={}) {
	return browser ? fetch(api() + path, {
		...init,
		...options
	}).then(handleResponse) : Promise.resolve('')
}

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
