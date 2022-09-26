<script>
    import { user_names } from '$lib/stores/user'
    export let id

    $: nome = $user_names[id]
</script>
<template lang=pug>
    +if('$user_names[id]')
        td {$user_names[id]}
        +else()
            +await('user_names.add(id)')
                td Carregando...
                +then('_')
                    td {$user_names[id]}
</template>

<style>
    * {
        text-align: center;
    }
</style>