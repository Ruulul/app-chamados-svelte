<script>
    import { notifications } from "$lib/stores/notifications";
    import { flip } from 'svelte/animate'
    import Filtros from "./_Filtros.svelte";
</script>

<div class='filled container'>
        <!--Consulta futura para obter o clima; requer o site no domínio
        {#await fetch('https://api.hgbrasil.com/weather?woeid=457294&fields=only_results,temp,description,currently,humidity&key={KEY}').then(response=>response.toJSON()) then json}
            {JSON.stringify(json)}
        {/await}-->
    <div class=title>
        <h2>
            Mural de avisos
        </h2>
        <Filtros />
    </div>
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
            {#each $notifications as {id, titulo, type}}
                <tr>
                    <a href={type==='suporte técnico' ? `/servico/${id}` : `/processos/${type}/${id}`}>
                        <td>
                            {id} - {titulo}
                        </td>
                        <td>
                            {type}
                        </td>
                    </a>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .title {
        flex-flow: row;
        width: 100%;
    }
    a {
        display: contents;
    }
    * {
        font-weight: lighter;
    }
    div {
        height: 40%;
        flex: 1;
    }
    tr.readed {
        opacity: 0.5
    }
    button.readed {
        display: none;
    }
    tr :not(:first-child) {
        padding-top: 1em;
        text-align: center;
    }
</style>