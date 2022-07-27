<script>
    export let option
    export let style = '';
</script>
    {#if typeof option === 'string'}
        <option {style} value={option}>{option}</option>
    {:else}
    {@const {label, value} = option}
        <option {style} {value}>{label}</option>
    {/if}
<style>
    * {
        display: flex;
        color: var(--text-color);
    }
    select, option {
        color: var(--texto);
    }
</style>

