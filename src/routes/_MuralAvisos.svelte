<script>
    import { processos } from "$lib/stores/notifications";
    import { formatTag } from "$lib/utils/utils";
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
            {#each $processos.filter(processo=>Object.fromEntries(processo.etapa.campos)["status"]!=='finalizado') as {id, etapa: {campos}, log, Tag}}
                <tr>
                    <a href={`/processos/${Tag}/${id}`}>
                        <td>
                            {id} - {log[0].titulo}
                        </td>
                        <td>
                            {formatTag(Tag)}
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
        flex: 1;
    }
    tr :not(:first-child) {
        padding-top: 1em;
        text-align: center;
    }
</style>