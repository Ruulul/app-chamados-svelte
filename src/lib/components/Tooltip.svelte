<script>
	export let tip = "tooltip"
	let div;
	$: rect = div?.getBoundingClientRect() || {top: undefined, left: undefined}
</script>
<div bind:this={div}>
	<slot/>
	<span
		style:top={div?.top}
		style:left={div?.left}>
		{tip}
	</span>
</div>
<style>
	div {
		width: fit-content;
	}
	span {
		position: absolute;
		visibility: hidden;
	}
	div:hover span {
		visibility: visible;
	}
</style>