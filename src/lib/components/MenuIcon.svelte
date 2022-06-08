<script>
	export let href
	export let name = ""
	
	let icon = href == '/' ? 'home' : href.split('/')[1]
	let src = `/menu_icons/${icon}.svg`
</script>

	<img alt="{name}" {src}/>

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
			outset;
		border-radius: 40% 40% 0 0;
		place-content: center;
		display: grid;
		margin: auto
	}
	.upBar {
		margin: 1em 2em;
		width: 1.5em;
	}
	.sideBar {
		margin: 1em;
		border: none;
	}
</style>