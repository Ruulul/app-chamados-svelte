<script>
    import { getFile } from "$lib/utils/db";
    import { geraCSS } from '$lib/utils/utils'
    /**
     * Nome do arquivo na API
     */
    export let title = 'undefined'
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
	    <div class="file-wrapper" style={geraCSS(style)}>
	    	<span>{title} (Approx. {Math.floor(data.split(';base64,')[1].length/4 * 3 / 1024)} kB)
	    		<br/>
	    		{#if data.slice(0, 20).includes('image')}
	    		<img alt='' src={data}/>
	    		{:else}
	    		<object alt='' title='anexo' data={data}>
	    			Não pudemos exibir
	    		</object>
	    		{/if}
	    	</span>
            <slot/>
	    </div>
        {#if abrir}
            <a href={data} target='_blank'>{abrir}</a>
        {/if}
    {/if}
{:else if String(title) !== 'undefined'}
    {#await getFile(title)}
        {carregando}
    {:then arquivo}
        {#if arquivo !== 'Não autorizado'}
	    <div class="file-wrapper" style={geraCSS(style)}>
	    	<span>{title} (Approx. {Math.floor(arquivo.split(';base64,')[1].length/4 * 3 / 1024)} kB)
	    		<br/>
	    		{#if data.slice(0, 20).includes('image')}
	    		<img alt='' src={arquivo}/>
	    		{:else}
	    		<object alt='' title='anexo' data={arquivo}>
	    			Não pudemos exibir
	    		</object>
	    		{/if}
	    	</span>
            <slot/>
	    </div>
        {#if abrir}
            <a href={arquivo} target='_blank'>{abrir}</a>
        {/if}
        {:else}
            {sem_arquivo}
        {/if}
    {/await}
{/if}

<style>
	img {
		width: 0;
		transition: width 0.2s;
		align-self: center;
	}
	.file-wrapper :hover img {
		width: 100%;
	}

	.file-wrapper {
		display: flex;
		flex-flow: row;
		border: none;
		width: 100%;
		justify-content: space-between;
		margin: 0 -2em 0 -2em;
	}
</style>