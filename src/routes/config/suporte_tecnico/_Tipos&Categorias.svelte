<script>
    import { tipos_os, categorias_os } from "$lib/stores/local_db";
    import Accordion from "./_Accordion.svelte";
    import { config, filiais_validas, filial } from "$lib/utils/db";
    import Dialog from "$lib/components/Dialog.svelte";

    let item = {}
    let item_ptr = item
    /** @type {HTMLDialogElement} */
    let dialog_tipo
    /** @type {HTMLDialogElement} */
    let dialog_categoria
    /** @type {HTMLDialogElement} */
    let dialog_criar_tipo
    /** @type {HTMLDialogElement} */
    let dialog_criar_categoria

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
</script>
<template lang="pug">
    Accordion(title='Tipos' items='{$tipos_os}')
        li.tab(slot='first-items' on:click="{openEdit('new').on('tipo')}") Adicionar Tipo
        li.tab(slot='item' 'let:item')
            i.fas.fa-close(on:click='{config.deleteTipo(item)}')
            i.fas.fa-pen(  on:click="{openEdit('tipo').on(item)}")
            Accordion(wrap='{false}' title='{item.tipo}' items!='{$categorias_os.filter(categoria=>categoria.tipo===item.tipo)}')
                li.tab(slot='first-items' on:click="{openEdit('new').on('categoria').on(item.tipo)}") Adicionar Categoria
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
            label Filial -
                select(bind:value='{$filial}')
                    +each('$filiais_validas as filial')
                        option {filial}
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
    dialog {
        width: 20em;
    }
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