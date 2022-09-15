<script>
    export let data
    export let page = 1
    export let items_per_page = 10

    $: pages = Math.ceil(data.length/items_per_page)
    $: down = page > 1
    $: up = page < pages
    $: if (page < 1 || page > pages) {
        if (page < 1) page = 1
        else if (page > pages) page = pages
    }
</script>
{#each data.slice((page - 1) * items_per_page, page * items_per_page) as page}
    <slot name='page' {page}/>
{/each}
<div>
    <i on:click={()=>down ? page-- : page = pages} class='fas fa-arrow-left' class:last={pages > 1 && !down} class:disabled={pages===1}/>
    <span>{page}</span>
    <i on:click={()=>up ? page++ : page = 1} class='fas fa-arrow-right' class:last={pages > 1 && !up} class:disabled={pages===1}/>
</div>
<style>
    div {
        display: flex;
        gap: 2em;
        flex-flow: row;
        list-style: none;
        justify-content: space-between;
        margin-top: 2em;
    }
    i, span {
        border: solid var(--dark);
        background-color: white;
        padding: 1rem;
        font-size: larger;;
        border-radius: 2em;
        width: 1em;
        height: 1em;
        text-align: center;
    }
    i {
        cursor: pointer;
    }
    i.last,
    i.disabled {
        opacity: 0.5;
        cursor: auto;
    }
    span {
        background-color: var(--dark);
        color: white;
    }
</style>
<!--
    i.last {
        background-color: blue;
        color: white;
        border: solid white;
    }
-->