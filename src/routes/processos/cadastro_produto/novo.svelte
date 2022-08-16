<script context='module'>
	export async function load () {
		return {
			stuff: {
				title: 'Novo Cadastro',
                tag: 'cadastro_produto'
			},
		}
	}
</script>
<script>
	import Filtro from '$lib/components/Filtro.svelte';
    import Novo from '../novo_template.svelte';
    import { filiais_validas } from '$lib/utils/filial';
    import { post, getDepts, getOpcoes,  } from '$lib/utils/cadastros';
	let titulo = '', descr = '', anexos=[], unidade = '', departamento_id, departamentos=[];
    let unidades = [], filiais = [], filial = '';
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
            dept: departamento_id,
            anexos
		}

		await post('processos', 'cadastro_produto', os).then(()=>history.back())
        .catch(console.error)
	}
	</script>
<Novo {onSubmit} bind:anexos bind:titulo bind:descr>
    <h1>Novo Cadastro</h1>
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
</Novo>
<style>
    .hidden {
        display: none;
    }
	h1 {
		text-align: center;
		font-size: medium;
	}
    table {
        display: grid;
    }
    tr {
        padding: 0.5em;
        border-bottom: 0.1em var(--dark) solid;
    }
</style>