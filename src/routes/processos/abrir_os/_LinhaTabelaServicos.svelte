<script>
    import { filiais_validas_por_id, getUser } from '$lib/utils/db.js'
    import { user } from '$lib/stores/user';
    import { getServico } from "$lib/utils/servicos";
    import Tooltip from '$lib/components/Tooltip.svelte';
    import { TimeFromSeconds } from '$lib/utils/utils';

    export let agora
    export let id
    let loading = true;

    
    let ISOd = getDateFromISO

    let servico = {}, expired=false, prazo = 0, abertura = 0, atendente='Não definido'

    $: id, defineServico()
    $: diffTime = Math.floor(prazo - agora)
    $: sla = Math.floor(agora - abertura)
    $: expired = diffTime < 0
    $: classificado = $user.tipo == 'suporte' ? true : false
    function defineServico () {
        getServico(id).then(setServico)
    }
    function setServico (os) {
        servico = os
        if (servico) {
            loading = false
            classificado = $user.tipo == 'suporte' ? servico.tipo !== 'A.D.' && servico.subCategoria !== 'A.D.' : true
        }
        let prazoDateObj = new Date(servico.prazo)
        let aberturaDateObj = new Date(servico.createdAt)
        prazo = prazoDateObj.getTime()/1000
        abertura = aberturaDateObj.getTime()/1000
        let id = servico.atendenteId 
        if (id)
        getUser(id).then(({nome})=>atendente=nome)
    }
    
    function getDateFromISO (ISODate) {
        if (!ISODate || ISODate == 'undefined') return ''
        return ISODate?.split('T')[0].split('-').reverse().join('/')
    }
</script>
<tr class='placeholder' class:loading>
    <td colspan="9">Carregando...</td>
</tr>
<a  sveltekit:prefetch href={$user.tipo == 'suporte' && !classificado ? `/classificar/${servico.id}` : `/servico/${servico.id}`}>
    <tr
        class:hidden={loading}
        class='underline'>
        <td>
            {$filiais_validas_por_id[servico.filialId]}
        </td>
        <td class:expired>
            {TimeFromSeconds(diffTime)}
        </td>
        <td>
            {servico.id}
        </td>
        <td class='status'>
            {servico.status}
        </td>
        <td>
            {atendente}
        </td>
        <td class='assunto' class:a-classificar={!classificado}>
            {servico.assunto}
        </td>
        <td>
            {ISOd(servico.createdAt)}
        </td>
        <td>
            {ISOd(servico.fechado_em)}
        </td>
        <td>
            {#key agora}
            <span class='tempo'>
                {TimeFromSeconds(diffTime)}
            </span>
            {/key}
            <span class='prazo'>{ISOd(servico.prazo)}</span>
            <span class='abertura'>{ISOd(servico.createdAt)}</span>
            <span class='prioridade'>{['Baixa', 'Média', 'Alta', 'Urgente'][servico.prioridade-1]}</span>
            <span class='filial'>{$filiais_validas_por_id[servico.filialId]}</span>
        </td>
        <Tooltip>
            Tipo: {servico.tipo}<br>
            Categoria: {servico.subCategoria}<br>
            Assumido em {ISOd(servico.assumido_em)}<br>
            Prioridade: {['Baixa', 'Média', 'Alta', 'Urgente'][servico.prioridade-1]}<br>
            Prazo estimado: {ISOd(servico.prazo)}<br>
        </Tooltip>
    </tr>
</a>
<style>
    .expired::after {
        content: '!';
        position: absolute;
        right: 0;
        top: 0;
        z-index: 5;
        font-size: large;
        color: var(--warning-color, crimson);
    }
    .a-classificar::after {
        content: '?';
        position: absolute;
        right: 0;
        top: 0;
        z-index: 5;
        font-size: large;
        color: var(--warning-color, crimson);
    }
    .placeholder {
        display: none;
    }
    .loading {
        display: unset;
    }
    span.tempo {
        display: var(--active-tempo, none);
    }
    span.prazo {
        display: var(--active-prazo, none);
    }
    span.abertura {
        display: var(--active-abertura, none);
    }
    span.prioridade {
        display: var(--active-prioridade, none);
    }
    span.filial {
        display: var(--active-filial, none);
    }
    tr {
        text-align: center;
    }
    td {
        padding: 0.3em;
        padding-top: 0.45em;
        padding-bottom: 0.45em;
        position: relative;
    }
    td.assunto {
        text-transform: lowercase;
    }
    td.assunto::first-letter {
        text-transform: capitalize;
    }
    td.status {
        text-transform: capitalize;
    }
    tr:hover :global(.anchor .tooltip) {
        opacity: 1;
    }
    tr::after {
        --border-color: var(--grey);
        border-width: 0.15em;
        filter: brightness(0.8);
        opacity: 0.8;
        content: '';
    }
    a {
        display: contents;
    }
</style>