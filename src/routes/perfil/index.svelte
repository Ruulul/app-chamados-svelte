<script>
    import { user } from "$lib/stores/user";
    import { getFile, handle_user } from '$lib/utils/db';
    import Dialog from '$lib/components/Dialog.svelte';

    let on_edit = false;

    let current_profile = $user;

    $: if ($user && !on_edit) {
        console.log($user)
        current_profile = {...$user}; 
        current_profile.contatos = emptyArrayOrContent($user.contatos);
    }

    function emptyArrayOrContent(array) {
        try {
            return JSON.parse(array)
        }
        catch {
            return []
        }
    }

    async function update() {
        await handle_user($user.id, current_profile);
        await user.update();
    }

    let change_pic_dialog = undefined;
</script>
<template lang=pug>
    .filled.container
        .profile-pic.full-width
            .container
                +if('$user.profile_icon')
                    +await("getFile($user.profile_icon)")
                        i.fas.fa-spinner.fa-spin.fa-2x
                        +then('src')
                            img(src='{src}')
                        +catch('_')
                            i.fas.fa-user.placeholder.fa-3x
                    +else()
                        i.fas.fa-user.placeholder.fa-3x
                button.switch(on:click!='{()=>change_pic_dialog.showModal()}') Alterar
                    Dialog(bind:dialog!='{change_pic_dialog}' title='Alterar foto de perfil')
        .full-width
            label Nome
                span.field(class:hidden='{on_edit}') {$user.nome}
                input.field(class:hidden='{!on_edit}' bind:value='{current_profile.nome}')
            label Sobrenome
                span.field(class:hidden='{on_edit}') {$user.sobrenome}
                input.field(class:hidden='{!on_edit}' bind:value='{current_profile.sobrenome}')
        .full-width
            label(class:hidden='{on_edit}') Usuário
                span.field(class:hidden='{on_edit}') {$user.email}
                input.field(class:hidden='{!on_edit}' bind:value='{current_profile.email}')
            div
                .row(class:hidden='{!on_edit}')
                    label Senha 
                        input.field
                    | &nbsp; &nbsp;
                    label Confirma senha
                        input.field
        .full-width Informações de Contato
        div.full-width(class:hidden='{!on_edit}')
            +each("current_profile.contatos as contato")
                label {contato.nome}
                    input.field(value='{contato.valor}')
        div.full-width(class:hidden='{on_edit}')
            +each("JSON.parse($user.contatos) as contato")
                label {contato.nome}
                    span.field {contato.valor}
        .full-width
            label Departamentos
                select.field
                    +each("$user.dept as dept")
                        option {dept}
        .full-width(class:hidden='{on_edit}')
            label Empresas
        .full-width.put-on-end
            button.action.button.edit(on:click!='{()=>on_edit=!on_edit}')
                i.fas(class="{on_edit ? 'fa-x' : 'fa-pen-to-square'}")
                | &nbsp;
                | {!on_edit ? 'Editar' : 'Cancelar'}
            button.action.button.edit(class:hidden='{!on_edit}' on:click='{update}') 
                i.fas.fa-floppy-disk
                | &nbsp;
                | Salvar
</template>

<style>
    .filled.container {
        width: 80%;
        height: 90%;
        display: block;
    }
    .full-width {
        width: 100%;
        display: flex;
        flex-flow: row;
        justify-content: flex-start;
        gap: 2em;
        margin-bottom: 1.5em;
    }
    label {
        display: flex;
        flex-flow: column;
    }
    .row {
        width: 100%;
        flex-flow: row;
    }
    .field {
        border-radius: 1em;
        box-shadow: 0 0.1em var(--dark);
        border: none;
        padding: 0.3em;
        padding-left: 0.5em;
        padding-right: 0.5em;
        background-color: white;
    }
    .profile-pic .container {
        width: 7em;
        height: 7em;
        border: solid var(--dark);
        border-radius: 5em;
        padding: 0;
        position: relative;
    }
    .profile-pic .container * {
        position: absolute;
        width: 100%;
        height: 100%;
        margin: auto;
        overflow: hidden;
        border-radius: 50%;
    }
    .profile-pic .switch {
        position: absolute;
        bottom: 0;
        right: 20%;
        width: 30%;
        height: 30%;
        background-color: var(--dark);
        color: white;
        border: none;
        border-radius: 50%;
        width: fit-content;
        padding: 0.3em;
        padding-left: 0.6em;
        padding-right: 0.6em;
        margin: auto;
        margin-bottom: 0;
        overflow: hidden;
    }
    .put-on-end {
        justify-content: end;
    }
    button.edit {
        font-size: 1.2em;
        display: block;
    }
</style>