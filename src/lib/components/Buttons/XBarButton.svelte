<script>
	export let name
	export let href
	export let option
</script>
<li class={option}><a {href}>{name}</a></li>

<style>
	li {
		list-style-type: none;
	}
	.upBar {
		float: left;
		padding: 1em 2em;
	}
	.sideBar {
		padding: 2em 1em;
	}
	.cornerL {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0.5em 1em;
	}
	.cornerR {
		position: absolute;
		top: 0;
		right: 0;
		margin: 0.5em 1em;
	}
</style>