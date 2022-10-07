<script>
    import { tipos_os, categorias_os } from "$lib/stores/local_db";
    import Accordion from "./_Accordion.svelte";
    import { config, filiais_validas, filial } from "$lib/utils/db";
    import Dialog from "$lib/components/Dialog.svelte";

    let item = {}
    /** @type {HTMLDialogElement} */
    let dialog_tipo
    /** @type {HTMLDialogElement} */
    let dialog_categoria
    /** @type {HTMLDialogElement} */
    let dialog_criar_tipo
    /** @type {HTMLDialogElement} */
    let dialog_criar_categoria
    let dialog_criar_tipo_is_open = false
    let dialog_criar_categoria_is_open = false

    function openEdit(type) {
        switch (type) {
            case 'tipo':
                return {
                    on (t) {
                        item = {...t};
                        return ()=>dialog_tipo.showModal();
                    }
                };
            case 'categoria':
                return {
                    on (t) {
                        item = {...t}
                        return ()=>dialog_categoria.showModal();
                    }
                };
            case 'new':
                return {
                    on: function (t) {
                        item = {};
                        switch (t) {
                            case 'tipo':
                                item.tipo = '';
                                return ()=>dialog_criar_tipo.showModal();
                            case 'categoria':
                                return {
                                    on (t) {
                                        item.tipo = t;
                                        return ()=>dialog_criar_categoria.showModal();
                                    }
                                }
                        }
                    }
                };
        };
    }

    function checkDialogs () {
        dialog_criar_tipo_is_open = dialog_criar_tipo?.open
        dialog_criar_categoria_is_open = dialog_criar_categoria?.open
    }
</script>
<template lang="pug">
    svelte:body(on:click='{checkDialogs}')
    Accordion(title='Tipos' items='{$tipos_os}')
        li.tab.button(slot='first-items' on:click="{openEdit('new').on('tipo')}" class:action!='{dialog_criar_tipo_is_open}') Adicionar Tipo
        li.tab(slot='item' 'let:item')
            Accordion(wrap='{false}' items!='{$categorias_os.filter(categoria=>categoria.tipo===item.tipo)}')
                svelte:fragment(slot='title')
                    i.fas.fa-close(on:click='{config.deleteTipo(item)}')
                    i.fas.fa-pen(  on:click="{openEdit('tipo').on(item)}")
                    | {item.tipo}
                li.tab.button(slot='first-items' on:click="{openEdit('new').on('categoria').on(item)}" class:action!='{dialog_criar_categoria_is_open}') Adicionar Categoria
                li.tab(slot='item' 'let:item')
                    i.fas.fa-close(on:click='{config.deleteCategoria(item)}')
                    i.fas.fa-pen(  on:click="{openEdit('categoria').on(item)}")
                    | {item.categoria}
    Dialog(title='' bind:dialog='{dialog_tipo}')
        form(on:submit|preventDefault!='{()=>config.editarTipo(item, item)}')
            | ID - {item.id}
            label Filial -
                select(bind:value='{$filial}')
                    +each('$filiais_validas as filial')
                        option {filial}
            label Tipo -
                input(bind:value='{item.tipo}')
            input(type='submit' value='Atualizar')
    Dialog(title='' bind:dialog='{dialog_categoria}')
        form(on:submit|preventDefault!='{()=>config.editarCategoria(item, item)}')
            | ID - {item.id}
            label Tipo -
                select(bind:value='{item.tipo}')
                    +each('$tipos_os as { tipo }')
                        option {tipo}
            label Categoria -
                input(bind:value='{item.categoria}')
            input(type='submit' value='Atualizar')
    Dialog(title='' bind:dialog='{dialog_criar_tipo}')
        form(on:submit|preventDefault!='{()=>config.addTipo(item)}')
            label Filial -
                select(bind:value='{$filial}')
                    +each('$filiais_validas as filial')
                        option {filial}
            label Tipo -
                input(bind:value='{item.tipo}')
            input(type='submit' value='Atualizar')
    Dialog(title='' bind:dialog='{dialog_criar_categoria}')
        form(on:submit|preventDefault!='{()=>config.addCategoria(item)}')
            label Tipo -
                select(bind:value='{item.tipo}')
                    +each('$tipos_os as { tipo }')
                        option {tipo}
            label Categoria -
                input(bind:value='{item.categoria}')
            input(type='submit' value='Atualizar')
</template>
<style>
    form {
        display: flex;
        flex-flow: column;
        align-items: left;
        gap: 2em;
    }
    label {
        display: grid;
    }
    .tab {
        display: block;
        overflow: hidden;
        font-size: 1.3rem;
        border-radius: 1em;
        padding: 0.5em;
        cursor: pointer;
    }
    li {
        gap: 1em;
        display: flex;
        flex-flow: column;
    }
    li * {
        margin-right: 1em;
    }
</style>