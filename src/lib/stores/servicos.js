import { goto } from "$app/navigation";
import { getServicos, getServicosCount, getServicosPageCount } from "$lib/utils/servicos";
import { get, readable, writable } from "svelte/store";

export const servicos = createServicos()

export const filtros = writable({
    chamados:[['status', 'pendente']],
    limit:5,
    page:1
    })

export const count = writable(0);
export const pages = writable(0);

function createServicos () {
    const { subscribe, set } = writable([], function start (set) {
        console.log("Start servicos")
        setServicos(set)
        let handle = setInterval(()=>setServicos(set), 10000)
        return ()=>clearInterval(handle)
    })

    return { subscribe, async update(){return await setServicos(set)} }

    async function setServicos (set) {
        let filtro = get(filtros)
        let {chamados, limit, page} = filtro
        await getServicos(chamados, {limit, page})
            .then((oss)=>{
                if (oss=='Não autorizado') return goto('/login')
                set(oss)
            })
            .catch((e)=>{
                console.log(e)
                set([])
            })
        await Promise.all([
            getServicosCount(chamados).then(count.set),
            getServicosPageCount(chamados, limit).then(pages.set)
        ]);
    }
}