<script>
	export let tip = 'tooltip'
	export let top = 1.2
	export let left = -1.5
</script>
<div>
	<slot/>
	<div 
		style="
		position: relative;
		top:	{top}em;
		left:	{left}em;
		">
		<span>
			{tip}
		</span>
	</div>
</div>
<style>
	* {
		display: flex;
	}
	div {
		width: fit-content;
		flex-flow: column wrap;
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