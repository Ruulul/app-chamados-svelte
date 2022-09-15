<script>
    import { tipos_os, categorias_os } from "$lib/stores/local_db";
    import Accordion from "./_Accordion.svelte";
    import { config } from "$lib/utils/db";

    let item = {}
    /** @type {HTMLDialogElement} */
    let dialog_tipo
    /** @type {HTMLDialogElement} */
    let dialog_categoria

    function openEdit(type) {
        switch (type) {
            case 'tipo':
                return {
                    on: function (t) {
                        item = t;
                        console.log(dialog_tipo)
                        dialog_tipo.showModal();
                    }
                };
            case 'categoria':
                return {
                    on: function (t) {
                        item = t
                        dialog_categoria.showModal();
                    }
                };
            default:
                return {
                    on: void this
                };
        };
    }
</script>
<Accordion title='Tipos' items={$tipos_os}>
    <li slot='first-items' class='tab'>Adicionar Tipo</li>
    <li slot='item' let:item class='tab'>
        <i on:click={()=>config.deleteTipo(item)} class='fas fa-close'/>
        <i on:click={openEdit('tipo').on(item)} class='fas fa-pen'/>
        <Accordion wrap={false} title={item.tipo} items={$categorias_os.filter(categoria=>categoria.tipo===item.tipo)}>
            <li slot='item' let:item class='tab'>
                <i on:click={()=>config.deleteCategoria(item)} class='fas fa-close'/>
                <i on:click={openEdit('categoria').on(item)} class='fas fa-pen'/>
                {item.categoria}
            </li>
        </Accordion>
    </li>
</Accordion>
<dialog bind:this={dialog_tipo}>
    Editar {item.tipo}
</dialog>
<dialog bind:this={dialog_categoria}>
    Editar {item.categoria}
</dialog>
<style>
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