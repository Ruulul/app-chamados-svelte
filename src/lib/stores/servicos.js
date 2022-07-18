import { goto } from "$app/navigation";
import { getServicos } from "$lib/utils/servicos";
import { get, writable } from "svelte/store";

export const servicos = createServicos()

export const filtro = writable(undefined)
export const tipo_filtro = writable(undefined)

function createServicos () {
    const { subscribe, set } = writable([], function start (set) {
        setServicos(set)
        let handle = setInterval(()=>setServicos(set), 1000)
        return ()=>clearInterval(handle)
    })

    return { subscribe, async update(){return await setServicos(set)} }

    async function setServicos (set) {
        getServicos(get(filtro), get(tipo_filtro))
            .then((oss)=>{
                if (oss=='Não autorizado') goto('/login')
                set(oss)
            })
            .catch(()=>set([]))
    }
}