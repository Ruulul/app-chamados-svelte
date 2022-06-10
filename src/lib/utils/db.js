let filial = '0101'
let server = 'https://10.0.0.5:5000/api/'
let api =  () => server + filial

let headers = new Headers([
	['Content-Type', 'application/json'],
])
let init = {
	headers,
	credentials: 'include'
}
export const set_filial = (nova_filial) => filial = nova_filial
export async function get_id_nova_os () {
	return fetch(api() + '/monitoring')
		.then(handleResponse)
		.then(function ({chamados}){
			return chamados.length !== 0 ? chamados.at(-1).id + 1 : 0
		})
		.catch(function (error) {
			console.error(error)
			return 0
		})
}
export async function abrir_os (os) {return}
export const auth = {
	login: function login (auth) {
		let { email, senha } = auth
		let login = { email, senha }
		return fetch(api() + '/login', {
			...init,
			method: 'POST',
			body: JSON.stringify(login)
		}).then(handleResponse).catch(console.error)
	},
	logout: function logout () {
		return fetch(api() + '/logout', {
			...init,
			method: 'POST'
		}).catch(console.error)
	},
	getPerfil:  function getPerfil () {
		return fetch(api() + '/perfil', init)
			.then(handleResponse)
			.catch(console.error)
	}
}

async function handleResponse (response) {
	let text = await response.text()
	let [parsable, parse] = isParsable(text)
	if (parsable)
		return parse
	else return text
	
	function isParsable (text) {
		try {
			let parse = JSON.parse(text)
			return [true, parse]
		} catch (e) {
			console.log(e)
			return [false]
		}
	}
}