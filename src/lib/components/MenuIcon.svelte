<script>
	import { page } from '$app/stores';
	export let href
	let icons = {
		home: 'fa-home',
		config: 'fa-cog',
		processos: 'fa-clipboard-list',
		notificacoes: 'fa-bell',
		avisos: 'fa-thumbtack',
		perfil: 'fa-user',
		logout: 'fa-arrow-right-from-bracket',
		usuarios: 'fa-users',
	}
	let is_home = href === '/'
	let icon_src = icons[is_home ? 'home' : href.split('/')[1]]
	$: is_on = is_home ? $page.url.pathname === href : $page.url.pathname.includes(href)
	$: icon = 'fas ' + icon_src
</script>
<i class={icon + ' fa-2x'} 
	style:color={is_on ? 'var(--dark)' : 'white'}
	style:text-shadow={
		!is_on ?
			'-1px 0 var(--dark), \
			  0 1px var(--dark), \
			  1px 0 var(--dark), \
			 0 -1px var(--dark)' 
		: 'none'}/>