<script>
    export let items
    export let title

    export let content_element = 'ul'
    export let wrap_element = 'div'
    export let wrap = true

    let visible = false;
</script>
{#if wrap}
    <svelte:element this={wrap_element}>
        <label class:selected={visible} class='tab'>
            <input bind:checked={visible} type='checkbox'>
            {title}
        </label>
        <svelte:element this={content_element} class:visible class='tab-content'>
            <slot name='first-items'/>
            {#each items as item}
                <slot name='item' {item}/>
            {/each}
            <slot name='last-items'/>
        </svelte:element>
    </svelte:element>
{:else}
<label class:selected={visible} class='tab'>
    <input bind:checked={visible} type='checkbox'>
    {title}
</label>
    <svelte:element this={content_element} class:visible class='tab-content'>
        <slot name='first-items'/>
        {#each items as item}
            <slot name='item' {item}/>
        {/each}
        <slot name='last-items'/>
    </svelte:element>
{/if}
<style>
    input {
        opacity: 0;
    }
    .tab {
        display: inline-block;
        width: 10em;
        overflow: hidden;
        font-size: 1.3rem;
        border-radius: 1em;
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
    .selected {
        background-color: var(--dark);
        color: white;
    }
</style>