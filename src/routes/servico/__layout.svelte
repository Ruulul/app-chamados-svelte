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
    import { servicos } from '$lib/stores/servicos';
    import { setContext } from 'svelte';
    import { get_user, } from '$lib/utils/db.js'
    import { update_servico } from '$lib/utils/servicos';
    import { user } from '$lib/stores/user.js'
    import { fade } from 'svelte/transition';
    import ExibeArquivo from '$lib/components/ExibeArquivo.svelte';
    import { page } from '$app/stores'
    import { writable } from 'svelte/store';

    let servico_store = writable()
    let servico = $servicos.find(({id})=>id==$page.params.servico_id)
    $: servico_new = $servicos.find(({id})=>id==$page.params.servico_id)
    $: if (servico_new?.updatedAt !== servico?.updatedAt) servico = servico_new
    $: if (servico) servico_store.set(servico)
    setContext('servico', servico_store)

    function liberaChamado () {
        let update = {
            atendimento: false,
            atendenteId: ''
        }
        update_servico(servico.id, update, 'released')
    }

    function assumeChamado () {
        let update = {
            atendimento: true,
            atendenteId: $user.id,
            assumido_em: (new Date()).toISOString()
        }
        update_servico(servico.id, update, 'taken')
    }

</script>
{#if servico}
{#key servico?.updatedAt}
<div transition:fade={{duration: 200, easing:(t)=>Math.log1p(t)}} class='filled container'>
    <div class='wrapper'>
        <h1>Chamado {servico.id}</h1> 
        <table> 
            <tr>
                <th>
                    Sla:
                </th>
                <td>
                    [tempo decorrido]
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
            <tr>
                <th>
                    Responsável:
                </th>
                <td>
                    {#if servico.atendenteId && servico.atendenteId !== 'undefined'}
                        {#if servico.atendenteId == $user.id && servico.status!=='fechado'}
                            {$user.nome}<br>
                            <button on:click={liberaChamado}>Liberar chamado?</button>
                        {:else}
                            {#await get_user(servico.atendenteId)}
                                Carregando...
                            {:then {nome}}
                            {nome || 'Sem atendente'}
                            {/await}
                        {/if}
                    {:else} 
                        Sem atendente<br>
                        {#if $user.tipo == 'suporte'}
                            <button on:click={assumeChamado}>Assumir chamado?</button>
                        {/if}
                    {/if}
                </td>
            </tr>
            {#await get_user(servico.usuarioId)}
                Carregando...
            {:then {nome, dept}}
            <tr>
                <th>
                    Cliente:
                </th>
                <td>
                    {nome || 'Sem usuário'}
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
            {/await}
        </table>
        <div class='campo'>
        <h2>Anexo</h2>
            <ExibeArquivo filename={servico.anexo} />
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
        width: auto;
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