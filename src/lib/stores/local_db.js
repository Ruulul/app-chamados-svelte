import { derived } from 'svelte/store'

import { config, filial } from '$lib/utils/db.js'

let idd
idd = 0
export const tipos_os = derived(filial, function start(_, set) {
	config.getTipos()
		.then(set)
		.catch(console.error)
	return ()=>console.log('Fim dos tipos')
}, [])
idd = 0

/**
 * Categorias para os chamados, derivadas da filial
 */
export const categorias_os = derived(filial, function start(_, set) {
	config.getCategorias()
		.then(set)
		.catch(console.error)
	return ()=>console.log('Fim das categorias')
}, [])
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