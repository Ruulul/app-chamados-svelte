<script>
    import { tipos_os, categorias_os } from "$lib/stores/local_db";
    import Accordion from "./_Accordion.svelte";
    import { config } from "$lib/utils/db";

    let item = {}
    /** @type {HTMLDialogElement} */
    let dialog_tipo
    /** @type {HTMLDialogElement} */
    let dialog_categoria
    /** @type {HTMLDialogElement} */
    let dialog_criar

    function openEdit(type) {
        switch (type) {
            case 'tipo':
                return {
                    on (t) {
                        item = {...t};
                        console.log(dialog_tipo)
                        dialog_tipo.showModal();
                    }
                };
            case 'categoria':
                return {
                    on (t) {
                        item = {...t}
                        dialog_categoria.showModal();
                    }
                };
            case 'new':
                return {
                    on: function (t) {
                        item = {};
                        switch (t) {
                            case 'tipo':
                                item.tipo = '';
                            case 'categoria':
                                item.categoria = '';
                                dialog_criar.showModal();
                        }
                    }
                };
        };
    }
</script>
<Accordion title=Tipos items={$tipos_os}>
    <li slot=first-items class=tab on:click={()=>openEdit('new').on('tipo')}>Adicionar Tipo</li>
    <li slot=item let:item class=tab>
        <i on:click={()=>config.deleteTipo(item)} class='fas fa-close'/>
        <i on:click={openEdit('tipo').on(item)} class='fas fa-pen'/>
        <Accordion wrap={false} title={item.tipo} items={$categorias_os.filter(categoria=>categoria.tipo===item.tipo)}>
            <li slot=item let:item class=tab>
                <i on:click={()=>config.deleteCategoria(item)} class='fas fa-close'/>
                <i on:click={openEdit('categoria').on(item)} class='fas fa-pen'/>
                {item.categoria}
            </li>
        </Accordion>
    </li>
</Accordion>
<dialog bind:this={dialog_tipo}>
    <form on:submit|preventDefault={()=>config.editarTipo(item, item)}>
        ID - {item.id}
        <label>
            Tipo - <input bind:value={item.tipo}>
        </label>
        <input type=submit value=Atualizar>
    </form>
</dialog>
<dialog bind:this={dialog_categoria}>
    <form on:submit|preventDefault={()=>config.editarCategoria(item, item)}>
        ID - {item.id}
        <label>
            Tipo - <input bind:value={item.tipo}>
        </label>
        <label>
            Categoria - <input bind:value={item.categoria}>
        </label>
        <input type=submit value=Atualizar>
    </form>
</dialog>
<dialog bind:this={dialog_criar}>
    <form on:submit|preventDefault={()=>config.addCategoria(item)}>
        <label>
            Tipo - <input bind:value={item.tipo}>
        </label>
        <label>
            Categoria - <input bind:value={item.categoria}>
        </label>
        <input type=submit value=Atualizar>
    </form>
</dialog>
<style>
    dialog {
        width: 20em;
    }
    form {
        display: flex;
        flex-flow: column;
        align-items: left;
        gap: 2em;
    }
    label {
        display: grid;
    }
    .tab {
        display: block;
        overflow: hidden;
        font-size: 1.3rem;
        border-radius: 1em;
        padding: 0.5em;
        cursor: pointer;
    }
    li {
        gap: 1em;
        display: flex;
        flex-flow: column;
    }
    li * {
        margin-right: 1em;
    }
</style>