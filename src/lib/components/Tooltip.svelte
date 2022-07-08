<script>
    function updateTooltipPosition (mouseEvent) {
        [tooltipX, tooltipY] = [mouseEvent.clientX+10+'px', mouseEvent.clientY+10+'px']
    }
    let tooltipX, tooltipY;
</script>
<svelte:body on:pointermove={updateTooltipPosition}/>
<div class='anchor'
style="--tooltip-x:{tooltipX};--tooltip-y: {tooltipY}">
	<div class='filled container tooltip'>
		<slot/>
	</div>
</div>
<style>
    .anchor {
        position: fixed;
        width: 0;
        height: 0;
        left: var(--tooltip-x, 50%);
        top: var(--tooltip-y, 50%);
        z-index: 999;
    }
    .tooltip {
        position: absolute;
        color: black;
        padding: 0.5em;
        width: 10em;
        font-size: small;
        transition: opacity 0.2s;
        opacity: 0;
    }
</style>