<script context='module'>
	export async function load () {
		return {
			stuff: {
				title: 'Novo Cadastro'
			},
		}
	}
</script>
<script>
	import Anexos from '$lib/components/Anexos.svelte';
	import Filtro from '$lib/components/Filtro.svelte';
	import { user } from '$lib/stores/user';
	import { filiais_validas, filial } from '$lib/utils/filial';
    import { abrirOS as abrirOs } from '$lib/utils/cadastros';
	let assunto = '', mensagem = '';
	let addFiles, anexos;
	$: console.log(mensagem)
	async function onSubmit() {
		let os = {
			assunto,
			chat: [
				{
					autorId: $user.id,
					mensagem
				}
			],
			anexos,
			autorId: $user.id,
			usuarioId: $user.id,				//Alterar depois para suportes
			departamento: $user.dept			//	''		''		''		''
		}

		await abrirOs(os).then(()=>history.back())
	}
	</script>
<h1>Novo Cadastro</h1>
<div class='filled container'>
    <div class='wrapper'>
        <table> 
            <tr>
                <th>
                    Filial:
                </th>
                <td>
                    <Filtro options={$filiais_validas} bind:value={$filial} label=''/>
                </td>
            </tr>
            <tr>
                <th>
                    Produto:
                </th>
                <td>
                    <Filtro 
                        label=''
                        options={[
                            'Sementes',
                            'Serviços',
                            'Outros',
                        ]}
                    />
                </td>
            </tr>
        </table>
        <div class='campo'>
        <h2>Anexo</h2>
            <Anexos bind:addFiles bind:files={anexos}/>
        </div>

    </div>
    <form class='container' on:submit|preventDefault={onSubmit}>
        <div class='campo filled container assunto'>
            <span contenteditable bind:innerHTML={assunto}/>
            <span class='placeholder'>Nome do Produto</span>
        </div>
        <div>
            <pre 
                class='campo filled container descr' 
                contenteditable bind:innerHTML={mensagem} 
                on:input={({data})=>{if (data == '\x13') assunto += '\n<br>'}}
                on:paste|preventDefault={({clipboardData:{files}})=>addFiles(files)}/>
            <span class='placeholder'>Motivo da Requisição</span>
        </div>
            <div class='buttons'>
                    <input type=submit value='Abrir chamado' class='action button'>
            </div>
    </form>
</div>
<style>
	[contenteditable] {
		font-family: monospace;
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
	.assunto span {
		margin-top: 0;
		min-width: 10em;
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
    .assunto span {
        border-radius: 2em;
    }
	.descr {
        max-height: 30em;
		align-self: flex-end;
		min-width: 15em;
		min-height: 10em;
        margin: auto;
    }
    .placeholder {
        position: absolute;
        pointer-events: none;
        top: 1em;
        left: 10em;
        background-color: white;
        opacity: 0;
        transition: opacity 0.5s;
    }
    :focus:empty + span.placeholder {
        opacity: 1;
    }
    .action.button {
        text-transform: uppercase;
        padding: 0.6em;
        border-radius: 0.5em;
        margin: 1em;
    }
</style>