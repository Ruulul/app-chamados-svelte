<script>
    export let data
    export let page = 1
    export let items_per_page = 10
    export let ellipsis_threshold = 3
    export let columns_count

    $: pages = Math.ceil(data.length/items_per_page)
    $: down = page > 1
    $: up = page < pages
    $: if (page < 1 || page > pages) {
        if (page < 1) page = 1
        else if (page > pages) page = pages
    }
    /** @type {'no-ellipsis' | 'no-left-ellipsis' | 'no-right-ellipsis' | 'all-ellipsis'} */
    $: state =
        pages <= ellipsis_threshold + 1
            ? 'no-ellipsis'
        : page <= ellipsis_threshold + 1
            ? 'no-left-ellipsis'
        : page >= pages - ellipsis_threshold
            ? 'no-right-ellipsis'
        : 'all-ellipsis'
    $: console.log(state)
    let pages_index = []
    $: pages_index = new Array(ellipsis_threshold + 2).fill(undefined)
    $: page, pages_index = pages_index.map((_, i)=>i + 1);
    $: switch (state) {
        case 'all-ellipsis':
            pages_index = pages_index.map(i=>i + page - ellipsis_threshold)
            pages_index[pages_index.length - 1] = undefined;
            pages_index[0] = undefined;
        case 'no-ellipsis':
            break;
        case 'no-right-ellipsis':
            pages_index = pages_index.map(i=>i - 2 + pages - ellipsis_threshold)
            pages_index[0] = undefined;
            break;
        case 'no-left-ellipsis':
            pages_index[pages_index.length - 1] = undefined;
            break;
    }
</script>
{#each data.slice((page - 1) * items_per_page, page * items_per_page) as page}
    <slot name='page' {page}/>
{/each}
<tr class='outer'>
    <td colspan={columns_count - 1}>
        <div class=inner>
            <i on:click={()=>down ? page-- : undefined} 
                class='fas fa-chevron-left'  
                class:disabled={!down}/>
            <span class=number class:hidden={!(state === 'no-right-ellipsis' || state === 'all-ellipsis')} on:click={()=>page=1}>1</span>
                {#each pages_index.slice(0, ellipsis_threshold + 2 > pages ? pages : ellipsis_threshold + 2) as index}
                    <span class='number' class:hidden={!index} class:selected={page===index} on:click={()=>page=index}>{index}</span>
                    <i class:hidden={index} class="fas fa-ellipsis"/>
                {/each}
            <span class=number class:hidden={!(state === 'no-left-ellipsis' || state === 'all-ellipsis')} on:click={()=>page=pages}>{pages}</span>
            <i on:click={()=>up ? page++ : undefined} 
                class='fas fa-chevron-right'
                class:disabled={!up}/>
        </div>
    </td>
    <td>{data.length} items</td>
</tr>
<style>
    .hidden {
        display: none;
    }
    .outer {
        flex-flow: row;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
    }
    .inner {
        display: flex;
        width: 20em;
        margin: auto;
        gap: 0.5em;
        flex-flow: row;
        list-style: none;
        justify-content: space-between;
        margin-top: 2em;
    }
    i, .number {
        border: solid var(--dark);
        background-color: white;
        padding: 0.5rem;
        font-size: smaller;
        border-radius: 0.5em;
        width: 1em;
        height: 1em;
        text-align: center;
        cursor: pointer;
    }
    i.fa-ellipsis {
        cursor: auto;
    }
    i.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .selected {
        background-color: var(--dark);
        color: white;
    }
</style>