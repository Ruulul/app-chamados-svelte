<script>
    export let data
    export let page = 1
    export let items_per_page = 10

    $: pages = Math.ceil(data.length/items_per_page)
    $: pages_index = new Array(pages)
    console.log(pages_index)
</script>
{#each data.slice((page - 1) * items_per_page, page * items_per_page) as page}
    <slot name='page' {page}/>
{/each}
<ul>
    {#each pages_index as _, index}
    <li on:click={()=>page=index+1} class:selected={page===(index + 1)}>{index + 1}</li>
    {/each}
</ul>
<style>
    ul {
        display: flex;
        flex-flow: row;
        list-style: none;
        justify-content: space-between;
    }
    li {
        border: solid var(--dark);
        background-color: white;
        padding: 1rem;
        font-size: larger;;
        border-radius: 2em;
        cursor: pointer;
        width: 1em;
        height: 1em;
        text-align: center;
    }
    li.selected {
        background-color: var(--dark);
        color: white;
    }
</style>