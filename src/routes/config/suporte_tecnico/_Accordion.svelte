<script>
    export let items
    export let title = ''

    export let wrap = true

    let visible = false;
</script>
<template lang=pug>
    mixin template
        label.tab.button(class:action!='{visible}')
            input(bind:checked!='{visible}' type='checkbox')
            | {title}
            slot(name='title')
        ul.tab-content(class:visible)
            slot(name='first-items')
            +each('items as item')
                slot(name='item' '{item}')
            slot(name='last-items')
    +if('wrap')
        div
            +template
        +else()
            +template
</template>
<style>
    input {
        opacity: 0;
    }
    .tab {
        display: inline-block;
        min-width: 10em;
        max-width: fit-content;
        overflow: hidden;
        font-size: 1.3rem;
        border-radius: 1em;
        border: var(--dark);
        padding: 0.5em;
        cursor: pointer;
    }
    .tab-content {
        overflow: hidden;
        max-height: 0;
        transition: all 0.5s;
    }
    .visible {
        max-height: 100vh;
    }
</style>