<script>
	import Fa from 'svelte-fa';
	import { faHome, faGear, faList, faUser, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
	export let href
	let icon
	//let icon = href == '/' ? 'home' : href.split('/')[1]
	//let src = `/menu_icons/${icon}.svg`

	switch (href == '/' ? 'home' : href.split('/')[1]) {
		case 'home':
			icon = faHome;
			break;
		case 'config':
			icon = faGear;
			break;
		case 'logout':
			icon = faArrowRightFromBracket;
			break;
		case 'perfil':
			icon = faUser;
			break;
		case 'servicos':
			icon = faList;
			break;
		default:
			console.log("hmmm... not supposed to happen")

	}
</script>
<Fa {icon}
	size='lg'
	fw
	primaryColor="var(--dark)"
	scale='1.2'
	/>