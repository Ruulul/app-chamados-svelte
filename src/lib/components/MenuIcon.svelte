<script>
	export let href
	
	let icon = href == '/' ? 'home' : href.split('/')[1]
	let src = `/menu_icons/${icon}.svg`
</script>

	<img alt="" {src}/>

<style>
	img {
		width: 1.2em;
	}
</style>