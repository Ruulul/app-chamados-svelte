<script>
    import Anexos from '$lib/components/Anexos.svelte'
    export let titulo = ''
    export let descr = ''
    export let anexos = []
    export let onSubmit
    let addFiles;
</script>
<div class='filled container'>
    <div class='wrapper'>
        <slot/>
        <div class='campo'>
        <h2>Anexo</h2>
			<Anexos bind:addFiles bind:files={anexos}/>
        </div>
    </div>
    <form class='container' on:submit|preventDefault={onSubmit}>
        <label>
            Assunto
            <input class='campo filled container assunto' 
            bind:value={titulo}/>
        </label>
        <label>
            Descrição
            <textarea
            class='campo filled container descr' 
            bind:value={descr} 
            on:paste|preventDefault={({clipboardData:{files}})=>addFiles(files)}/>
        </label>
        <div class='buttons'>
            <input type=submit value='Abrir chamado' class='action button'>
        </div>
    </form>
</div>

<style>
    label {
        display: flex;
        flex-flow: column;
        gap: 1em;
    }
    .filled.container:not(.assunto) {
        flex-flow: row;
		margin: auto;
		padding: 1em;
    }
    .wrapper {
        justify-content: flex-start;
        border-right: var(--dark) solid;
        padding-right: 2em;
    }
    .campo {
        font-size: small;
    }
	.container * {
		margin-top: 1em;
	}
    .campo {
        font-size: small;
        --fill-color: white;
        padding: 1em;
        margin: 1em;
        border: none;
    }
    .assunto {
        margin: 0;
        margin-bottom: 1em;
        width: auto;
        display: flex;
        flex-flow: row;
    }
	.descr {
        max-height: 30em;
		align-self: flex-end;
		min-width: 15em;
		min-height: 10em;
        margin: auto;
        resize: none;
    }
    .action.button {
        text-transform: uppercase;
        padding: 0.6em;
        border-radius: 0.5em;
        margin: 1em;
    }
</style>