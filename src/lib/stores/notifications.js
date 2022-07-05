import { scopedStore } from "$lib/utils/utils";
import { get, writable } from "svelte/store";

export const notifications = createNotifications()

function createNotifications() {
    const { set, subscribe, update } = scopedStore([])
    return {
        subscribe,
        flush () {
            set([])
        },
        push (new_notification) {
            let notifications_id = get(this).map(n=>n.id)
            let id;
            if (new_notification.id)
            id = new_notification.id
            else id = notifications_id.length > 0 ? Math.max(...notifications_id) + 1 : 0
            update(
                n=>[...n, 
                    {
                        ...new_notification, 
                        id, 
                        pop:()=>this.pop(id), 
                        readed: false, 
                        read(){
                            update(n=>{
                                let index = n.findIndex(n=>n.id===id)
                                if (index >= 0) n[index].readed = true
                                return n;
                            })
                        }
                    }
                ]
            )
        },
        pop (id) {
            update(n=>n.filter(n=>n.id!=id))
        }
    }
}