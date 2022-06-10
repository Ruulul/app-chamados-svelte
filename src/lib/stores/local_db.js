import { readable, writable, derived } from 'svelte/store'

let idd
idd = 0
export const tipos_os = readable([
	{id: idd++, tipo: 'Infraestrutura'}, 
	{id: idd++, tipo: 'Sistemas'}, 
	{id: idd++, tipo: 'Desenvolvimento'}
])
idd = 0
const categorias_os = readable([
	{id: idd++, tipo: 'Infraestrutura', categoria: 'Computador'},
	{id: idd++, tipo: 'Infraestrutura', categoria: 'Monitor'},
	{id: idd++, tipo: 'Sistemas', categoria: 'PROTHEUS'},
	{id: idd++, tipo: 'Sistemas', categoria: 'EXCEL'},
	{id: idd++, tipo: 'Desenvolvimento', categoria: 'Relatórios'},
	{id: idd++, tipo: 'Desenvolvimento', categoria: 'Gold Seed'},
])
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