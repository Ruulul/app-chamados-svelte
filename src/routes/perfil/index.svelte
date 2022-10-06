<script>
    import { user } from "$lib/stores/user";

    let on_edit = false;

    let current_profile = $user;

    $: if ($user && !on_edit) current_profile = $user;

</script>
<template lang=pug>
    .filled.container
        .profile-pic.full-width
            .container
                i.fa-regular.fa-user.placeholder.fa-3x
                button.switch Alterar
        .full-width
            label Nome
                span.field(class:hidden='{on_edit}') {$user.nome}
                input.field(class:hidden='{!on_edit}' bind:value='{current_profile.nome}')
            label Sobrenome
                span.field(class:hidden='{on_edit}') {$user.sobrenome}
                input.field(class:hidden='{!on_edit}' bind:value='{current_profile.sobrenome}')
        .full-width
            label Usuário
                span.field(class:hidden='{on_edit}') {$user.email}
                input.field(class:hidden='{!on_edit}' bind:value='{current_profile.email}')
            div
                .row(class:hidden='{!on_edit}')
                    label Senha 
                        input.field
                    | &nbsp; &nbsp;
                    label Confirma senha
                        input.field
        .full-width
            div(class:hidden='{!on_edit}')
                +each("JSON.parse(current_profile.contatos) as contato")
                    label {contato.nome}
                        input.field(value='{contato.valor}')
            div(class:hidden='{on_edit}')
            +each("JSON.parse($user.contatos) as contato")
                label {contato.nome}
                    span.field {contato.valor}
        .full-width
            label Departamento
                select.field
                    +each("$user.dept as dept")
                        option {dept}
        .full-width
            label Empresas
        .full-width.put-on-end
            button.action.button.edit(on:click!='{()=>on_edit=!on_edit}')
                i.fas(class="{on_edit ? 'fa-x' : 'fa-pen-to-square'}")
                |
                | {!on_edit ? 'Editar' : 'Cancelar'}
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
        background-color: white;
    }
    .profile-pic .container {
        width: 7em;
        height: 7em;
        border: solid var(--dark);
        border-radius: 5em;
        padding: 0;
    }
    .profile-pic .placeholder {
        margin: auto;
    }
    .profile-pic .switch {
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