<script>
	import Fa from 'svelte-fa';
	import { faHome as home, faCog as config, faList as servicos, faUser as perfil, faArrowRight as logout, faUsers as usuarios } from '@fortawesome/free-solid-svg-icons';
	//import * as faIcons from '@fortawesome/free-solid-svg-icons/index.es';
	//let { faHome : home, faGear : config, faList : servicos, faUser : perfil, faArrowRightFromBracket : logout, faUsers : usuarios } = faIcons;
	
	export let href
	let icons = {
		home,
		config,
		servicos,
		perfil,
		logout,
		usuarios
	}
	let icon = icons[href == '/' ? 'home' : href.split('/')[1]]
</script>
<Fa {icon}
	size='lg'
	fw
	primaryColor="var(--dark)"
	scale='2'
	/>