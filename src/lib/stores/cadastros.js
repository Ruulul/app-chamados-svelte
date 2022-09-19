import { browser } from "$app/env";
import { goto } from "$app/navigation";
import { getMany } from "$lib/utils/cadastros";
import { filterPendente } from "$lib/utils/utils";
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
        let handle = setInterval(()=>setCadastros(set), 10000)
        return ()=>clearInterval(handle)
    })

    return { subscribe, async update(){return await setCadastros(set)} }

    async function setCadastros (set) {
        let filtro = get(filtros)
        let {cadastros, limit, page} = filtro
        getMany('processo','doesnt_really_matter',cadastros, {limit, page})
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

export const notifications = createNotifications()

let unsub
if (browser) unsub = notifications.subscribe(new_data=>window.localStorage.setItem('notifications', JSON.stringify(new_data)))
function createNotifications () {
    const { subscribe, update } = writable({}, function start (set) {
        let storage = window.localStorage.getItem('notifications');
        let data = {}
        if (storage) data = JSON.parse(storage)
        
        getMany('processo')
        .then(processos=>processos.filter(filterPendente).map(p=>[p.id, data[p.id] || 0]))
        .then(processos=>set(Object.fromEntries(processos)))

        return function stop () {
            unsub()
        }
    });

    return {
        subscribe,
        isNotRead: p => get({subscribe})[p.id] !== p.log.sort((a, b)=>b.id - a.id).at(0).id,
        markAsRead(id, last_msg_id) {
            update(data=>{
                data[id] = last_msg_id;
                return data;
            })
        },
        removeEntry(id) {
            update(data=>{
                delete data[id];
                return data;
            })
        },
    }
}