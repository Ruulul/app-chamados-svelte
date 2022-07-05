<script>
    import { notifications } from "$lib/stores/notifications";
    import { flip } from 'svelte/animate'
</script>

<div>
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
        justify-content: center;
        display: flex;
        flex-flow: column;
        border-radius: 2em;
        width: fit-content;
        height: 40%;
        padding: 4em;
		padding-top: 2em;
        background: var(--grey);
    }
    tr.readed {
        opacity: 0.5
    }
    button.readed {
        display: none;
    }
</style>