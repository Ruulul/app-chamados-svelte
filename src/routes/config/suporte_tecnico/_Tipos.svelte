<script>
    import { tipos_os } from "$lib/stores/local_db";
    import Accordion from "./_Accordion.svelte";
</script>
<Accordion title='Tipos' items={$tipos_os}>
    <li slot='first-items' class='tab'>Adicionar Tipo</li>
    <li slot='item' let:item class='tab'>
        <i class='fas fa-close'/>
        <i class='fas fa-pen'/>
        {item.tipo} (id {item.id})
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