<script>
	export let name
	export let href
	export let option
</script>
<li class={option}><a {href}>{name}</a></li>

<style>
	li {
		list-style-type: none;
		width: 6em;
		place-self: center;
		padding: 0.5em 1em;
		border: 
			hsl(100, 50%, 50%)
			solid;
	}
	.upBar {
		float: left;
		margin: 1em 2em;
		border-style: outset;
	}
	.sideBar {
		margin: 2em 1em;
		border-style: inset;
	}
	.cornerL {
		position: absolute;
		top: 0;
		left: 0;
		margin: 1.5em 2em;
	}
	.cornerR {
		position: absolute;
		top: 0;
		right: 0;
		margin: 1.5em 2em;
	}
</style>