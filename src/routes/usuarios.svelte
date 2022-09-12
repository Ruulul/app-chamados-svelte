<script context='module'>
    import { auth } from "$lib/utils/db";
    export async function load () {
        return {
            props: {
                usuarios: await auth.getPerfis()
            },
            stuff: {
                title: 'Usuários'
            }
        }
    }
</script>

<script>
    export let usuarios;
</script>

<div class='filled container'>
    <table>
        <thead>
            <th>Nome</th>
            <th>Email</th>
            <th>Departamento</th>
        </thead>
        <tbody>
            {#each usuarios as usuario}
            <a href='/usuario/{usuario.id}'>
                <tr>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.dept}</td>
                </tr>
            </a>
            {/each}
        </tbody>
    </table>
    <p>
        <a href='/usuario' title='Adicionar usuário'><i class='fas fa-user-plus'/></a>
    </p>
</div>

<style>
    a {
        display: contents;
    }
    div {
        width:80%;
        margin: auto;
    }
    th {
        padding-top: 1em;
        padding-bottom: 1em;
    }
    div {
        padding-top: 0;
        padding-right: 1em;
    }
</style>