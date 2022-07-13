<script>
import { geraCSS } from "$lib/utils/utils";


    export let label = 'Filtro';
    export let options = ['Escolha...'];
    export let value = typeof options[0] === 'string' ? options[0] : options[0].value;
    export let style = '';
    export let style_button = '';
    export let style_label = '';
    export let required = false;
    export function input() {
        return
    }

    $: generated_css_select = geraCSS(style);
    $: generated_css_option = geraCSS(style_button);
    $: generated_css_label  = geraCSS(style_label);
</script>

<label style={generated_css_label} for="filtro">{label}</label>
<select {required} style={generated_css_select} bind:value id="filtro" on:input>
    {#each options as option}
        {#if typeof option === 'string'}
            <option style={generated_css_option} {option}>{option}</option>
        {:else}
        {@const {label, value} = option}
            <option style={generated_css_option} {value}>{label}</option>
        {/if}
    {/each}
</select>

<style>
    * {
        display: flex;
        color: var(--text-color);
    }
    select, option {
        color: var(--texto);
    }
</style>