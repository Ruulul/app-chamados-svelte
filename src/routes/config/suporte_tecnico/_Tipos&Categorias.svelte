<script>
    import { tipos_os, categorias_por_tipo_os } from "$lib/stores/local_db";
    import Accordion from "./_Accordion.svelte";
</script>
<Accordion title='Tipos' items={$tipos_os}>
    <li slot='first-items' class='tab'>Adicionar Tipo</li>
    <li slot='item' let:item class='tab'>
        <i class='fas fa-close'/>
        <i class='fas fa-pen'/>
        <Accordion wrap={false} title={item.tipo} items={$categorias_por_tipo_os[item.tipo]}>
            <li slot='item' let:item class='tab'>
                <i class='fas fa-close'/>
                <i class='fas fa-pen'/>
                {item}
            </li>
        </Accordion>
    </li>
</Accordion>
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