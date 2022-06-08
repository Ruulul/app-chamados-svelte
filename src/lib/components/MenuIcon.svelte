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
</style>