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
	import { post } from '$lib/utils/cadastros.js';
	let titulo = '', descr = '';
	let anexos;
	$: console.log(mensagem)
	async function onSubmit() {
		let os = {
			assunto,
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

		await post('processos', 'suporte_tecnico', os).then(()=>history.back())
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