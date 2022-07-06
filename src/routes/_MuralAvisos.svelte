<script>
    import { notifications } from "$lib/stores/notifications";
    import { flip } from 'svelte/animate'
</script>

<div class='filled container'>
    <h2>
        Mural de avisos
    </h2>
    <table>
        <thead>
            <th>
                Notificação
            </th>
            <th>
                Tipo
            </th>
        </thead>
        <tbody>
            {#each $notifications as {id, name, type, pop, read, readed}(id)}
            <tr class:readed animate:flip>
                <td>
                    {id} - {name}
                </td>
                <td>
                    {type}
                </td>
                <button on:click={pop}>Delete</button>
                <button class:readed on:click={read}>Ler</button>
            </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    * {
        font-weight: lighter;
    }
    div {
        height: 40%;
    }
    tr.readed {
        opacity: 0.5
    }
    button.readed {
        display: none;
    }
</style>