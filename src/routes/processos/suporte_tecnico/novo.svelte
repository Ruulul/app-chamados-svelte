<script context='module'>
	export async function load () {
		return {
			stuff: {
				title: 'Abrir chamado'
			},
		}
	}
</script>
<script>
	import Anexos from '$lib/components/Anexos.svelte';
	import Filtro from '$lib/components/Filtro.svelte';
	import { user } from '$lib/stores/user';
	import { filiais_validas, filial } from '$lib/utils/filial';
	import { post } from '$lib/utils/cadastros.js';
	let assunto = '', mensagem = '';
	let addFiles, anexos;
	$: console.log(mensagem)
	async function onSubmit() {
		let os = {
			assunto,
			mensagem:
				{
					idUsuario: $user.id,
					descr: mensagem,
                    titulo: assunto
				}
			,
			anexos,
			usuarioId: $user.id,				//Alterar depois para suportes
			departamento: $user.dept,			//	''		''		''		''
            filial: $filial,
            status: 'pendente',
            categoria: 'A. D.',
            prioridade: 'A. D.',
            suporteId: 0,
            dept: 
                $filial === '0101' 
                    ? 9
                : $filial === '0201'
                    ? 22
                : $filial === '0401'
                    ? 29
                : undefined,
		}

		await post('processos', 'suporte_tecnico', os).then(()=>history.back())
	}
	</script>
        <h1>Abrir Chamado</h1>
<div class='filled container'>
    <div class='wrapper'>
        <table> 
            <tr>
                <th>
                    Cliente:
                </th>
                <td>
                    {$user.nome}
                </td>
            </tr>
            <tr>
                <th>
                    Departamento:
                </th>
                <td>
                    {$user.dept}
                </td>
            </tr>
            <tr>
                <th>
                    Filial:
                </th>
                <td>
					<Filtro options={$filiais_validas} bind:value={$filial} label=''/>
                </td>
            </tr>
        </table>
        <div class='campo'>
        <h2>Anexo</h2>
			<Anexos bind:addFiles bind:files={anexos}/>
        </div>

    </div>
    <form class='container' on:submit|preventDefault={onSubmit}>
        <label>
            Assunto
            <input class='campo filled container assunto' 
            bind:value={assunto}/>
        </label>
        <label>
            Descrição
            <textarea
            class='campo filled container descr' 
            bind:value={mensagem} 
            on:paste|preventDefault={({clipboardData:{files}})=>addFiles(files)}/>
        </label>
        <div class='buttons'>
            <input type=submit value='Abrir chamado' class='action button'>
        </div>
    </form>
</div>
<style>
    label {
        display: flex;
        flex-flow: column;
    }
	h1 {
		text-align: center;
		font-size: medium;
	}
    .filled.container:not(.assunto) {
        flex-flow: row;
		margin: auto;
		padding: 1em;
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
	.container * {
		margin-top: 1em;
	}
    .campo {
        font-size: small;
        --fill-color: white;
        padding: 1em;
        margin: 1em;
    }
    .assunto {
        margin: 0;
        margin-bottom: 1em;
        width: auto;
        display: flex;
        flex-flow: row;
    }
	.descr {
        max-height: 30em;
		align-self: flex-end;
		min-width: 15em;
		min-height: 10em;
        margin: auto;
        resize: none;
    }
    .action.button {
        text-transform: uppercase;
        padding: 0.6em;
        border-radius: 0.5em;
        margin: 1em;
    }
</style>