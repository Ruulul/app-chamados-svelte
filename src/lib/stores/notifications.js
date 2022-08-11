import { scopedStore } from "$lib/utils/utils";
import { derived, get, writable } from "svelte/store";
import { cadastros } from "./cadastros";
import { servicos } from "./servicos";

export const notifications = createNotifications()

function createNotifications() {
    const { subscribe } = derived([cadastros, servicos],  function define ([c, s]) {
            let n = []
            n = [...n, ...(Array.isArray(c) ? c.map(s=>({...s, titulo: s.log[0].titulo, type: s.Tag})) : [])]
            n = [...n, ...(Array.isArray(s) ? s.map(s=>({...s, titulo: s.assunto, type: 'suporte técnico'})) : (console.log(s), []))]
            sanitize(n)
            return n
        })
    return {
        subscribe
    }

    function sanitize (n) {
        for (let i of n) {
            n = n.filter(s=>s.id!=i.id)
            n.push(i)
        }
        n.sort((a, b)=>a.id - b.id)
        return n
    }
}