import { get, writable } from 'svelte/store'
import { auth, getUser } from '$lib/utils/db.js'
import { filial, filiais_validas_por_id } from '$lib/utils/filial'

function createUser() {
	const { subscribe, set, update } = writable(
		undefined,
		function start(set) {
			try {
				auth.getPerfil()
					.then(function(data){
						let perfil = data === 'Não autorizado'
						? null
						: data

						let unsub = filial.subscribe(()=>{})
						if (perfil) {
							filial.set(get(filiais_validas_por_id)[perfil.filialId])
							set(perfil)
						} else set(null)
						unsub()
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

export const user_names = createUserNames()

function createUserNames () {
	const { subscribe, set, update } = writable({})
	return {
		subscribe,
		add(id) {
			if (get({subscribe})[id])
				return;
			getUser(id).then(user=>update(state=>(state[id]=user.nome, state))).catch(console.log);
		}
	}
}