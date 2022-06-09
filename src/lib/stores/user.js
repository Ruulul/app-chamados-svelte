import { writable } from 'svelte/store'
import { auth } from '$lib/utils/db.js'

function createUser() {
	const { subscribe, set, update } = writable(
		new Promise(function(){}),
		function start(set) {
			try {
				auth.getPerfil()
					.then(function(perfil){
						set(
							perfil === 'Não autorizado'
								? null
								: perfil)
					})
			} catch (e) {
				console.error(e)
				set(null)
			}
		}
	);
	
	return {
		subscribe,
		logout: async function(){
			try {
				await auth.logout()
				set(null)
			} catch(e) {
				console.error(e);
			}
		},
		login: async function(user) {
			try {
				let res = await auth.login(user)
				if (!res.error)
					set(res)
				else set(null)
				return res
			} catch(e) {
				console.log(e);
				return e
			}
		}
	}
}
export const user = createUser()