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
    let loading = false;
	async function onSubmit() {
		let os = {
			mensagem:
				{
					idUsuario: $user.id,
                    titulo,
					descr,
				}
			,
			anexos,
			idUsuario: $user.id,				//Alterar depois para suportes
			dept: $user.dept,			//	''		''		''		''
            filial: $filial,
            status: 'em analise',
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

        loading = true;
		await post('processo', 'suporte_tecnico', os)
            .then((os)=>sendEmail('open', [email, $user.email], { idOS: os.id, assunto: titulo, tag: os.Tag, nome: $user.nome }))
            .then(()=>history.back())
            .catch(console.error)
        loading = false;
	}
</script>

<h1>Abrir Chamado</h1>

<Novo {onSubmit} bind:anexos bind:titulo bind:descr bind:loading>
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