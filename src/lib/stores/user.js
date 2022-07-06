import { writable } from 'svelte/store'
import { auth } from '$lib/utils/db.js'

function createUser() {
	function trackable_promise() {
		let resolve, reject;
		const promise = new Promise((res, rej)=>{
			resolve = res
			reject = rej
		})
		return { promise, resolve, reject }
	}
	const { promise, resolve, reject } = trackable_promise()
	const { subscribe, set, update } = writable(
		promise,
		function start(set) {
			try {
				auth.getPerfil()
					.then(function(data){
						let perfil = data === 'Não autorizado'
						? null
						: data
						resolve(perfil)
						set(perfil)
					})
			} catch (e) {
				console.error(e)
				reject(null)
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
				if (res.error){
					set(null)
					return res
				}
				else
				return await auth.getPerfil()
					.then(function(perfil){
						set(
							perfil === 'Não autorizado'
								? null
								: perfil)
						return perfil
					})
			} catch(e) {
				console.log(e);
				return e
			}
		}
	}
}
export const user = createUser()