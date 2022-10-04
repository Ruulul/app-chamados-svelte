<script>
    import { user } from "$lib/stores/user";
</script>
<template lang=pug>
    .filled.container
        .profile-pic.full-width
            .container
                i.fa-regular.fa-user.placeholder.fa-3x
                button.switch Alterar
        .full-width
            label Nome
                input.field(value='{$user.nome}')
            label Sobrenome
                input.field(value='{$user.sobrenome}')
        .full-width
            label Usuário
                input.field(value='{$user.email}')
            label Senha 
                input.field
            label Confirma senha
                input.field
        .full-width
            +each("JSON.parse($user.contatos) as contato")
                label {contato.nome}
                    input.field(value='{contato.valor}')
        .full-width
            label Departamento
                select.field
                    +each("$user.dept as dept")
                        option {dept}
        .full-width
            label Empresas
        .full-width.put-on-end
            button.action.button.edit
                i.fas.fa-pen-to-square
                |
                | Editar
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