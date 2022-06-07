<script>
	import { fade } from 'svelte/transition';
	export let tip = "tooltip"
	let div;
	$: rect = div?.getBoundingClientRect() || {top: undefined, left: undefined}
	$: top = `calc(${div?.top} + 0.5em)`
	$: left = `calc(${div?.left} + 3em)`
	$: console.log(top, left)
</script>
<div bind:this={div}>
	<slot/>
	<span
		transition:fade
		style:top
		style:left>
		{tip}
	</span>
</div>
<style>
	div {
		width: fit-content;
	}
	span {
		position: absolute;
		transition: opacity 0.2s;
		padding: 1em;
		background: gray;
		color: #EEE;
		opacity: 0;
	}
	span:after {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 50%;
		margin-left: -0.5em;
		width: 0; height: 0;
		border-bottom: 0.5em solid #000;
		border-right: 0.5em solid transparent;
		border-left: 0.5em solid transparent;
		opacity: 0.8;
	}
	div:hover span {
		opacity: 0.8;
	}
</style>