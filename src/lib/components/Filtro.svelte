<script>
    export let label = 'Filtro';
    export let options = ['Escolha...'];
    export let value = typeof options[0] === 'string' ? options[0] : options[0].value;
    export function input() {
        return
    }
</script>

<label for="filtro">{label}</label>
<select bind:value id="filtro" on:input>
    {#each options as option}
        {#if typeof option === 'string'}
            <option {option}>{option}</option>
        {:else}
        {@const {label, value} = option}
            <option {value}>{label}</option>
        {/if}
    {/each}
</select>

<style>
    * {
        display: flex;
    }
</style>