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
     * Texto para a opção de download. Sete pra `false` para ocultar.
     */
    export let download = 'Baixar arquivo'

     /**
      * CSS 
      */
    export let style = {}

    /** @type {HTMLDialogElement} */
    let preview;
</script>
{#if data}
{@const is_image = data.slice(0, 20).includes('image')}
    <div style:width='100%'>
	    <div class:hidden={data === 'Não autorizado'} style={geraCSS(style)}>
	    	<span>{title} (Approx. {Math.floor(data.split(';base64,')[1].length/4 * 3 / 1024)} kB)
	    		<br/>
                <button class:hidden={!is_image} on:click={()=>preview.showModal()}>Visualizar</button>
                <dialog bind:this={preview}>
                    <div class='file-wrapper'>
                        <img class:hidden={!is_image} {alt} src={data}/>
                        <div>
                            <a class:hidden={!(data && abrir)} href={data} {title} target='_blank'>{abrir}</a>
                            <a class:hidden={!(data && download)} href={data} download={title}>{download}</a>
                            <button on:click={()=>preview.close()}>Voltar</button>
                        </div>
                    </div>
                </dialog>
	    		<object class:hidden={data.split(';base64,')[1].length < 20 || is_image} {alt} title='anexo' {data}>
	    			Não pudemos exibir
	    		</object>
	    	</span>
            <slot/>
	    </div>
        <a class:hidden={!(data && abrir)} href={data} {title} target='_blank'>{abrir}</a>
        <a class:hidden={!(data && download)} href={data} download={title}>{download}</a>
    </div>
{:else if String(title) !== 'undefined'}
    {#await getFile(title)}
        {carregando}
    {:then data}
    {@const is_image = data.slice(0, 20).includes('image')}
        <div style:width='100%'>
            <div class:hidden={data === 'Não autorizado'} style={geraCSS(style)}>
                <span>{title} (Approx. {Math.floor(data.split(';base64,')[1].length/4 * 3 / 1024)} kB)
                    <br/>
                    <button class:hidden={!is_image} on:click={()=>preview.showModal()}>Visualizar</button>
                    <dialog bind:this={preview}>
                        <div class='file-wrapper'>
                            <img class:hidden={!is_image} {alt} src={data}/>
                            <div>
                                <a class:hidden={!(data && abrir)} href={data} {title} target='_blank'>{abrir}</a>
                                <a class:hidden={!(data && download)} href={data} download={title}>{download}</a>
                                <button on:click={()=>preview.close()}>Voltar</button>
                            </div>
                        </div>
                    </dialog>
                    <object class:hidden={is_image} {alt} title='anexo' {data}>
                        Não pudemos exibir
                    </object>
                </span>
                <slot/>
            </div>
            <a class:hidden={!(data && abrir)} href={data} {title} target='_blank'>{abrir}</a>
            <a class:hidden={!(data && download)} href={data} download={title}>{download}</a>
            <span class:hidden={data !== 'Não autorizado'}>{sem_arquivo}</span>
        </div>
    {/await}
{/if}

<style>
    .hidden {
        display: none;
    }

	.file-wrapper {
		display: grid;
		border: none;
        width: 70vw;
        height: 80vh;
		justify-content: center;
	}
	.file-wrapper img {
		width: 60vw;
	}
    .file-wrapper div {
        display: flex;
        flex-flow: row;
        width: 100%;
    }
</style>