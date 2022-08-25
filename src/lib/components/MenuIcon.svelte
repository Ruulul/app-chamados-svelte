<script>
	import Fa from 'svelte-fa';
	import { page } from '$app/stores';
	import { 
		faHome as sd_home, 
		faCog as sd_config, 
		faClipboardList as sd_processos, 
		faUser as sd_perfil, 
		faBell as sd_notificacoes,
		faThumbtack as sd_avisos,
		faArrowRight as sd_logout, 
		faUsers as sd_usuarios } from '@fortawesome/free-solid-svg-icons';
	//import { 
	//	faHome as ol_home, 
	//	faCog as ol_config, 
	//	faClipboardList as ol_processos, 
	//	faUser as ol_perfil, 
	//	faBell as ol_notificacoes,
	//	faThumbtack as ol_avisos,
	//	faArrowRight as ol_logout, 
	//	faUsers as ol_usuarios } from '@fortawesome/free-regular-svg-icons';

	export let href
	let icons = {
		home: {
			sd: sd_home,
			ol: sd_home,
		},
		config: {
			sd: sd_config,
			ol: sd_config,
		},
		processos: {
			sd: sd_processos,
			ol: sd_processos,
		},
		notificacoes: {
			sd: sd_notificacoes,
			ol: sd_notificacoes,
		},
		avisos: {
			sd: sd_avisos,
			ol: sd_avisos,
		},
		perfil: {
			sd: sd_perfil,
			ol: sd_perfil,
		},
		logout: {
			sd: sd_logout,
			ol: sd_logout,
		},
		usuarios: {
			sd: sd_usuarios,
			ol: sd_usuarios,
		},
	}
	let icon_src = icons[href == '/' ? 'home' : href.split('/')[1]]
	let is_sd = $page.url.pathname === href
	let icon = is_sd ? icon_src.sd : icon_src.ol
	console.log(`icon ${href} going to be ${is_sd ? 'sd' : 'ol'}`)
</script>
<Fa {icon}
	size='lg'
	fw
	primaryColor="var(--dark)"
	scale='2'
	/>