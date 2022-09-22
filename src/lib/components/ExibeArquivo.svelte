<script>
    import { getFile } from "$lib/utils/db";
    import { geraCSS } from '$lib/utils/utils'
import Dialog from "./Dialog.svelte";
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
<template lang="pug">
    mixin template(data, is_image)
        div(style='width=100%')
            div(class:hidden!='{data === "Não autorizado"}' style!='{geraCSS(style)}')
                span {title} (Approx. {Math.floor(data.split(";base64,")[1].length/4 * 3 / 1024)} kB)
                    br
                    button.action.button(on:click!='{()=>preview.showModal()}') Visualizar
                    Dialog(title='' bind:dialog!='{preview}')
                        .file-wrapper
                            img(class:hidden!='{!is_image}' '{alt}' src!='{data}')
                            object(class:hidden!='{data.split(";base64,")[1].length < 20 || is_image}' '{alt}' '{data}' '{title}')
                                | Não pudemos exibir
                            div
                                a.action.button(class:hidden!='{!(data && download)}' href!='{data}' download!='{title}')
                                    | {download}
                                button.action.button(on:click!='{()=>preview.close()}') Voltar
    +if('data')
        +const('is_image = data.slice(0, 20).includes("image")')
        +template(data, is_image)
        +elseif('String(title) !== "undefined"')
            +await('getFile(title)')
                | {carregando}
                +then('data')
                    +const('is_image = data.slice(0, 20).includes("image")')
                    +template(data, is_image)

</template>

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