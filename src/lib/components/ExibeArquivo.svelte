<script>
    import { get_file } from "$lib/utils/db";
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
     * Texto para ser exibido quando o arquivo não é encontrado
     */
    export let sem_arquivo = 'Sem arquivo'

    /**
     * Texto para o link para abrir em nova aba. Sete para `false` se quiser ocultar o link.
     */
    export let abrir = 'Abrir arquivo em nova aba'

     /**
      * CSS 
      */
    export let style = {}
</script>
{#if String(filename) !== 'undefined'}
    {#await get_file(filename)}
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
{:else}
    Sem anexo nesse chamado
{/if}

<style>
    * {
        width: 100%;
    }
</style>