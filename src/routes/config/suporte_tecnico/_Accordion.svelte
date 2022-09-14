<script>
    export let items
    export let title

    let visible = false;
</script>
<div class='tab'>
    <label class='tab'>
        <input bind:checked={visible} type='checkbox'>
        {title}
    </label>
    <ul class:visible class='tab-content'>
        <slot name='first-items'/>
        {#each items as item}
            <slot name='item' {item}/>
        {/each}
        <slot name='last-items'/>
    </ul>
</div>
<style>
    input {
        opacity: 0;
    }
    .tab {
        display: block;
        overflow: hidden;
        font-size: larger;
        border-radius: 1em;
        padding: 0.5em;
        cursor: pointer;
    }
    .tab-content {
        overflow: hidden;
        max-height: 0;
        transition: all 1s;
    }
    .visible {
        max-height: 100vh;
    }
    ul {
        list-style: none;
        padding: 0;
    }
</style>