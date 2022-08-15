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
    import { filiais_validas } from '$lib/utils/filial';
    import { post, getDepts, getOpcoes,  } from '$lib/utils/cadastros';
	let titulo = '', descr = '', unidade = '', departamento_id, departamentos=[];
    let unidades = [], filiais = [], filial = '';
	let addFiles, anexos;
    getDepts('cadastro_produto').then(depts=>{
        departamentos=depts
        departamento_id=departamentos[0].id
    })
    $: email = departamentos?.find(departamento=>departamento.id===departamento_id)?.email.valor
    getOpcoes('etapa', 'cadastro_produto','unidade').then(data=>{
        unidades=data
        unidade=unidades[0]
    })
    $: $filiais_validas, getOpcoes('processo', 'cadastro_produto', 'filial').then(data=>{
        filiais = data.filter(item=>$filiais_validas.includes(item));
        filial = filiais[0]
    })
	async function onSubmit() {
		let os = {
			mensagem: {
                titulo,
                descr
            },
            unidade: departamento_id===17 ? '' : unidade,
            filial,
            status: 'pendente',
            email,
            dept: departamento_id
		}

		await post('processos', 'cadastro_produto', os).then(()=>history.back())
        .catch(console.error)
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
                    <Filtro options={filiais} bind:value={filial} label=''/>
                </td>
            </tr>
            <tr>
                <th>
                    Tipo:
                </th>
                <td>
                    <Filtro 
                        label=''
                        options={[
                            {label:'Sementes', value:23},
                            {label:'Serviços', value:17},
                            {label:'Produtos', value:25},
                        ]}
                        bind:value={departamento_id}
                    />
                </td>
            </tr>
            <tr class:hidden={departamento_id===17} >
                <th>
                    Unidade:
                </th>
                <td>
                    <Filtro options={unidades} bind:value={unidade} label=''/>
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
            Nome do produto
            <input class='campo filled container assunto' 
            bind:value={titulo}/>
        </label>
        <label>
            Descrição
            <textarea 
            class='campo filled container descr' 
            bind:value={descr} 
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
    .hidden {
        display: none;
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