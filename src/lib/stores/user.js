import { get, writable } from 'svelte/store'
import { auth, getUser } from '$lib/utils/db.js'
import { filial, filiais_validas_por_id } from '$lib/utils/filial'
import { sleep } from '$lib/utils/utils';

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
		pool: [],
		getted: [],
		lock: false,
		async add(id) {
			if (this.lock) {
				console.log(`${id}: process locked, awaiting...`);
				while(this.lock) await sleep(Math.random() * 1000);
				console.log(`${id}: process unlocked!`);
			}
			this.lock = true;
			console.log(`${id}: going to add`)
			if (this.pool.includes[id] || this.getted[id]) {
				console.log(`${id}: already pooled/added`)
				this.lock = false;
			}
			console.log(`${id}: it hasnt been pooled or added yet`)
			this.pool.push(id)
			console.log(`${id}: pooled`)
			await getUser(id)
				.then(user=>{
					update(state=>(state[id]=user.nome, state))
					this.pool = this.pool.filter(i=>i!==id)
					this.getted.push(id)
					console.log(`${id}: added`)
					this.lock = false;
				})
				.catch(console.log);
		}
	}
}