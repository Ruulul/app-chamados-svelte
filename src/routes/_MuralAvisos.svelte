<script>
    import { processos } from "$lib/stores/notifications";
    import { filterPendente, formatTag } from "$lib/utils/utils";
    import { flip } from 'svelte/animate'
    import Filtros from "./_Filtros.svelte";
    import Fa from "svelte-fa";
    import { faThumbtack as pin } from '@fortawesome/free-solid-svg-icons';
    import { getUser } from "$lib/utils/db";

    let usuarios = {}

    $: $processos.filter(filterPendente).map(async ({idUsuario: id})=>!usuarios[id] ? usuarios[id] = (await getUser(id).catch(()=>({nome: 'Erro'}))).nome : undefined)
</script>

<div class='filled container'>
        <!--Consulta futura para obter o clima; requer o site no domínio
        {#await fetch('https://api.hgbrasil.com/weather?woeid=457294&fields=only_results,temp,description,currently,humidity&key={KEY}').then(response=>response.toJSON()) then json}
            {JSON.stringify(json)}
        {/await}-->
    <div class=title>
        <h2>
            <Fa icon={pin}/>
            Mural de avisos
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
                Status
            </th>
            <th>
                De
            </th>
        </thead>
        <tbody>
            {#each $processos.filter(filterPendente) as {id, idUsuario, etapa: {Tag, campos}, log, Tag: process_tag}}
                {@const etapa_campos = Object.fromEntries(campos)}
                <tr>
                    <a href={`/processos/${Tag}/${id}`}>
                        <td>
                            {id} - {log[0].titulo.toUpperCase()}
                        </td>
                        <td>
                            {formatTag(process_tag)}
                        </td>
                        <td>
                            {etapa_campos.status}
                        </td>
                        <td>
                            {usuarios[idUsuario] || 'Carregando...'}
                        </td>
                    </a>
                </tr>
            {/each}
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