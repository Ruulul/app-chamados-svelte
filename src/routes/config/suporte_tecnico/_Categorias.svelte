<script>
import { categorias_os } from "$lib/stores/local_db";
import Accordion from "./_Accordion.svelte";
</script>
<Accordion title='Categorias' items={$categorias_os}>
    <li slot='first-items' class='tab'>Adicionar Categoria</li>
    <li slot='item' let:item class='tab'>
        <i class='fas fa-close'/>
        <i class='fas fa-pen'/>
        {item.tipo} - {item.categoria} (id {item.id})
    </li>
</Accordion>
<style>
    .tab {
        display: block;
        overflow: hidden;
        font-size: larger;
        border-radius: 1em;
        padding: 0.5em;
        cursor: pointer;
    }
    li {
        gap: 1em;
    }
    li * {
        margin-right: 1em;
    }
</style>