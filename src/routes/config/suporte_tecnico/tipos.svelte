<script>
    import { tipos_os } from "$lib/stores/local_db";
    
    </script>
    <h2>
        Tipos
    </h2>
    <input type='checkbox' id='cat-cb'>
    <div class='tab'>
        <label class='tab' for='cat-cb'>Tipos</label>
        <ul class='tab-content'>
            <li class='tab'>Adicionar Tipo</li>
            {#each $tipos_os.sort((a, b)=>b.tipo<a.tipo) as {tipo, id}}
            <li class='tab'><i class='fas fa-close'/><i class='fas fa-pen'/>{tipo} (id {id})</li>
            {/each}
        </ul>
    
    </div>
    
    <style>
        input {
            opacity: 0;
        }
        .tab {
            display: block;
            overflow: hidden;
            font-size: larger;
            border-radius: 1em;
            padding: 0.5em;
            cursor: pointer;
        }
        .tab > .tab-content {
            overflow: hidden;
            max-height: 0;
            transition: all 1s;
        }
        input:checked + .tab > .tab-content {
            max-height: 100vh;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            gap: 1em;
        }
        li * {
            margin-right: 1em;
        }
    </style>