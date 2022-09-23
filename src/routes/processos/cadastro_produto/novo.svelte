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
	import { filiais_validas, filial } from '$lib/utils/filial';
    import { post, getDepts, getOpcoes,  } from '$lib/utils/cadastros';
    import { sendEmail } from '$lib/utils/email';
    import { user } from '$lib/stores/user';
	let titulo = '', descr = '', anexos=[], unidade = '', departamento_id, departamentos=[];
    let unidades = [];
    let is_opening_to_own_dept = false;
    let validate_only = false;
    getDepts('cadastro_produto', 'cadastro_produto').then(depts=>{
        departamentos=depts
        departamento_id=departamentos[0].id
    })
    $: email = departamentos?.find(departamento=>departamento.id===departamento_id)?.email.valor
    getOpcoes('etapa', 'cadastro_produto', 'unidade').then(data=>{
        unidades=data
        unidade=unidades[0]
    })
	async function onSubmit() {
		let os = {
			mensagem: {
                titulo,
                descr
            },
            unidade: departamento_id===17 ? '' : unidade,
            status: /*validate_only && is_opening_to_own_dept ? 'fechado' : */'pendente',
            email,
            dept: departamento_id,
            anexos,
		}

		await post('processo', 'cadastro_produto', os)
        .then((os)=>sendEmail('open', [email, $user.email], { idOS: os.id, assunto: titulo, tag: os.Tag, nome: $user.nome }))
        .then(()=>history.back())
        .catch(console.error)
	}
    $: departamento_id, console.log($user.dept)
    $: departamento_id, console.log(departamentos, departamento_id)
    $: departamento_id, console.log(is_opening_to_own_dept, validate_only)
    $: departamento_id, is_opening_to_own_dept = $user.dept.includes(departamentos.find(dept=>dept.id===departamento_id)?.departamento)
</script>
<template lang="pug">
    Novo('{onSubmit}' titulo_label='Produto' bind:anexos bind:titulo bind:descr)
        h1 Novo Cadastro
        table
            tr
                th Tipo:
                td: Filtro(label='' options!='{[{label:"Sementes", value:23}, {label:"Serviços", value:17}, {label:"Produtos", value:25}, {label:"Imobilizado", value:17}]}' bind:value!='{departamento_id}')
            tr(class:hidden!='{departamento_id===17}')
                th Unidade: 
                td: Filtro(options!='{unidades}' bind:value!="{unidade}" label='')
        //
            tr(class:hidden!='{is_opening_to_own_dept}'): th: label Validação
                input(bind:checked!="{validate_only}"  type='checkbox')
</template>
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