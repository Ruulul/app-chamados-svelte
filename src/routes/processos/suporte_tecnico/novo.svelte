<script context='module'>
	export async function load () {
		return {
			stuff: {
				title: 'Abrir chamado',
                tag: 'suporte_tecnico'
			},
		}
	}
</script>
<script>
	import Filtro from '$lib/components/Filtro.svelte';
    import Novo from '../novo_template.svelte';
	import { user } from '$lib/stores/user';
	import { filiais_validas, filial } from '$lib/utils/filial';
	import { post, getDepts } from '$lib/utils/cadastros.js';
    import { sendEmail } from '$lib/utils/email'
	let titulo = '', descr = '';
	let anexos, email = 'suporte.ti@ourobrancoagronegocios.com.br';
    //let departamentos = []
    //let departamento_id
    //getDepts('abrir_os').then(depts=>{
    //    departamentos=depts
    //    departamento_id=departamentos[0].id
    //})
    //$: switch($filial) {
    //    case '0101':
    //        console.log("in switch 01")
    //        departamento_id = 9
    //        break;
    //    case '0201':
    //        console.log("in switch 02")
    //        departamento_id = 22
    //        break;
    //    case '0401':
    //        console.log("in switch 04")
    //        departamento_id = 29
    //        break;
    //    default:
    //        console.log($filial)
    //}
    //$: departamento_id, email = departamentos?.find(departamento=>departamento.id===departamento_id)?.email.valor
    //$: console.log(email)
	async function onSubmit() {
		let os = {
			mensagem:
				{
					idUsuario: $user.id,
					descr,
                    titulo
				}
			,
			anexos,
			idUsuario: $user.id,				//Alterar depois para suportes
			dept: $user.dept,			//	''		''		''		''
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

		await post('processo', 'suporte_tecnico', os)
        .then((os)=>sendEmail('open', email, { idOS: os.id, assunto: titulo, tag: os.Tag }))
        .then(()=>history.back())
        .catch(console.error)
	}
</script>

<h1>Abrir Chamado</h1>

<Novo {onSubmit} bind:anexos bind:titulo bind:descr>
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
</Novo>
<style>
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