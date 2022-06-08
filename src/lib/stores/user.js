import { writable } from 'svelte/store'

function createUser() {
	const { subscribe, set, update } = writable({id: 5, nome: 'Teste'});
	
	return {
		subscribe,
		// Futuramente inserir métodos próprios aqui
	}
}
export const user = createUser()