<script context='module'>
	export async function load ({params}) {
		return {
			stuff: {
				title: `Chamado ${params.servico_id}`
			}
		}
	}

</script>
<script>
    import { onDestroy, setContext } from 'svelte';
    import { getUser, } from '$lib/utils/db.js'
    import { servicos } from '$lib/stores/servicos';
    import { updateServico } from '$lib/utils/servicos';
    import { user } from '$lib/stores/user.js'
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import { page } from '$app/stores'
    import { writable } from 'svelte/store';
    import { TimeFromSeconds } from '$lib/utils/utils';

    let atendente='', nome='Sem usuário', dept='Sem usuário'
    let servico_store = writable({})
    let servico = $servicos.find(({id})=>id==$page.params.servico_id)
    $: servico_new = $servicos.find(({id})=>id==$page.params.servico_id)
    $: if (servico_new?.updatedAt !== servico?.updatedAt) servico = servico_new
    $: if (servico) servico_store.set(servico)
    setContext('servico', servico_store)
    setAtendente()

    function liberaChamado () {
        let update = {
            atendimento: false,
            atendenteId: ''
        }
        updateServico(servico.id, update, 'released')
    }

    function assumeChamado () {
        let update = {
            atendimento: true,
            atendenteId: $user.id,
            assumido_em: (new Date()).toISOString()
        }
        updateServico(servico.id, update, 'taken')
    }

    let agora = 0
    let handler_agora = setInterval(()=>agora=Date.now()/1000, 1000)
    onDestroy(()=>clearInterval(handler_agora))
    $: abertura = servico ? (new Date(servico.createdAt).getTime()/1000) : 0
    $: sla = Math.floor(agora - abertura)
    $: hasAtendente = servico?.atendenteId && servico?.atendenteId !== 'undefined'
    $: isSuporte = $user.tipo=='suporte'
    $: canRelease = servico?.atendenteId == $user.id && servico?.status!=='fechado'
    $: servico?.updatedAt, setAtendente()
    $: servico?.usuarioId, setNomeAndDept()
    function setAtendente () {
        let id = servico?.atendenteId
        if (id)
            if (id == $user.id)
                atendente=$user.nome
            else 
                getUser(id)
                .then(({nome})=>atendente=nome)
    }
    function setNomeAndDept () {
        let id = servico?.usuarioId
        if (id)
            getUser(id).then(({nome : gettedNome, dept : gettedDept})=>{
                nome = gettedNome;
                dept = gettedDept;
            })
    }
</script>
{#if servico}
{#key servico?.updatedAt}
<div class='filled container'>
    <div class='wrapper'>
        <h1>Chamado {servico.id}</h1>{#if $user.tipo == 'suporte'}<a href='/classificar/{$page.params.servico_id}'><i class='fas fa-pen'/></a>{/if}
        <table> 
            <tr>
                <th>
                    Tempo decorrido:
                </th>
                <td>
                    {TimeFromSeconds(sla)}
                </td>
            </tr>
            <tr>
                <th>
                    Abertura:
                </th>
                <td>
                    {servico.createdAt.split('T')[0].split('-').reverse().join('/')}
                </td>
            </tr>
            <tr class:hidden={!(hasAtendente || isSuporte)}>
                <th>
                    Responsável:
                </th>
                <td>
                    <span class:hidden={!(hasAtendente)}>{atendente}</span>
                    <button on:click={assumeChamado} class:hidden={!(!hasAtendente && isSuporte)}>Assumir chamado?</button>
                    <button on:click={liberaChamado} class:hidden={!(canRelease)}>Liberar chamado</button>
                </td>
            </tr>
            <tr>
                <th>
                    Cliente:
                </th>
                <td>
                    {nome}
                </td>
            </tr>
            <tr>
                <th>
                    Departamento:
                </th>
                <td>
                    {dept}
                </td>
            </tr>
            <tr>
                <th>
                    Tipo:
                </th>
                <td>
                    {servico.tipo}
                </td>
            </tr>
            <tr>
                <th>
                    Categoria:
                </th>
                <td>
                    {servico.subCategoria}
                </td>
            </tr>
        </table>
        <div class='campo'>
        <h2>Anexo</h2>
                <ExibeArquivo title={servico.anexo} alt=''/>
        </div>

    </div>
    <div class='container'>
        <slot/>
    </div>
</div>
{/key}
{/if}
<style>
    .filled.container {
        margin: auto;
        flex-flow: row;
    }
    .wrapper {
        justify-content: flex-start;
        border-right: var(--dark) solid;
        padding-right: 2em;
    }
    .campo {
        font-size: small;
    }
    table {
        display: grid;
    }
    tr {
        padding: 0.5em;
        border-bottom: 0.1em var(--dark) solid;
    }
</style>