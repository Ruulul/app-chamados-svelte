import { goto } from "$app/navigation";
import { getMany } from "$lib/utils/cadastros";
import { get, writable } from "svelte/store";

export const cadastros = createCadastros()

export const filtros = writable({
    cadastros:[],
    limit:5,
    page:1
    })

function createCadastros () {
    const { subscribe, set } = writable([], function start (set) {
        console.log("Start cadastros")
        setCadastros(set)
        let handle = setInterval(()=>setServicos(set), 1000)
        return ()=>clearInterval(handle)
    })

    return { subscribe, async update(){return await setCadastros(set)} }

    async function setCadastros (set) {
        let filtro = get(filtros)
        let {cadastros, limit, page} = filtro
        getMany('processos','cadastro_produto',cadastros, {limit, page})
            .then((oss)=>{
                if (oss=='Não autorizado') goto('/login')
                set(oss)
            })
            .catch((e)=>{
                console.log(e)
                set([])
            })
    }
}