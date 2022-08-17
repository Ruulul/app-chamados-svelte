<script>
    import { getFile } from "$lib/utils/db";
    import { geraCSS } from '$lib/utils/utils'
    /**
     * Nome do arquivo na API
     */
    export let filename = 'undefined'
    /**
     * Texto a ser exibido enquanto carrega
     */
    export let carregando = 'Carregando...'
    /**
     * Texto alternativo
     */
    export let alt = ''

    /**
     * O arquivo, se já disponível
     */
    export let data = undefined
    /**
     * Texto para ser exibido quando o arquivo não é encontrado
     */
    export let sem_arquivo = 'Sem arquivo'

    /**
     * Texto para o link para abrir em nova aba. Sete para `false` se quiser ocultar o link.
     * @type {string | boolean}
     */
    export let abrir = 'Abrir arquivo em nova aba'

     /**
      * CSS 
      */
    export let style = {}
</script>
{#if data}
    {#if data !== 'Não autorizado'}
        {#if data.includes('image')}
            <img {alt} src={data}  style={geraCSS(style)}/>
        {:else}
            <object title='anexo' {alt} data={data} style={geraCSS(style)}>
                Não pudemos exibir
            </object>
        {/if}

        {#if abrir}
            <a href={data} target='_blank'>{abrir}</a>
        {/if}
    {/if}
{:else if String(filename) !== 'undefined'}
    {#await getFile(filename)}
        {carregando}
    {:then arquivo}
        {#if arquivo !== 'Não autorizado'}
        {#if arquivo.includes('image')}
            <img {alt} src={arquivo}  style={geraCSS(style)}/>
        {:else}
            <object title='anexo' {alt} data={arquivo} style={geraCSS(style)}>
                Não pudemos exibir
            </object>
        {/if}
        {#if abrir}
            <a href={arquivo} target='_blank'>{abrir}</a>
        {/if}
        {:else}
            {sem_arquivo}
        {/if}
    {/await}
{/if}

<style>
    * {
        width: 100%;
    }
</style>