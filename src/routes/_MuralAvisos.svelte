<script>
    import FiltroProcessos, { filter } from "$lib/components/FiltroProcessos.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import { notifications } from "$lib/stores/cadastros";
    import { processos } from "$lib/stores/notifications";
    import { user_names } from "$lib/stores/user";
    import { filterPendente, formatTag } from "$lib/utils/utils";
    import { onMount } from "svelte";

    let loading = {}

    let clear = ()=>{}

    onMount(()=>clear())
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
            <FiltroProcessos bind:clear processos={$processos.filter(filterPendente)}/>
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
            <th>
                Marcar como lido
            </th>
        </thead>
        <tbody>
            <Pagination 
                items_per_page={5} 
                data={$processos.sort((a, b)=>b.id-a.id).filter(p=>filterPendente(p)&&$filter.fn(p)&&notifications.isNotRead(p))}
                columns_count=5>
                <tr slot='page' let:page>
                    {@const {id, idUsuario, etapa: {Tag, campos}, log, Tag: process_tag} = page}
                    {@const etapa_campos = Object.fromEntries(campos)}
                    <a href={`/processos/${Tag}/${id}`}>
                        <td>
                            {id} - {log[0]?.titulo.toUpperCase()}
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
                    <td>
                        <i class={'mark-as-read fas ' + (loading[page.id] || false ? 'fa-spinner fa-spin' : 'fa-circle-dot')} on:click={()=>(loading[page.id]=true, notifications.markAsRead(page.id, page.log.sort((a, b)=>b.id - a.id).at(-1).id))}/>
                    </td>
                </tr>
            </Pagination>
        </tbody>
    </table>
</div>

<style>
    .mark-as-read {
        cursor: pointer;
    }
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
    h2 {
        width: 100%;
    }
</style>