<script>
    export let dialog;
    export let title_tag = 2;
    export let title;
</script>
<dialog class='filled container' bind:this={dialog}>
    <svelte:element this={'h' + title_tag} class=title>
        {title}
        <button class='action close button' on:click={()=>dialog.close()}>X</button>
    </svelte:element>
    <slot/>
</dialog>

<style>
    dialog {
        position: relative;
    }
    dialog * > button.close.button {
        position: absolute;
        right: 1em;
        top: 1em;
    }
</style>