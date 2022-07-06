import { goto } from "$app/navigation";
import { get_servicos } from "$lib/utils/servicos";
import { get, writable } from "svelte/store";

export const servicos = createServicos()

export const filtro = writable(undefined)
export const tipo_filtro = writable(undefined)

function createServicos () {
    const { subscribe, set } = writable([], function start (set) {
        getServicos(set)
        let handle = setInterval(()=>getServicos(set), 1000)
        return ()=>clearInterval(handle)
    })

    return { subscribe, async update(){return await getServicos(set)} }

    async function getServicos (set) {
        get_servicos(get(filtro), get(tipo_filtro))
            .then((oss)=>{
                if (oss=='Não autorizado') goto('/login')
                set(oss)
            })
            .catch(()=>set([]))
    }
}