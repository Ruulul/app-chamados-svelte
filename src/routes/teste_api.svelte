<script context='module'>
    export async function load() {
        return {
            stuff: {
                title: 'teste API'
            }
        }
    }
</script>
<script>
    import { browser } from '$app/env'
    let base_url = 'https://10.0.0.5:5000/api/'
    let get_link = ''
    let action_link = ''
    let action = 'POST'
    let body = ''
    let stuff = []
    let action_stuff = ''
    const options = {credentials: 'include', headers: new Headers([['Content-Type', 'application/json']])}
    const doStuff = ()=>{
        stuff = []
        return fetch(base_url + get_link, {...options, method: 'GET'})
        .then(async response=>await response.text())
        .then(text=>{
            try {
                return JSON.parse(text)
            } catch {
                return text
            }
        })
        .then(data=>stuff=data)

    }
    $: if(browser && get_link) doStuff()
    $: console.log(stuff)

    async function actionFn () {
        action_stuff = ''
        await fetch(base_url + action_link, {...options, method: action, body})
        .then(async response=>await response.text())
        .then(text=>{
            try {
                return JSON.parse(text)
            } catch {
                return text
            }
        })
        .then(parsed=>action_stuff=parsed);
        await doStuff()
    }
</script>
<div class='wrapper'>
    <div class='filled container'>
        <label>
            base_url: <input value={base_url} on:blur={({target:{value}})=>base_url = value}/>
        </label>
        <span>{base_url}</span>
    </div>
    
    <div class='filled container'>
        <label>
            get_link: <input value={get_link} on:blur={({target:{value}})=>get_link = value}/>
        </label> <button on:click={doStuff}>manual GET</button>
        <span>{get_link}</span>
        <span>{base_url + get_link}</span>
    </div>
    
    <div class='filled container'>
        <form on:submit|preventDefault={actionFn}>
            <label>
                action_link: <input value={action_link} on:blur={({target:{value}})=>action_link = value}/>
            </label>
            <label>
                action: <input value={action} on:blur={({target:{value}})=>action = value}/>
            </label>
            <label>
                bodys: <textarea value={body} on:blur={({target:{value}})=>body = value}/>
            </label>
            <button>{action}</button>
            <span>{action_link}</span>
            <span>{base_url + action_link}</span>
            <span>{body}</span>
            <p>
                {JSON.stringify(action_stuff, undefined, 4)}
            </p>
        </form>
    </div>
</div>

<div class='filled container'>
    <p>{stuff}</p>
    {#each Object.entries(stuff) as thing}
    <pre>
        {thing[0]}: {JSON.stringify(thing[1], undefined, 4)}
    </pre>
    {/each}
</div>

<style>
    .wrapper {
        flex-flow: row;
        margin-top: 2em
    }
    form, form * {
        display: block;
        
    }
    * {
        margin: auto;
        gap: 5em;
    }
</style>