<template lang="pug">
    script.
        export let dialog;
        export let title_tag = 2;
        export let title;
    dialog.filled.container(bind:this!='{dialog}')
        svelte:element.title(this!="{'h' + title_tag}") {title}
            button.action.close.button(on:click!='{()=>dialog.close()}') X
        slot
        
</template>
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