<script>
	import Tooltip from '$lib/components/Tooltip.svelte'
	export let name
	export let href
	export let option
	
	let icon = href == '/' ? 'home' : href.split('/')[1]
	let src = `/menu_icons/${icon}.svg`
</script>
<Tooltip class={option} tip={name}>
	<li class={option}>
		<a {href}>
			<img {src}/>
		</a>
	</li>
</Tooltip>

<style>
	img {
		width: 1.2em;
	}
	li {
		list-style-type: none;
		width: 1em;
		place-self: center;
		padding: 0.5em;
		border: 
			hsl(100, 50%, 50%)
			solid;
		place-content: center;
		display: grid;
		margin: auto
	}
	.upBar {
		float: left;
		margin: 1em 2em;
		width: 1.5em;
		border-style: outset;
	}
	.sideBar {
		margin: 0.5em 2em;
		border-style: inset;
	}
	.cornerL {
		place-self: left;
	}
	.cornerR {
		place-self: right;
	}
</style>