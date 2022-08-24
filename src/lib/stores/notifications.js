import { goto } from "$app/navigation";
import { getMany, getCount } from "$lib/utils/cadastros";
import { get, readable, writable } from "svelte/store";

export const processos = createProcessos()

export const filtros = writable({
    chamados:[['status', 'pendente']],
    limit:5,
    page:1
    })

export const count = writable(0);
export const pages = writable(0);

function createProcessos () {
    const { subscribe, set } = writable([], function start (set) {
        console.log("Start servicos")
        setProcessos(set)
        let handle = setInterval(()=>setProcessos(set), 3000)
        return ()=>clearInterval(handle)
    })

    return { subscribe, async update(){return await setProcessos(set)} }

    async function setProcessos (set) {
        let filtro = get(filtros)
        let {chamados, limit, page} = filtro
        await getMany('processo')
            .then((oss)=>{
                if (oss=='Não autorizado') return goto('/login')
                set(oss)
                count.set(oss.length)
            })
            .catch((e)=>{
                console.log(e)
                set([])
            })
    }
}