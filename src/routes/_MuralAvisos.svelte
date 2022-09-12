<script>
    import { processos } from "$lib/stores/notifications";
    import { filterPendente, formatTag } from "$lib/utils/utils";
    import { getUser } from "$lib/utils/db";

    let usuarios = {}
    let tipos = []
    let etapas = []
    let status = []
    let filter = {
        tipo: undefined,
        etapa: undefined,
        status: undefined,
        fn(processo) {
            let tipo_filter = !this.tipo ? true : processo.Tag === this.tipo;
            let etapa_filter = !this.etapa ? true : processo.etapa.Tag === this.etapa;
            let status_filter = !this.status ? true : processo.etapa.campos.find(campo=>campo[0]==='status')[1] === this.status;

            return tipo_filter && etapa_filter && status_filter;
        }
    }
    $: console.log(JSON.stringify(filter))

    $: $processos.filter(p=>filterPendente(p)).map(({idUsuario: id, Tag: tipo, etapa: {campos, Tag: tag_etapa}})=>{
        if(!tipos.includes(tipo))
            tipos[tipos.length] = tipo
        if(!etapas.includes(tag_etapa))
            etapas[etapas.length] = tag_etapa
        const campos_obj = Object.fromEntries(campos)
        if(!status.includes(campos_obj.status))
            status[status.length] = campos_obj.status
        if(!usuarios[id]) 
            fillUserName(id)
    })

    async function fillUserName(id) {
        usuarios[id] = (await getUser(id).catch(()=>({nome: 'Erro'}))).nome
    }
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
        </h2>
        <form>
            <label>
                Tipo
                <select bind:value={filter.tipo}>
                    <option value={undefined}>Escolha...</option>
                    {#each tipos as tipo}
                        <option>{tipo}</option>
                    {/each}
                </select>
            </label>
            <label>
                Etapa
                <select bind:value={filter.etapa}>
                    <option value={undefined}>Escolha...</option>
                    {#each etapas as etapa}
                        <option>{etapa}</option>
                    {/each}
                </select>
            </label>
            <label>
                Status
                <select bind:value={filter.status}>
                    <option value={undefined}>Escolha...</option>
                    {#each status as stat}
                        <option>{stat}</option>
                    {/each}
                </select>
            </label>
        </form>
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
            {#each $processos.filter(p=>filterPendente(p)&&filter.fn(p)) as {id, idUsuario, etapa: {Tag, campos}, log, Tag: process_tag}}
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