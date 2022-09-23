<script>
    export let data
    export let page = 1
    export let items_per_page = 10

</script>
{#each data.slice((page - 1) * items_per_page, page * items_per_page) as page}
    <slot name='page' {page}/>
{/each}