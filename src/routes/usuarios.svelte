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

<style>
    a {
        display: contents;
    }
    table {
        width: 80%;
        margin: auto;
    }
</style>