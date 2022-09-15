<script>
    import FiltroProcessos from "$lib/components/FiltroProcessos.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import { processos } from "$lib/stores/notifications";
    import { user_names } from "$lib/stores/user";
    import { filterPendente, formatTag } from "$lib/utils/utils";
    let filter
</script>

<div class='filled container'>
        <!--Consulta futura para obter o clima; requer o site no domínio
        {#await fetch('https://api.hgbrasil.com/weather?woeid=457294&fields=only_results,temp,description,currently,humidity&key={KEY}').then(response=>response.toJSON()) then json}
            {JSON.stringify(json)}
        {/await}-->
    <div class=title>
        <h2>
            <i class='fas fa-thumbtack'/>
            Mural de avisos
            <FiltroProcessos processos={$processos.filter(filterPendente)} bind:filter/>
        </h2>
    </div>
    <div class=divider/>
    <table>
        <thead>
            <th>
                Notificação
            </th>
            <th>
                Tipo
            </th>
            <th>
                Etapa
            </th>
            <th>
                Status
            </th>
            <th>
                De
            </th>
        </thead>
        <tbody>
            <Pagination data={$processos.filter(p=>filterPendente(p)&&filter.fn(p))}>
                <tr slot='page' let:page>
                    {@const {id, idUsuario, etapa: {Tag, campos}, log, Tag: process_tag} = page}
                    {@const etapa_campos = Object.fromEntries(campos)}
                    <a href={`/processos/${Tag}/${id}`}>
                        <td>
                            {id} - {log[0].titulo.toUpperCase()}
                        </td>
                        <td>
                            {formatTag(process_tag)}
                        </td>
                        <td>
                            {formatTag(Tag)}
                        </td>
                        <td>
                            {etapa_campos.status}
                        </td>
                        <td>
                            {$user_names[idUsuario] || 'Carregando...'}
                        </td>
                    </a>
                </tr>
            </Pagination>
        </tbody>
    </table>
</div>

<style>
    .divider {
        margin-bottom: 1em;
        width: 100%;
        height: 0.3em;
    }
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
    .filled.container {
        flex: 0.9;
    }
    tr :not(:first-child) {
        padding-top: 1em;
        text-align: center;
    }
</style>