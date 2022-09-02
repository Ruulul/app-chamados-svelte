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
	    <div class:hidden={data === 'Não autorizado'} class="file-wrapper" style={geraCSS(style)}>
	    	<span>{title} (Approx. {Math.floor(data.split(';base64,')[1].length/4 * 3 / 1024)} kB)
	    		<br/>
                <img class:hidden={!data.slice(0, 20).includes('image')} {alt} src={data}/>
	    		<object class:hidden={data.split(';base64,')[1].length < 20 || data.slice(0, 20).includes('image')} {alt} title='anexo' {data}>
	    			Não pudemos exibir
	    		</object>
	    	</span>
            <slot/>
	    </div>
        <a class:hidden={!(data && abrir)} href={data} target='_blank'>{abrir}</a>
{:else if String(title) !== 'undefined'}
    {#await getFile(title)}
        {carregando}
    {:then data}
	    <div class:hidden={data === 'Não autorizado'} class="file-wrapper" style={geraCSS(style)}>
	    	<span>{title} (Approx. {Math.floor(data.split(';base64,')[1].length/4 * 3 / 1024)} kB)
	    		<br/>
                <img class:hidden={!data.slice(0, 20).includes('image')} {alt} src={data}/>
	    		<object class:hidden={data.slice(0, 20).includes('image')} {alt} title='anexo' {data}>
	    			Não pudemos exibir
	    		</object>
	    	</span>
            <slot/>
	    </div>
        <a class:hidden={!(data && abrir)} href={data} target='_blank'>{abrir}</a>
        <span class:hidden={data !== 'Não autorizado'}>{sem_arquivo}</span>
    {/await}
{/if}

<style>
    .hidden {
        display: none;
    }
	img {
		width: 0;
		transition: width 0.2s 0.25s;
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