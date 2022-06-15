import { readable, writable, derived } from 'svelte/store'
import { config } from '$lib/utils/db.js'
import { browser } from '$app/env'

let idd
idd = 0
export const tipos_os = readable([
	{id: idd++, tipo: 'Infraestrutura'}, 
	{id: idd++, tipo: 'Sistemas'}, 
	{id: idd++, tipo: 'Desenvolvimento'}
], function start(set) {
	config.getTipos()
		.then(set)
		.catch(console.error)
	return ()=>console.log('Fim dos tipos')
})
idd = 0
export const categorias_os = readable([
	{id: idd++, tipo: 'Infraestrutura', categoria: 'Computador'},
	{id: idd++, tipo: 'Infraestrutura', categoria: 'Monitor'},
	{id: idd++, tipo: 'Sistemas', categoria: 'PROTHEUS'},
	{id: idd++, tipo: 'Sistemas', categoria: 'EXCEL'},
	{id: idd++, tipo: 'Desenvolvimento', categoria: 'Relatórios'},
	{id: idd++, tipo: 'Desenvolvimento', categoria: 'Gold Seed'},
], function start(set) {
	config.getCategorias()
		.then(set)
		.catch(console.error)
	return ()=>console.log('Fim das categorias')
})
export const categorias_por_tipo_os = derived(
	[tipos_os, categorias_os],
	([$tipos_os, $categorias_os])=>{
		let tipos = $tipos_os.map(({tipo})=>tipo)
		let categorias = $categorias_os
		let cat_tipo = {}
		for (let tipo of tipos) 
			cat_tipo[tipo] = categorias.filter(categoria=>categoria.tipo===tipo).map(({categoria})=>categoria)
		return cat_tipo
	}
)